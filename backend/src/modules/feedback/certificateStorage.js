const fs = require("fs");
const path = require("path");
const supabase = require("../../config/db");

// Must match the exact Supabase Storage bucket name
const CERTIFICATES_BUCKET = process.env.CERTIFICATES_BUCKET || "TEDxBMU 2026 OC Certificates";

const getLocalCertificatesDir = () =>
  process.env.CERTIFICATES_DIR ||
  path.resolve(__dirname, "../../../../certificates/TEDxBMU 2026 OC Certificates");

const blobToBuffer = async (blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

const downloadCertificate = async (certificateFile) => {
  const { data, error } = await supabase.storage
    .from(CERTIFICATES_BUCKET)
    .download(certificateFile);

  if (error) {
    const wrapped = new Error(error.message || "Unable to download certificate");
    wrapped.code = "CERTIFICATE_STORAGE_DOWNLOAD_FAILED";
    wrapped.originalError = error;
    throw wrapped;
  }

  return blobToBuffer(data);
};

const getLocalCertificatePath = (certificateFile) =>
  path.join(getLocalCertificatesDir(), certificateFile);

const readLocalCertificate = (certificateFile) => {
  const certificatePath = getLocalCertificatePath(certificateFile);

  if (!fs.existsSync(certificatePath)) {
    const error = new Error("Certificate file is missing locally");
    error.code = "CERTIFICATE_FILE_MISSING";
    error.certificatePath = certificatePath;
    throw error;
  }

  return fs.readFileSync(certificatePath);
};

const getCertificateBuffer = async (certificateFile) => {
  try {
    return await downloadCertificate(certificateFile);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    console.warn(
      "[FEEDBACK] Supabase certificate download failed; falling back to local file:",
      error.message
    );
    return readLocalCertificate(certificateFile);
  }
};

module.exports = {
  CERTIFICATES_BUCKET,
  getCertificateBuffer,
  getLocalCertificatePath,
};
