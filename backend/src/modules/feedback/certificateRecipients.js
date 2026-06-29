// Source of truth: TEDxBMU 2026 OC.csv
// Certificate files from Supabase Storage bucket: "TEDxBMU 2026 OC Certificates"
const certificateRecipients = [
  { serialNo: 1,  name: "Akshat Kabra",          email: "akshat.kabra.23bmi@bmu.edu.in",          designation: "Licensee",                        certificateFile: "Akshat Kabra TEDxBMU 2026 Certificate-pages-1.pdf" },
  { serialNo: 2,  name: "Rhea s sud",             email: "rheasingh.sud.23bch@bmu.edu.in",          designation: "Co-Licensee",                    certificateFile: "Rhea s sud TEDxBMU 2026 Certificate-pages-2.pdf" },
  { serialNo: 3,  name: "Yakshita Yadav",         email: "yakshita.yadav.23cse@bmu.edu.in",         designation: "Design Lead",                     certificateFile: "Yakshita Yadav TEDxBMU 2026 Certificate-pages-3.pdf" },
  { serialNo: 4,  name: "Radhika Goel",           email: "radhika.goel.23cse@bmu.edu.in",           designation: "Design Lead",                     certificateFile: "Radhika Goel TEDxBMU 2026 Certificate-pages-4.pdf" },
  { serialNo: 5,  name: "Priyal Khullar",         email: "priyal.khullar.23cse@bmu.edu.in",         designation: "Content Lead",                    certificateFile: "Priyal Khullar  TEDxBMU 2026 Certificate-pages-5.pdf" },
  { serialNo: 6,  name: "Aryan Nair",             email: "aryan.nair.23bmi@bmu.edu.in",             designation: "Curation Lead",                   certificateFile: "Aryan Nair TEDxBMU 2026 Certificate-pages-6.pdf" },
  { serialNo: 7,  name: "Bhavyanshi singh",       email: "bhavyanshi.singh.23mec@bmu.edu.in",       designation: "Curation Lead",                   certificateFile: "Bhavyanshi singh TEDxBMU 2026 Certificate-pages-7.pdf" },
  { serialNo: 8,  name: "Sanyam Jain",            email: "sanyam.jain.23cse@bmu.edu.in",            designation: "Event Management Lead",            certificateFile: "Sanyam Jain  TEDxBMU 2026 Certificate-pages-8.pdf" },
  { serialNo: 9,  name: "Tanuj Dhakad",           email: "tanuj.dhakad.23bch@bmu.edu.in",           designation: "Event Management Lead",            certificateFile: "Tanuj Dhakad TEDxBMU 2026 Certificate-pages-9.pdf" },
  { serialNo: 10, name: "Saanvee Sharma",         email: "saanvee.sharma.23cse@bmu.edu.in",         designation: "Social Media and Marketing Lead",  certificateFile: "Saanvee Sharma TEDxBMU 2026 Certificate-pages-10.pdf" },
  { serialNo: 11, name: "Bayyapureddy Vibhugnan", email: "bayyapureddy.vibhugnan.23cse@bmu.edu.in", designation: "Social Media and Marketing Lead",  certificateFile: "Bayyapureddy Vibhugnan  TEDxBMU 2026 Certificate-pages-11.pdf" },
  { serialNo: 12, name: "Ansh Gagneja",           email: "ansh.gagneja.23bmi@bmu.edu.in",           designation: "Sponsorship Lead",                certificateFile: "Ansh Gagneja TEDxBMU 2026 Certificate-pages-12.pdf" },
  { serialNo: 13, name: "Dhiren",                 email: "dhiren.23cse@bmu.edu.in",                 designation: "Video Production Lead",            certificateFile: "Dhiren TEDxBMU 2026 Certificate-pages-13.pdf" },
  { serialNo: 14, name: "Gaurav Ghosh",           email: "gaurav.ghosh.23cse@bmu.edu.in",           designation: "Website Lead",                    certificateFile: "Gaurav Ghosh TEDxBMU 2026 Certificate-pages-14.pdf" },
  { serialNo: 15, name: "Annu",                   email: "annu.24cse@bmu.edu.in",                   designation: "Design Team",                     certificateFile: "Annu TEDxBMU 2026 Certificate-pages-15.pdf" },
  { serialNo: 16, name: "Ashish Agrawal",         email: "ashish.agrawal.25cse@bmu.edu.in",         designation: "Design Team",                     certificateFile: "Ashish Agrawal TEDxBMU 2026 Certificate-pages-16.pdf" },
  { serialNo: 17, name: "Vaibhav jangra",         email: "vaibhav.jangra.25cse@bmu.edu.in",         designation: "Design Team",                     certificateFile: "Vaibhav jangra  TEDxBMU 2026 Certificate-pages-17.pdf" },
  { serialNo: 18, name: "Ajanta Tejaswini",       email: "ajanta.tejaswini.24bbl@bmu.edu.in",       designation: "Content Team",                    certificateFile: "Ajanta Tejaswini  TEDxBMU 2026 Certificate-pages-18.pdf" },
  { serialNo: 19, name: "Kartika Joshi",          email: "kartika.joshi.24cse@bmu.edu.in",          designation: "Content Team",                    certificateFile: "Kartika Joshi  TEDxBMU 2026 Certificate-pages-19.pdf" },
  { serialNo: 20, name: "Vivek Chaudhary",        email: "vivek.chaudhary.24cse@bmu.edu.in",        designation: "Curation Team",                   certificateFile: "Vivek Chaudhary  TEDxBMU 2026 Certificate-pages-20.pdf" },
  { serialNo: 21, name: "Vaibhavi Mittal",        email: "vaibhavi.mittal.25cse@bmu.edu.in",        designation: "Curation Team",                   certificateFile: "Vaibhavi Mittal TEDxBMU 2026 Certificate-pages-21.pdf" },
  { serialNo: 22, name: "Rohini Sen",             email: "rohini.sen.25bah@bmu.edu.in",             designation: "Curation Team",                   certificateFile: "Rohini Sen TEDxBMU 2026 Certificate-pages-22.pdf" },
  { serialNo: 23, name: "Sanaa Ansari",           email: "sanaa.ansari.25bah@bmu.edu.in",           designation: "Curation Team",                   certificateFile: "Sanaa Ansari  TEDxBMU 2026 Certificate-pages-23.pdf" },
  { serialNo: 24, name: "Mahir Yadav",            email: "mahir.yadav.24cse@bmu.edu.in",            designation: "Curation Team",                   certificateFile: "Mahir Yadav TEDxBMU 2026 Certificate-pages-24.pdf" },
  { serialNo: 25, name: "Dev Gupta",              email: "dev.gupta.25cse@bmu.edu.in",              designation: "Curation Team",                   certificateFile: "Dev Gupta TEDxBMU 2026 Certificate-pages-25.pdf" },
  { serialNo: 26, name: "Sarvangi Upadhyay",      email: "sarvangi.upadhyay.25cse@bmu.edu.in",      designation: "Event Management Team",            certificateFile: "Sarvangi Upadhyay TEDxBMU 2026 Certificate-pages-26.pdf" },
  { serialNo: 27, name: "Harnoor singh",          email: "harnoor.singh.25cse@bmu.edu.in",          designation: "Event Management Team",            certificateFile: "Harnoor singh TEDxBMU 2026 Certificate-pages-27.pdf" },
  { serialNo: 28, name: "Yash Tulsani",           email: "yash.tulsani.24cse@bmu.edu.in",           designation: "Event Management Team",            certificateFile: "Yash Tulsani TEDxBMU 2026 Certificate-pages-28.pdf" },
  { serialNo: 29, name: "Shravani Bali",          email: "shravani.bali.25bmi@bmu.edu.in",          designation: "Event Management Team",            certificateFile: "Shravani Bali TEDxBMU 2026 Certificate-pages-29.pdf" },
  { serialNo: 30, name: "kratika Gupta",          email: "kratika.gupta.25cse@bmu.edu.in",          designation: "Event Management Team",            certificateFile: "kratika Gupta  TEDxBMU 2026 Certificate-pages-30.pdf" },
  { serialNo: 31, name: "vismaya H Pradeep",      email: "vismaya.pradeep.25ece@bmu.edu.in",        designation: "Event Management Team",            certificateFile: "vismaya H Pradeep  TEDxBMU 2026 Certificate-pages-31.pdf" },
  { serialNo: 32, name: "Aaryaman Pratap Singh",  email: "aaryamanpratap.singh.24cse@bmu.edu.in",   designation: "Event Management Team",            certificateFile: "Aaryaman Pratap Singh TEDxBMU 2026 Certificate-pages-32.pdf" },
  { serialNo: 33, name: "Binayak Verma",          email: "binayak.verma.25cse@bmu.edu.in",          designation: "Event Management Team",            certificateFile: "Binayak Verma TEDxBMU 2026 Certificate-pages-33.pdf" },
  { serialNo: 34, name: "B R Kaustubh",           email: "br.kaustubh.24bbl@bmu.edu.in",            designation: "Event Management Team",            certificateFile: "B R Kaustubh  TEDxBMU 2026 Certificate-pages-34.pdf" },
  { serialNo: 35, name: "Avni Sharma",            email: "avni.sharma.25cse@bmu.edu.in",            designation: "Social Media and Marketing",       certificateFile: "Avni Sharma TEDxBMU 2026 Certificate-pages-35.pdf" },
  { serialNo: 36, name: "Manan Goyal",            email: "manan.goyal.25cse@bmu.edu.in",            designation: "Social Media and Marketing",       certificateFile: "Manan Goyal TEDxBMU 2026 Certificate-pages-36.pdf" },
  { serialNo: 37, name: "Harshita Tewani",        email: "harshita.tewani.24cse@bmu.edu.in",        designation: "Social Media and Marketing",       certificateFile: "Harshita Tewani TEDxBMU 2026 Certificate-pages-37.pdf" },
  { serialNo: 38, name: "Anirudh Siva T",         email: "anirudhsiva.t.25cse@bmu.edu.in",          designation: "Social Media and Marketing",       certificateFile: "Anirudh Siva T TEDxBMU 2026 Certificate-pages-38.pdf" },
  { serialNo: 39, name: "Harsha",                 email: "mutyamharsha.anvitha.24cse@bmu.edu.in",   designation: "Social Media and Marketing",       certificateFile: "Harsha  TEDxBMU 2026 Certificate-pages-39.pdf" },
  { serialNo: 40, name: "Ridhi Banger",           email: "ridhi.banger.25cse@bmu.edu.in",           designation: "Social Media and Marketing",       certificateFile: "Ridhi Banger  TEDxBMU 2026 Certificate-pages-40.pdf" },
  { serialNo: 41, name: "Purvi Aneja",            email: "purvi.aneja.24cse@bmu.edu.in",            designation: "Social Media and Marketing",       certificateFile: "Purvi Aneja TEDxBMU 2026 Certificate-pages-41.pdf" },
  { serialNo: 42, name: "Ishank Chauhan",         email: "ishank.chauhan.25cse@bmu.edu.in",         designation: "Sponsorship Team",                certificateFile: "Ishank Chauhan TEDxBMU 2026 Certificate-pages-42.pdf" },
  { serialNo: 43, name: "Sadhwi",                 email: "sadhwi.25bmi@bmu.edu.in",                 designation: "Sponsorship Team",                certificateFile: "Sadhwi TEDxBMU 2026 Certificate-pages-43.pdf" },
  { serialNo: 44, name: "Narpender singh",        email: "narpender.singh.25ece@bmu.edu.in",        designation: "Video Production Team",            certificateFile: "Narpender singh  TEDxBMU 2026 Certificate-pages-44.pdf" },
  { serialNo: 45, name: "Farhan Akhtar",          email: "farhan.akhter.24cse@bmu.edu.in",          designation: "Video Production Team",            certificateFile: "Farhan Akhtar  TEDxBMU 2026 Certificate-pages-45.pdf" },
  { serialNo: 46, name: "Krishna Shah",           email: "krishna.shah.25cse@bmu.edu.in",           designation: "Video Production Team",            certificateFile: "Krishna Shah TEDxBMU 2026 Certificate-pages-46.pdf" },
  { serialNo: 47, name: "Vivek Singh",            email: "vivek.singh.24cse@bmu.edu.in",            designation: "Video Production Team",            certificateFile: "Vivek Singh  TEDxBMU 2026 Certificate-pages-47.pdf" },
  { serialNo: 48, name: "Mehul Vig",              email: "mehul.vig.24cse@bmu.edu.in",              designation: "Website Team",                    certificateFile: "Mehul Vig TEDxBMU 2026 Certificate-pages-48.pdf" },
  { serialNo: 49, name: "Tejaswi Khandelwal",     email: "tejaswi.khandelwal.24cse@bmu.edu.in",     designation: "Website Team",                    certificateFile: "Tejaswi Khandelwal TEDxBMU 2026 Certificate-pages-49.pdf" },
  { serialNo: 50, name: "Aman Rastogi",           email: "aman.rastogi.25cse@bmu.edu.in",           designation: "Website Team",                    certificateFile: "Aman Rastogi TEDxBMU 2026 Certificate-pages-50.pdf" },
  { serialNo: 51, name: "Tarushi Garg",           email: "tarushi.garg.23bbl@bmu.edu.in",           designation: "Sierra President",                certificateFile: "Tarushi Garg TEDxBMU 2026 Certificate-pages-51.pdf" },
  { serialNo: 52, name: "Maulik Gupta",           email: "maulik.gupta.24cse@bmu.edu.in",           designation: "Sierra Vice-President",           certificateFile: "Maulik Gupta TEDxBMU 2026 Certificate-pages-52.pdf" },
];

const normalizeEmail = (email) => (email || "").trim().toLowerCase();

const normalizeName = (name) =>
  (name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

/**
 * Find a certificate recipient by email (primary) or name (fallback).
 * Email match is always attempted first across all recipients.
 * Name match is used as fallback across all recipients.
 */
const findCertificateRecipient = ({ email, name }) => {
  const cleanEmail = normalizeEmail(email);
  const cleanName = normalizeName(name);

  // 1. Match by email (case-insensitive) across all recipients
  if (cleanEmail) {
    const byEmail = certificateRecipients.find(
      (r) => r.email && normalizeEmail(r.email) === cleanEmail
    );
    if (byEmail) return { ...byEmail, matchType: "email" };
  }

  // 2. Fallback: match by name (case-insensitive, whitespace-normalised)
  if (cleanName) {
    const byName = certificateRecipients.find(
      (r) => normalizeName(r.name) === cleanName
    );
    if (byName) return { ...byName, matchType: "name" };
  }

  return null;
};

module.exports = {
  certificateRecipients,
  findCertificateRecipient,
  normalizeEmail,
  normalizeName,
};
