const fs = require('fs');
const path = require('path');

function loadEvents(client) {
    const eventsPath = path.join(__dirname, '..', '..', 'Eventos');
    if (!fs.existsSync(eventsPath)) return;

    const folders = fs.readdirSync(eventsPath);
    for (const folder of folders) {
        const folderPath = path.join(eventsPath, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;

        const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));
        for (const file of files) {
            const event = require(path.join(folderPath, file));
            if (event.once) {
                client.once(event.name, (...args) => event.run(...args, client));
            } else {
                client.on(event.name, (...args) => event.run(...args, client));
            }
        }
    }
}

module.exports = { loadEvents };
