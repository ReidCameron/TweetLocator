var nodemailer = require('nodemailer');
const SMTPConnection = require('nodemailer/lib/smtp-connection');

module.exports = sendEmail = emailObj => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL_SENDER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: process.env.GOOGLE_ACCES_TOKEN
            // pass: process.env.GOOGLE_PASS
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_SENDER,
        to: process.env.EMAIL_RECEIVER,
        subject: emailObj['subject'],
        text: "This email was sent from: " 
            + emailObj['email'] + "\n\n"
            + emailObj['message']
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
