const nodemailer = require('nodemailer');
const EmailTemplates = require('email-templates');
const path = require("path");

const emailTemplates = require('../email-templates')
const ApiError = require("../errors/ApiError");
const { NO_REPLY_EMAIL, NO_REPLY_EMAIL_PASSWORD, CLIENT_URL } = require('../configs/configs');

const sendEmail = async (receiverMail, emailAction, locals = {}) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: NO_REPLY_EMAIL,
            pass: NO_REPLY_EMAIL_PASSWORD
        }
    });

    const templateInfo = emailTemplates[emailAction]
    if (!templateInfo) {
        throw new ApiError(500, 'Wrong template')
    }

    const templateRenderer = new EmailTemplates({
        views: {
            root: path.join(process.cwd(), 'email-templates')
        }
    });


    Object.assign(locals || {}, { frontendURL: CLIENT_URL });

    const html = await templateRenderer.render(templateInfo.templateName, locals);

    return transporter.sendMail({
        from: 'SHOPERS_VI',
        to: receiverMail,
        subject: templateInfo.subject,
        html
    })

};

module.exports = {
    sendEmail
}