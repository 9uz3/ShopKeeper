const fs = require('fs');
const path = require('path');
const { Events } = require('discord.js');

function loadCommands(client) {
    const SlashsArray = [];
    const commandsPath = path.join(__dirname, '..', '..', 'ComandosSlash');

    if (!fs.existsSync(commandsPath)) return;

    const folders = fs.readdirSync(commandsPath);
    for (const folder of folders) {
        const folderPath = path.join(commandsPath, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;

        const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
        for (const file of files) {
            const cmd = require(path.join(folderPath, file));
            if (!cmd?.name) continue;
            client.slashCommands.set(cmd.name, cmd);
            SlashsArray.push(cmd);
        }
    }

    client.once(Events.ClientReady, async () => {
        await client.application.commands.set(SlashsArray);
        console.log(`${SlashsArray.length} comandos slash registrados.`);
    });
}

module.exports = { loadCommands };
