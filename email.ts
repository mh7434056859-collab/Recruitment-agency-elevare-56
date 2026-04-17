import { Router } from "express";
import nodemailer from "nodemailer";
import multer from "multer";
import { z } from "zod/v4";

const router = Router();

const RECIPIENT = "elevaretalentagency@gmail.com";
const GMAIL_USER = process.env.GMAIL_USER || RECIPIENT;
const GMAIL_PASS = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s+/g, "");

function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  });
}

const hireSchema = z.object({
  name: z.string().min(1),
  company: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  roleType: z.string().optional(),
  seniority: z.string().optional(),
  timeframe: z.string().optional(),
  message: z.string().optional(),
});

const candidateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  nationality: z.string().optional(),
  currentRole: z.string().optional(),
  experience: z.string().optional(),
  certifications: z.string().optional(),
  vesselType: z.string().optional(),
  preferredRegion: z.string().optional(),
  availability: z.string().optional(),
  message: z.string().optional(),
});

router.post("/email/hire", async (req, res) => {
  const parsed = hireSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Name, company and email are required." });
    return;
  }

  const { name, company, email, phone, country, roleType, seniority, timeframe, message } = parsed.data;

  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Elevare Talent Website" <${GMAIL_USER}>`,
      to: RECIPIENT,
      replyTo: email,
      subject: `Hiring Enquiry — ${company} — ${roleType || "Maritime Role"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0a1628;padding:24px;border-radius:8px 8px 0 0">
            <h2 style="color:#d4af37;margin:0;font-size:22px">New Hiring Enquiry</h2>
            <p style="color:#9ca3af;margin:4px 0 0;font-size:13px">Received via Elevare Talent website</p>
          </div>
          <div style="background:#f8f6f0;padding:24px;border-radius:0 0 8px 8px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628;width:160px">Name:</td><td style="padding:8px 0;color:#374151">${name}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Company:</td><td style="padding:8px 0;color:#374151">${company}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Email:</td><td style="padding:8px 0;color:#374151"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Phone:</td><td style="padding:8px 0;color:#374151">${phone || "—"}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Country:</td><td style="padding:8px 0;color:#374151">${country || "—"}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Role Type:</td><td style="padding:8px 0;color:#374151">${roleType || "—"}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Seniority:</td><td style="padding:8px 0;color:#374151">${seniority || "—"}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Timeframe:</td><td style="padding:8px 0;color:#374151">${timeframe || "—"}</td></tr>
            </table>
            ${message ? `<div style="margin-top:16px;padding:16px;background:white;border-radius:6px;border-left:4px solid #d4af37"><strong style="color:#0a1628">Additional Details:</strong><p style="color:#374151;margin:8px 0 0">${String(message).replace(/\n/g, "<br>")}</p></div>` : ""}
          </div>
        </div>`,
    });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Hire email error");
    res.status(500).json({ success: false, error: "Failed to send email. Please try WhatsApp or email us directly." });
  }
});

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post("/email/candidate", upload.single("resume"), async (req, res) => {
  const body = req.is("multipart/form-data") ? req.body : req.body;
  const parsed = candidateSchema.safeParse(body);
  if (!parsed.success) {
    res.status(400).json({ success: false, error: "Name, email and phone are required." });
    return;
  }

  const { name, email, phone, nationality, currentRole, experience, certifications, vesselType, preferredRegion, availability, message } = parsed.data;
  const resumeFile = req.file;

  try {
    const transporter = createTransporter();
    const attachments = resumeFile
      ? [{ filename: resumeFile.originalname, content: resumeFile.buffer, contentType: resumeFile.mimetype }]
      : [];

    await transporter.sendMail({
      from: `"Elevare Talent Website" <${GMAIL_USER}>`,
      to: RECIPIENT,
      replyTo: email,
      subject: `Candidate Registration — ${name} — ${currentRole || "Maritime Professional"}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:#0a1628;padding:24px;border-radius:8px 8px 0 0">
            <h2 style="color:#d4af37;margin:0;font-size:22px">New Candidate Registration</h2>
            <p style="color:#9ca3af;margin:4px 0 0;font-size:13px">Received via Elevare Talent website</p>
          </div>
          <div style="background:#f8f6f0;padding:24px;border-radius:0 0 8px 8px">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628;width:180px">Full Name:</td><td style="padding:8px 0;color:#374151">${name}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Nationality:</td><td style="padding:8px 0;color:#374151">${nationality || "—"}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Email:</td><td style="padding:8px 0;color:#374151"><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Phone / WhatsApp:</td><td style="padding:8px 0;color:#374151">${phone}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Current Role:</td><td style="padding:8px 0;color:#374151">${currentRole || "—"}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Experience:</td><td style="padding:8px 0;color:#374151">${experience || "—"}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Certifications:</td><td style="padding:8px 0;color:#374151">${certifications || "—"}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Vessel Type:</td><td style="padding:8px 0;color:#374151">${vesselType || "—"}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Preferred Region:</td><td style="padding:8px 0;color:#374151">${preferredRegion || "—"}</td></tr>
              <tr><td style="padding:8px 0;font-weight:bold;color:#0a1628">Availability:</td><td style="padding:8px 0;color:#374151">${availability || "—"}</td></tr>
            </table>
            ${message ? `<div style="margin-top:16px;padding:16px;background:white;border-radius:6px;border-left:4px solid #d4af37"><strong style="color:#0a1628">Additional Information:</strong><p style="color:#374151;margin:8px 0 0">${String(message).replace(/\n/g, "<br>")}</p></div>` : ""}
            ${resumeFile ? `<div style="margin-top:12px;padding:12px;background:white;border-radius:6px;border-left:4px solid #1e40af"><p style="color:#1e40af;margin:0;font-size:13px">📎 Resume attached: ${resumeFile.originalname}</p></div>` : ""}
          </div>
        </div>`,
      attachments,
    });
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Candidate email error");
    res.status(500).json({ success: false, error: "Failed to send. Please email us directly or try WhatsApp." });
  }
});

export default router;
