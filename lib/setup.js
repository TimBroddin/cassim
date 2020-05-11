const inquirer = require("inquirer");
const fs = require("fs");

module.exports = () => {
  const questions = [
    {
      name: "nginx_configs",
      type: "input",
      message: "Where are your nginx configuration files stored?",
      default: "/etc/nginx/sites-enabled/",
      validate: function (value) {
        return fs.existsSync(value);
      },
    },
  ];
  return inquirer.prompt(questions);
};
