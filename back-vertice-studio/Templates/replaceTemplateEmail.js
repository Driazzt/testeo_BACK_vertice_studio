const replaceTemplateEmail = (template, data) => {
    return template.replace(/{{(\w+)}}/g, (match, key) => data[key] || "");
  };
  
  module.exports = replaceTemplateEmail;