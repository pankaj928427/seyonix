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

  const mailOptions = {
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
  };

  try {

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true });

  } catch (error) {

    console.error(error);

    return res.status(500).json({ success: false });

  }

}