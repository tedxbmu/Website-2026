require("dotenv").config();

const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");

const repoRoot = path.resolve(__dirname, "../../..");
const xlsxPath = path.join(repoRoot, "certificates/TEDxBMU 2026 OC.xlsx");
const pdfDir = path.join(repoRoot, "certificates/TEDxBMU 2026 OC Certificates");
const outPath = path.join(repoRoot, "backend/src/modules/feedback/certificateRecipients.js");

const escapeJsString = (value) => value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const generateCertificateRecipients = async () => {
  const pdfs = fs.readdirSync(pdfDir).filter((file) => file.endsWith(".pdf"));
  const pdfBySerial = {};

  for (const file of pdfs) {
    const match = file.match(/pages-(\d+)\.pdf$/i);
    if (match) {
      pdfBySerial[Number(match[1])] = file;
    }
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);
  const sheet = workbook.worksheets[0];
  const rows = [];

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    const serialNo = Number(row.getCell(1).value);
    const name = String(row.getCell(2).value || "").trim();
    const email = String(row.getCell(3).value || "").trim().toLowerCase();
    const designation = String(row.getCell(4).value || "").trim();

    if (!name) return;

    const certificateFile = pdfBySerial[serialNo];
    if (!certificateFile) {
      throw new Error(`Missing PDF for serial ${serialNo}: ${name}`);
    }

    rows.push({ serialNo, name, email, designation, certificateFile });
  });

  const lines = rows.map((row) => {
    const emailPart = row.email ? `"${escapeJsString(row.email)}"` : '""';
    const designationPart = row.designation
      ? `"${escapeJsString(row.designation)}"`
      : '""';

    return `  { serialNo: ${row.serialNo}, name: "${escapeJsString(row.name)}", email: ${emailPart}, designation: ${designationPart}, certificateFile: "${escapeJsString(row.certificateFile)}" },`;
  });

  const content = `const certificateRecipients = [
${lines.join("\n")}
];

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

const normalizeName = (name) =>
  (name || "")
    .trim()
    .toLowerCase()
    .replace(/\\s+/g, " ");

const findCertificateRecipient = ({ email, name }) => {
  const cleanEmail = normalizeEmail(email);
  const cleanName = normalizeName(name);

  if (cleanEmail) {
    const byEmail = certificateRecipients.find(
      (recipient) => recipient.email && normalizeEmail(recipient.email) === cleanEmail
    );

    if (byEmail) return { ...byEmail, matchType: "email" };
  }

  const byNameWithoutEmail = certificateRecipients.find(
    (recipient) => !recipient.email && normalizeName(recipient.name) === cleanName
  );

  if (byNameWithoutEmail) return { ...byNameWithoutEmail, matchType: "name" };

  return null;
};

module.exports = {
  certificateRecipients,
  findCertificateRecipient,
  normalizeEmail,
  normalizeName,
};
`;

  fs.writeFileSync(outPath, content);
  console.log(`[CERT-GEN] Wrote ${rows.length} recipients to ${outPath}`);
};

generateCertificateRecipients().catch((error) => {
  console.error("[CERT-GEN] Failed:", error.message);
  process.exit(1);
});
