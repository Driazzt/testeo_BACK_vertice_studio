const html = replaceTemplateEmail(emailResetPasswordTemplate, {
    name: userTemplate.name,
    reset_link: resetLink,
});