const inquirer = require("inquirer");
const fs = require("fs");

module.exports = (config) => {
  const questions = [
    {
      name: "nginx_configs",
      type: "input",
      message: "Where are your nginx configuration files stored?",
      default: config.nginx_configs
        ? config.nginx_configs
        : "/etc/nginx/sites-enabled/",
      validate: function (value) {
        if (fs.existsSync(value)) {
          return true;
        } else {
          return "Please enter an existing path.";
        }
      },
    },
    {
      name: "base_domain",
      type: "input",
      message:
        "What domain is your base domain? Kassim wil maje subdomains based on this domain.",
      default: config.base_domain ? config.base_domain : "sandbox.example.com",
      validate: (value) => {
        var re = new RegExp(
          /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/
        );
        if (typeof value === "string" && value.match(re)) {
          return true;
        } else {
          return "Please enter a valid domain.";
        }
      },
    },
    {
      name: "enable_ssl",
      type: "confirm",
      message:
        "Do you want to enable SSL? certbot needs to be installed on your system.",
      default:
        typeof config.enable_ssl === "boolean" ? config.enable_ssl : true,
    },
  ];
  return inquirer.prompt(questions);
};
