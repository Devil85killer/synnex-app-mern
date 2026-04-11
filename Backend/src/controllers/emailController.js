const nodemailer = require("nodemailer");

const sendMailController = async (req, res) => {
  try {
    const { to, subject, message, from } = req.body;

    // 🔥 SECURITY CHECK: Kya Render ko passwords mil rahe hain?
    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
        console.log("🚨 ALARM: Render Environment variables missing!");
        return res.status(500).json({ 
            status: "error", 
            message: "SMTP Credentials missing in backend.",
            errorDetails: "BREVO_SMTP_USER is undefined" 
        });
    }

    // 1. Postman Setup
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 2525, // 🔥 FIX: Yahan maine 587 ko 2525 kar diya hai timeout se bachne ke liye!
      secure: false, 
      auth: {
        user: process.env.BREVO_SMTP_USER, 
        pass: process.env.BREVO_SMTP_PASS, 
      },
    });

    // 2. Email Format
    const mailOptions = {
      from: `"Synnex Portal" <${process.env.BREVO_SMTP_USER}>`, 
      replyTo: from, 
      to: to,
      subject: subject,
      text: message,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333;">New Message from Synnex Alumni Connect</h2>
          <p><strong>From:</strong> ${from}</p>
          <hr/>
          <p style="font-size: 16px; color: #555;">${message}</p>
          <br/>
          <p style="font-size: 12px; color: #999;">Please reply directly to this email to contact the sender.</p>
        </div>
      `,
    };

    // 3. Email bhej do
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully! Message ID: ", info.messageId);

    res.status(200).json({ status: "success", message: "Email sent successfully!" });
  } catch (error) {
    console.error("🔥 Error sending email:", error);
    // 🔥 NAYA: Ab error ka asli reason frontend network tab mein dikhega!
    res.status(500).json({ 
        status: "error", 
        message: "Failed to send email.", 
        errorDetails: error.message // Ye line humein sachai batayegi
    });
  }
};

module.exports = { sendMailController };