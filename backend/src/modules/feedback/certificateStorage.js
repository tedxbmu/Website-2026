const fs = require("fs");
const path = require("path");
const supabase = require("../../config/db");

// Must match the exact Supabase Storage bucket name
const CERTIFICATES_BUCKET = process.env.CERTIFICATES_BUCKET || "certificates";

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
    console.warn(
      `[FEEDBACK] Supabase certificate download failed for ${certificateFile}; falling back to local file:`,
      error.message
    );
    
    // In production, the file might not exist locally depending on the host, 
    // but we should always at least attempt to read it rather than strictly throwing.
    return readLocalCertificate(certificateFile);
  }
};

module.exports = {
  CERTIFICATES_BUCKET,
  getCertificateBuffer,
  getLocalCertificatePath,
};
