const clear = require("clear");
const { printBanner } = require("./lib/helpers");
const setup = require("./lib/setup");
const argv = require("minimist")(process.argv.slice(2));
const Configstore = require("configstore");
const packageJson = require("./package.json");
const config = new Configstore(packageJson.name);

const go = async () => {
  clear();

  await printBanner();
  if (argv._ === "setup" || !config.size) {
    console.log(
      "\n",
      "Welcome to Kassim. Kassim allows you to quickly setup Nginx vhosts, pointing to a certain port.",
      "\n"
    );
    setup();
  }
};

go();
