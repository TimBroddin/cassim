#!/usr/bin/env node

const clear = require("clear");

const setup = require("./lib/setup");
const argv = require("minimist")(process.argv.slice(2));
const Configstore = require("configstore");
const packageJson = require("./package.json");
const CLI = require("clui");

const {
  printBanner,
  printUsage,
  makeTemplate,
  removeTemplate,
  reloadNginx,
  enableSsl,
} = require("./lib/helpers");
const config = new Configstore(packageJson.name);

const Spinner = CLI.Spinner;

const go = async () => {
  clear();

  await printBanner();
  if ((argv._ && argv._[0] === "setup") || !config.size) {
    console.log(
      "\n",
      "Welcome to Cassim. Cassim allows you to quickly setup Nginx vhosts, pointing to a certain port.",
      "\n"
    );
    const values = await setup(config.all);
    config.set(values);
    console.log("\n");
    console.log("Please re-rerun Cassim to start using it.", "\n");
    printUsage();
  } else if ((argv._ && argv._[0] === "add")) {
    const port = parseInt(argv._[1]);
    if (isNaN(port)) {
      console.log("Error: please provide a valid port number.", "\n");
      printUsage();
      process.exit();
    }
    const status = new Spinner("Creating template");
    status.start();
    await makeTemplate(port, config.all);
    status.message("Reloading nginx");
    await reloadNginx();

    if (config.all.enable_ssl) {
      status.message("Enabling SSL");
      await enableSsl(port, config.all);
      status.message("Reloading nginx");
      await reloadNginx();
      status.stop();

      console.log(
        `All done, you should now be able to surf to:  https://${port}.${config.all.base_domain}`
      );
    } else {
      status.stop();

      console.log(
        `All done, you should now be able to surf to:  http://${port}.${config.all.base_domain}`
      );
    }
  } else if((argv._ && argv._[0] === "remove")) {
    const port = parseInt(argv._[1]);
    if (isNaN(port)) {
      console.log("Error: please provide a valid port number.", "\n");
      printUsage();
      process.exit();
    }

    const status = new Spinner("Removing vhost");
    status.start();    
    await removeTemplate(port, config.all);
    status.message("Reloading nginx");
    await reloadNginx();
    status.stop();
    console.log(`All done!`);
  } else {
    await printUsage();
  }
};

go().then(() => {
  process.exit();
});
