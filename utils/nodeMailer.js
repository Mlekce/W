const nodemailer = require("nodemailer");
require("dotenv").config();

const sender = {
    user: process.env.SENDER_USER,
    pass: process.env.SENDER_PASSWD,
    alias: "My awesome webshop"
}

const transporter = nodemailer.createTransport({
  host: process.env.SENDER_HOSTNAME,
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: sender.user,
    pass: sender.pass,
  },
  tls: {
    rejectUnauthorized: false
  }
});

async function sendMail(recipient, link) {
  const info = await transporter.sendMail({
    from: `${sender.alias} <${sender.user}>`,
    to: recipient,
    subject: "Registration",
    //text: `Welcome to My awesome Webshop! Please click on this link to activate your account: <a href=/confirmation/${link}>Click here to confirm!</a>`,
    html: `<b>Welcome to My awesome Webshop!</b><br><p>Please click on this link to activate your account: <a href="http://localhost/confirmation/${link}">Click here to confirm!</a></p>`, 
  });
  console.log("Message sent: %s", info.messageId);
}

module.exports = sendMail
