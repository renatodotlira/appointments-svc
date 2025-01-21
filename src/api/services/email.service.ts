import { Logger } from '../../config/logger.config';
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Crie um transportador de emails
let transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com', 
  port: 465,
  secure: true, 
  auth: {
      user: 'admin@inechat.com', 
      pass: 'Hoje@2025' 
  }
});

const loadTemplate = (templatePath, replacements) => {
  let template = fs.readFileSync(templatePath, 'utf8');
  for (const key in replacements) {
    template = template.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
  }
  return template;
};

transporter.verify((error, success) => {
  if (error) {
    console.error('Erro ao conectar:', error);
    console.log(error);
  } else {
    console.log('Pronto para enviar e-mails!');
  }
});

export class EmailService {
  constructor() {}

  private readonly logger = new Logger(EmailService.name);
  
  public sendEmail(email: string) {
    this.logger.verbose('start method sendEmail');

    const templatePath = path.join(__dirname, 'emailTemplate.html');
    const replacements = {
      link: 'http://localhost:4200/register/confirmEmail',
    };
    const emailContent = loadTemplate(templatePath, replacements);

    let mailOptions = {
      from: '"Nome" noreply@inechat.com',
      to: email,
      subject: 'Confirmação de email',
      text: 'Corpo do email em texto simples',
      html: emailContent
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Erro ao enviar e-mail:', error);
      } else {
        console.log('E-mail enviado com sucesso:', info.response);
      }
    });
    
    return null;


  }
}
