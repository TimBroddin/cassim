#!/usr/bin/env node

const clear = require("clear");

const setup = require("./lib/setup");
const argv = require("minimist")(process.argv.slice(2));
const Configstore = require("configstore");
const packageJson = require("./package.json");
const {
  printBanner,
  printUsage,
  makeTemplate,
  restartNginx,
  enableSsl,
} = require("./lib/helpers");
const config = new Configstore(packageJson.name);

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
  } else {
    const port = parseInt(argv._[0]);
    if (isNaN(port)) {
      console.log("Error: please provide a valid port number.", "\n");
      printUsage();
      process.exit();
    }
    await makeTemplate(port, config.all);
    await restartNginx();

    if (config.all.enable_ssl) {
      await enableSsl(port, config.all);
      await restartNginx();

      console.log(
        `All done, you should now be able to surf to:  https://${port}.${config.all.base_domain}`
      );
    } else {
      console.log(
        `All done, you should now be able to surf to:  http://${port}.${config.all.base_domain}`
      );
    }
  }
};

go().then(() => {
  process.exit();
});
