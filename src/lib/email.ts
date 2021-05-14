import nodeMailer from 'nodemailer';
import * as Method from './method.lib';
import config from '../../config';

const { emailCodeKey, clientUrl, gmailPass } = config;

// import inLineCss from 'nodemailer-juice';
// const createEmailCode = () => {
//     const min = Math.ceil(12340);
//     const max = Math.floor(99999);
//     return Math.floor(Math.random() * (max - min)) + min;
//   };
  

export const sendSignUpLinkEmail = (email: string) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        port: 587,
        host: 'smtp.gmail.com',
        secure: false,
        requireTLS: true,
        auth: {
            user: 'gotjd2720@gmail.com',
            pass: `${gmailPass}`
        },
    });

    // transporter.use('compile', inLineCss());


    const encodingCode = Method.encodingCode(`${emailCodeKey.toString()}/${email}`);
    
    const mailOption = {
        from: 'gotjd2720@gmail.com',
        to: email,
        subject: 'Work-It에 오신걸 환영합니다!',
        html: `
            <h1>Work-It 가입 메일</h1>
            <a href="${clientUrl}/signup?code=${encodingCode}">${clientUrl}/sign-up?code=${encodingCode}</a>
        `,
    };

    transporter.sendMail(mailOption, (err, info) => {
        if (err) { console.log(err); throw new Error(err as any); } else {
            console.log('Message sent: ', info);
        }
    })
};

export const sendPublishPostInfoToFollowers = (email: string,slug: string, followingMemberId: string) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        port: 587,
        host: 'smtp.gmail.com',
        secure: false,
        requireTLS: true,
        auth: {
            user: 'gotjd2720@gmail.com',
            pass: `${gmailPass}`
        },
    });

    const url = `https://work-it.co.kr/${followingMemberId}${slug}`;
    
    const mailOption = {
        from: 'gotjd2720@gmail.com',
        to: email,
        subject: 'Wort-It ',
        html: `
            <h1>회원님이 팔로우 하신 ${followingMemberId}님이 새로운 게시글을 작성하셨습니다!</h1>
            <a href="${url}">지금 보러 가기</a>
        `,
    };

    transporter.sendMail(mailOption, (err, info) => {
        if (err) { console.log(err); throw new Error(err as any); } else {
            console.log('Message sent: ', info);
        }
    })
};
