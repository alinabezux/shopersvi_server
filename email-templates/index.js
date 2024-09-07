const { WELCOME, FORGOT_PASSWORD } = require("./email-actions.enum");

module.exports = {
    [WELCOME]: {
        subject: 'Welcome on board',
        templateName: 'welcome'
    },
    [FORGOT_PASSWORD]: {
        subject: 'Новий пароль SHOPERS_VI',
        templateName: 'forgot-pass'
    }
}