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
    // 2️⃣ AUTO REPLY TO USER
await transporter.sendMail({
    from: `"Seyonix Groups" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Seyonix Groups",
    html: `
    <div style="font-family:Arial, sans-serif; background:#050B1A; padding:40px; color:#FAF9F6">
  
      <h1 style="color:#D4AF37; letter-spacing:2px;">
      SEYONIX GROUPS
      </h1>
  
      <p style="font-size:18px;">Hello ${name},</p>
  
      <p>
      Thank you for contacting <b>Seyonix Groups</b>.
      </p>
  
      <p>
      Your message has been successfully received by our team.
      We will review it and respond shortly.
      </p>
  
      <br/>
  
      <p style="color:#D4AF37">
      Engineering Legacy. Building Empires.
      </p>
  
      <hr style="border:1px solid rgba(212,175,55,0.3)"/>
  
      <p style="font-size:12px;color:#aaa">
      © Seyonix Groups — Pune, India
      </p>
  
    </div>
    `
  });
    return res.status(200).json({ success: true });

  } catch (error) {

    console.error(error);

    return res.status(500).json({ success: false });

  }
}