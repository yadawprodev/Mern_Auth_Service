// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   host: 'smtp-relay.brevo.com',
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

// export default transporter;
const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',

      headers: {
        accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },

      body: JSON.stringify({
        sender: {
          email: process.env.SENDER_EMAIL,
          name: 'Yadaw App',
        },

        to: [
          {
            email: to,
          },
        ],

        subject,

        htmlContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export default sendEmail;
