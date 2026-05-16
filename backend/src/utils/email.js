import nodemailer from 'nodemailer';

// Configure Nodemailer to use Ethereal Email for testing
let transporter;

async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
      user: testAccount.user, 
      pass: testAccount.pass, 
    },
  });
}

createTestAccount();

export const sendEmail = async (options) => {
  if (!transporter) await createTestAccount();
  
  const mailOptions = {
    from: '"Taskr Admin" <admin@taskr.local>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("\n=================================");
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  console.log("=================================\n");
};
