import nodeMailer from 'nodemailer';
import * as Method from './method.lib';
// import inLineCss from 'nodemailer-juice';

const createEmailCode = () => {
    const min = Math.ceil(12340);
    const max = Math.floor(99999);
    return Math.floor(Math.random() * (max - min)) + min;
  };
  

export const sendSignUpLinkEmail = (email: string) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        port: 587,
        host: 'smtp.gmail.com',
        secure: false,
        requireTLS: true,
        auth: {
            user: 'gotjd2720@gmail.com',
            pass: 'gotjd@0419'
        },
    });

    // transporter.use('compile', inLineCss());

    const code = createEmailCode();

    const encodingCode = Method.encodingCode(code.toString());

    const mailOption = {
        from: 'gotjd2720@gmail.com',
        to: email,
        subject: 'Tech-Diary에 오신걸 환영합니다!',
        html: `
            <h1>Tech-Diary 가입 메일</h1>
            <a href="http://localhost:3000/signup?code=${encodingCode}">http://localhost:3000/sign-up?code=${encodingCode}</a>
        `,
    };

    transporter.sendMail(mailOption, (err, info) => {
        if (err) { console.log(err); throw new Error(err as any); } else {
            console.log('Message sent: ', info);
        }
    })
};
