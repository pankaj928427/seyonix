import nodemailer from "nodemailer";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, company, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {

    // 1️⃣ EMAIL TO YOU (notification)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: subject || "New Seyonix Contact Message",
      text: `
Name: ${name}
Email: ${email}
Company: ${company}

Message:
${message}
`
    });

    // 2️⃣ AUTO REPLY TO USER
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Seyonix Groups",
      html: `
      <h2>Hello ${name},</h2>

      <p>Thank you for contacting <b>Seyonix Groups</b>.</p>

      <p>Your message has been successfully received.</p>

      <p>Our team will review it and respond shortly.</p>

      <br/>

      <p>— Seyonix Groups</p>
      <p><i>Engineering Legacy. Building Empires.</i></p>
      `
    });

    return res.status(200).json({ success: true });

  } catch (error) {

    console.error(error);

    return res.status(500).json({ success: false });

  }
}