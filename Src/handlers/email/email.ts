import nodemailer from "nodemailer";

export const sendMail = async ({
  clientAccount,
  clientEmail,
  clientSubject,
}) => {
  let transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "login",
      user: process.env.GOOGLE_MAIL_APP_EMAIL,
      pass: process.env.GOOGLE_MAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GOOGLE_MAIL_APP_EMAIL,
    to: clientAccount,
    subject: "Thank you for your message",
    html: "<h3><b>Great 🎉🎉</> </h3> <p>Thanks for you email, I will get in touch soon </p> <p><small>Regards, Ebenezer </small> </p>",
  };
  const mailOption2 = {
    from: process.env.GOOGLE_MAIL_APP_EMAIL,
    to: "universityofgraphics2022@gmail.com",
    subject: `${clientSubject} from : ${clientAccount}`,
    html: `<p>${clientEmail}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    await transporter.sendMail(mailOption2);
    return true;
  } catch (error) {
    console.error("error sending email ", error);
    return false;
  }
};
