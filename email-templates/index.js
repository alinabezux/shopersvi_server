const { WELCOME, FORGOT_PASSWORD, ORDER_CONFIRMATION } = require("./email-actions.enum");

module.exports = {
    [WELCOME]: {
        subject: 'Welcome on board',
        templateName: 'welcome'
    },
    [FORGOT_PASSWORD]: {
        subject: 'Новий пароль SHOPERS_VI',
        templateName: 'forgot-pass'
    },
    [ORDER_CONFIRMATION]: {
        subject: 'Ваше замовлення прийнято! — SHOPERS_VI',
        templateName: 'order-confirmation'
    }
}