import nodemailer from "nodemailer";

const sendMail = async (options) =>{

const password = process.env.SMTP_PASSWORD;


    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "noreply@newrole.in",
          pass: password,
        },
      });

const mailOptions = {
  from: '"Newrole" <noreply@newrole.in>',
  to: options.to,
  subject: options.subject,
  html: `
    <div style="font-family: Arial, sans-serif; color: #111; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="https://storage.googleapis.com/newroleinbucket/desk-logo.jpg" alt="Newrole.in" width="150" />
      </div>

      <div style="max-width: 600px; margin: 0 auto;">
        <h2 style="color: #222;">${options.subject}</h2>

        <p style="font-size: 16px; line-height: 1.6;">
          ${options.text}
        </p>

        <p style="font-size: 14px; color: #333; background: #f1f1f1; padding: 12px 15px; border-left: 4px solid #1A73E8; margin: 24px 0;">
          Note: This verification message was sent to your work email only for confirmation purposes.
          We do <strong>not</strong> and will <strong>never</strong> send job-related or marketing emails to your workmail again.
          All future communication will be sent only to your registered personal email ${options.userEmail} on Newrole.in.
        </p>

        <p style="font-size: 14px; color: #555;">
          If you didn't request this, please ignore this message or contact support.
        </p>

        <div style="margin-top: 40px; background: #FFFFFF; padding: 15px; text-align: center; font-size: 13px; color: #777;">
          © ${new Date().getFullYear()} Newrole.in. All rights reserved.
          <br/>
          <img src="https://storage.googleapis.com/newroleinbucket/desk-logo.jpg" alt="Newrole.in" width="40" style="margin-top: 10px;" />
        </div>
      </div>
    </div>
  `
};


    await transporter.sendMail(mailOptions);

}

export default sendMail;



