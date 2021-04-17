import nodeMailer from 'nodemailer';
// import inLineCss from 'nodemailer-juice';

export const sendSignUpLinkEmail = (email: string) => {
    console.log(email);
    
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

    const mailOption = {
        from: 'gotjd2720@gmail.com',
        to: email,
        subject: 'Tech-Diary에 오신걸 환영합니다!',
        html: `
            <h1>Test Mail</h1>
        
        `,
    };

    transporter.sendMail(mailOption, (err, info) => {
        if (err) { console.log(err); throw new Error(err as any); } else {
            console.log('Message sent: ', info);
        }
    })
};
