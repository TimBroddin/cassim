const { text } = require("figlet");
const chalk = require("chalk");
const fs = require("fs").promises;
const path = require("path");
const replaceAll = require("string.prototype.replaceall");
const { promisify } = require("util");
const tempy = require("tempy");
const cp = require("child_process");

const figlet = promisify(text);
const exec = promisify(cp.exec);

replaceAll.shim();

const printBanner = async () => {
  const banner = await figlet("Cassim", { horizontalLayout: "full" });
  console.log(chalk.green(banner));
};

const printUsage = () => {
  console.log("cassim add PORT");
  console.log(
    "\tAdds a vhost to your Nginx configuration, proxying PORT.yourdomain.com to the chosen port."
  );
  console.log(
    "\tFor example: cassim add 3000\n",
    "\tCreates a vhost for domain 3000.yourdomain.com to any process listening on port 3000"
  );
  console.log("\n");
  console.log("cassim setup");
  console.log(
    "\tRuns the setup again, allowing you to choose the base domain and configure the location of your nginx configuration files.",
    "\n"
  );
};

const makeTemplate = async (port, config) => {
  const templatePath = await fs.realpath(__dirname + "/../template/nginx.conf");
  const template = await fs.readFile(templatePath, "utf-8");

  const contents = template
    .replaceAll("${server_name}", `${port}.${config.base_domain}`)
    .replaceAll("${port}", port);

  // save to to temporary file
  const filename = tempy.file({ extension: "conf" });
  await fs.writeFile(filename, contents);

  const availablePath = path.join(
    await fs.realpath(config.nginx_configs),
    "sites-available",
    `cassim_${port}.conf`
  );

  const enabledPath = path.join(
    await fs.realpath(config.nginx_configs),
    "sites-enabled",
    `cassim_${port}.conf`
  );

  console.log(
    "Cassim may need to ask your password to be able to copy the configuration file."
  );

  // copy file
  await exec(`sudo cp ${filename} ${availablePath}`);
  // link file
  await exec(`sudo ln -s ${availablePath} ${enabledPath}`);
};

const reloadNginx = async () => {
  await exec(`sudo systemctl reload nginx`);
};

const enableSsl = async (port, config) => {
  await exec(
    `sudo certbot run --nginx -n -d ${port}.${config.base_domain} --redirect`
  );
};

const removeTemplate = async (port, config) => {
  const enabledPath = path.join(
    await fs.realpath(config.nginx_configs),
    "sites-enabled",
    `cassim_${port}.conf`
  );
  await exec(`sudo rm ${enabledPath}`);
}

module.exports = {
  printBanner,
  printUsage,
  makeTemplate,
  removeTemplate,
  reloadNginx,
  enableSsl,
};
