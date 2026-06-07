const fs = require('fs')

function loadFromDir(client, dirPath, relativePath) {
    if (!fs.existsSync(dirPath)) return;
    
    fs.readdirSync(dirPath).forEach(local => {
        const localPath = `${dirPath}/${local}`;
        if (!fs.statSync(localPath).isDirectory()) return;
        
        const eventFiles = fs.readdirSync(localPath).filter(arquivo => arquivo.endsWith('.js'))
        for (const file of eventFiles) {
            const event = require(`${relativePath}/${local}/${file}`);

            if (event.once) {
                client.once(event.name, (...args) => event.run(...args, client));
            } else {
                client.on(event.name, (...args) => event.run(...args, client));
            }
        }
    })
}

module.exports = {

    run: (client) => {
        loadFromDir(client, './Eventos', '../Eventos');
        loadFromDir(client, './src/events', '../src/events');
    }
}