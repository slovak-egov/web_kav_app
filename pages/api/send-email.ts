import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const {
        sender,
        type,
        name,
        surname,
        email,
        phoneNumber,
        organization,
        role,
        interestArea,
        request
      } = req.body;

      const transporterOptions: any = {
        host: process.env.MAIL_SMTP,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_SECURE === 'true',
        tls: {
          rejectUnauthorized: process.env.MAIL_TLS === 'true'
        },
        debug: process.env.MAIL_DEBUG === 'true'
      };

      if (process.env.MAIL_USER && process.env.MAIL_PWD) {
        transporterOptions.auth = {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PWD
        };
      }

      const transporter = nodemailer.createTransport(transporterOptions);

      const subject =
        type === '0'
          ? 'Žiadosť o prístup k dátam - KAV'
          : 'Žiadosť o prístup na interný portál - KAV';

      const text =
        type === '0'
          ? `
          Meno: ${name}
          Priezvisko: ${surname}
          E-mail: ${email}
          Telefónne číslo: ${phoneNumber}
          Organizácia: ${organization}
          Oblasť záujmu: ${interestArea}
          Popis požiadavky: ${request}
        `
          : `
          Meno: ${name}
          Priezvisko: ${surname}
          E-mail: ${email}
          Telefónne číslo: ${phoneNumber}
          Organizácia: ${organization}
          Rola: ${role}
          Oblasť záujmu: ${interestArea}
          Popis požiadavky: ${request}
        `;

      const mailOptions = {
        from: 'noreply-kav@slovenskoit.sk',
        to: sender,
        subject: subject,
        text: text
      };
      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
      console.error('Error sending email:', error);
      res
        .status(500)
        .json({ message: 'Email could not be sent.', error: (error as Error).message });
    }
  } else {
    res.status(405).end();
  }
};
