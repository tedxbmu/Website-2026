require("dotenv").config();

const fs = require("fs");
const path = require("path");
const supabase = require("../config/db");
const {
  certificateRecipients,
} = require("../modules/feedback/certificateRecipients");
const {
  CERTIFICATES_BUCKET,
  getLocalCertificatePath,
} = require("../modules/feedback/certificateStorage");

const uploadCertificates = async () => {
  const uniqueFiles = [...new Set(certificateRecipients.map((item) => item.certificateFile))];

  console.log(`[CERT-UPLOAD] Bucket: ${CERTIFICATES_BUCKET}`);
  console.log(`[CERT-UPLOAD] Files to upload: ${uniqueFiles.length}`);

  let uploaded = 0;

  for (const certificateFile of uniqueFiles) {
    const certificatePath = getLocalCertificatePath(certificateFile);

    if (!fs.existsSync(certificatePath)) {
      throw new Error(`Missing certificate file: ${certificatePath}`);
    }

    const buffer = fs.readFileSync(certificatePath);
    const { error } = await supabase.storage
      .from(CERTIFICATES_BUCKET)
      .upload(certificateFile, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload ${certificateFile}: ${error.message}`);
    }

    uploaded += 1;
    console.log(`[CERT-UPLOAD] ${uploaded}/${uniqueFiles.length} uploaded: ${certificateFile}`);
  }

  console.log("[CERT-UPLOAD] Done.");
};

uploadCertificates().catch((error) => {
  console.error("[CERT-UPLOAD] Failed:", error.message);
  process.exit(1);
});
