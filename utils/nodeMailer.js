const nodemailer = require("nodemailer");

const sender = {
    user: "test@coded.in.rs",
    pass: "secretpassword",
    alias: "My awesome webshop"
}

const transporter = nodemailer.createTransport({
  host: "box.coded.in.rs",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: sender.user,
    pass: sender.pass,
  },
});

async function sendMail(recipient, link) {
  const info = await transporter.sendMail({
    from: `${sender.alias} <${sender.user}>`,
    to: recipient,
    subject: "Registration",
    text: `Hello, and welcome to my awesome webshop. Please click on this link to confirm registration: ${link}`, // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
}

sendMail('x@coded.in.rs', token = null).catch(console.error);
