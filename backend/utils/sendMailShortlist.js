import nodemailer from "nodemailer";

const sendMailShortlist = async (options) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "noreply@newrole.in",
      pass: "wvhajyzzgqnzhlhj",
    },
  });

  const mailOptions = {
    from: 'noreply@newrole.in',
    to: options.to,
    subject: options.subject,
    html: `
      <div style="font-family: Arial, sans-serif; color: #111; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://storage.googleapis.com/newroleinbucket/desk-logo.jpg" alt="Newrole.in" width="150" />
        </div>

        <div style="max-width: 600px; margin: 0 auto;">
          <h3 style="color: #222;">Your profile has been shortlisted by an Employer.</h3>

          <p style="font-size: 16px; line-height: 1.6;">
           You will soon receive a call or an interview invitation from the employer via <strong>Newrole.in</strong> along with a message.
          </p>


          <div style="text-align: center; margin: 30px 0;">
            <a href="https://newrole.in/professional/invitations" target="_blank" 
              style="background-color: #1A73E8; color: white; padding: 12px 24px; text-decoration: none; 
                     border-radius: 6px; font-size: 16px; display: inline-block;">
              View Invitations
            </a>
          </div>

          <p style="font-size: 14px; color: #555;">
            If you weren't expecting this, feel free to ignore the email or contact us for support.
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
};

export default sendMailShortlist;
