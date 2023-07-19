import { json } from '@remix-run/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_TOKEN)

export async function sendEmail(
  subject: string,
  to: string,
  token: string) {
  
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [to],
      subject: subject,
      html: `<p> O seu código para autenticação é ${token} </p>`
    });
    return;
  } catch(e) {
    return json({
      errors: {
        sendMail: 'failure'
      },
      status: 500
    })
  }
  
}
