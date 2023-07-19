import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_SENDER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(subject: string, to: string, token: string) {
  try {
    const mailOptions = {
      from: process.env.SMTP_SENDER,
      to: to,
      subject: 'Seu código de verificação',
      text: 'Olá seja bem vindo(a) a plataforma!',
      html: `<p>Segue o seu código de verificação <b>${token}</b>!</p>`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('E-mail enviado: ', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar o e-mail:', error);
  }
}
