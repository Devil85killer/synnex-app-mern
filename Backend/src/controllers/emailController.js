const nodemailer = require("nodemailer");

const sendMailController = async (req, res) => {
  try {
    // Frontend se data nikal rahe hain
    const { to, subject, message, from } = req.body;

    // 1. Postman (Transporter) Setup with Brevo
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, 
      auth: {
        user: process.env.BREVO_SMTP_USER, 
        pass: process.env.BREVO_SMTP_PASS, 
      },
    });

    // 2. Email ka format tayyar karna
    const mailOptions = {
      // 🔥 DHYAN RAKHNA: 'from' mein WAHI email dalna jo Brevo mein Verified Sender hai!
      from: `"Synnex Portal" <${process.env.BREVO_SMTP_USER}>`, 
      replyTo: from, // Jiska account hai, reply usko jayega
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
    console.log("Email sent successfully! Message ID: ", info.messageId);

    res.status(200).json({ status: "success", message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ status: "error", message: "Failed to send email." });
  }
};

module.exports = { sendMailController };