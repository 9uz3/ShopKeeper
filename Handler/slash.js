const fs = require("fs");
const path = require("path");
const { Events } = require("discord.js");

module.exports = {
  run: (client) => {
    const SlashsArray = [];
    const slashPath = path.join(__dirname, "../ComandosSlash");

    for (const subpasta of fs.readdirSync(slashPath)) {
      const subPath = path.join(slashPath, subpasta);
      if (!fs.statSync(subPath).isDirectory()) continue;

      for (const arquivo of fs.readdirSync(subPath)) {
        if (!arquivo.endsWith(".js")) continue;

        const cmd = require(path.join(subPath, arquivo));
        if (!cmd?.name) continue;

        client.slashCommands.set(cmd.name, cmd);
        SlashsArray.push(cmd);
      }
    }

    client.once(Events.ClientReady, async () => {
      await client.application.commands.set(SlashsArray);
      console.log(`${SlashsArray.length} slash commands registrados.`);
    });
  },
};
