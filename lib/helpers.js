const { text } = require("figlet");
const chalk = require("chalk");
const { promisify } = require("util");

const figlet = promisify(text);

const printBanner = async () => {
  const banner = await figlet("Kassim", { horizontalLayout: "full" });
  console.log(chalk.green(banner));
};

module.exports = { printBanner };
