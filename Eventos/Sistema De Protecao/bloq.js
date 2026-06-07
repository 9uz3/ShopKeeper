const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const config = require('../../config.js');

// IDs permitidos
const allowedIDs = ['922921434894958603', config.dono];

// Caminho do arquivo de configuração
const configPath = path.resolve(__dirname, '../../DataBaseJson/protecaoconfig.json');

// Caminho do backup
const backupPath = path.resolve(__dirname, '../../DataBaseJson/backups');
if (!fs.existsSync(backupPath)) fs.mkdirSync(backupPath);

// Lista de domínios suspeitos
const suspiciousDomains = [
    'xvideos.com',
    'onlyfans.com',
    'discord.gg'
];

// Função para carregar a configuração
const loadConfig = () => {
    try {
        const rawConfig = fs.readFileSync(configPath);
        return JSON.parse(rawConfig);
    } catch (error) {
        return { proteção: { bloquearLinks: false, bloquearPalavras: false, backupServidor: false, palavrasBloqueadas: [] } };
    }
};

// Função para obter a configuração
const getConfig = () => loadConfig().proteção;

// Função para verificar se um link é suspeito
const isSuspiciousLink = (url) => {
    try {
        const parsedUrl = new URL(url);
        return suspiciousDomains.includes(parsedUrl.hostname);
    } catch (e) {
        return false;
    }
};

// Função para lidar com bloqueio de links
const handleLinkBlock = async (message) => {
    const config = getConfig();
    if (config.bloquearLinks) {
        const linkPattern = /https?:\/\/\S+/gi;
        const links = message.content.match(linkPattern);

        if (links) {
            for (const link of links) {
                if (isSuspiciousLink(link)) {
                    try {
                        // Tente excluir a mensagem original
                        await message.delete();

                        const embed = new EmbedBuilder()
                            .setColor('#FF0000')
                            .setTitle('Mensagem Removida')
                            .setDescription('Seu link foi removido por violar as regras do servidor. Por favor, não compartilhe links não permitidos.');

                        // Envie uma mensagem para o canal informando sobre a exclusão
                        const response = await message.channel.send({ content: `${message.author}`, embeds: [embed] });

                        // Excluir a mensagem do bot após 20 segundos
                        setTimeout(async () => {
                            try {
                                await response.delete();
                            } catch (error) {
                            }
                        }, 20000);
                    } catch (error) {
                    }
                }
            }
        }
    }
};


// Função para lidar com bloqueio de palavras
const handleWordBlock = async (message) => {
    const config = getConfig();
    if (config.bloquearPalavras) {
        const palavras = config.palavrasBloqueadas;
        const regex = new RegExp(`\\b(${palavras.join('|')})\\b`, 'i');
        if (regex.test(message.content)) {
            try {
                // Tente excluir a mensagem original
                await message.delete();

                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setTitle('Mensagem Removida')
                    .setDescription('Sua mensagem foi removida por conter palavras bloqueadas. Por favor, evite usar linguagem ofensiva.');

                // Envie uma mensagem para o canal informando sobre a exclusão
                const response = await message.channel.send({ content: `${message.author}`, embeds: [embed] });

                // Excluir a mensagem do bot após 20 segundos
                setTimeout(async () => {
                    try {
                        await response.delete();
                    } catch (error) {
                    }
                }, 20000);
            } catch (error) {
            }
        }
    }
};


// Função para fazer backup das mensagens
const handleBackup = async (message) => {
    const config = getConfig();
    if (config.backupServidor && message.content) {
        const backupFilePath = path.join(backupPath, `backup_${message.guild.id}.json`);
        let backups = [];
        if (fs.existsSync(backupFilePath)) {
            backups = JSON.parse(fs.readFileSync(backupFilePath));
        }
        backups.push({
            channel: message.channel.id,
            author: message.author.id,
            content: message.content,
            timestamp: message.createdTimestamp
        });
        fs.writeFileSync(backupFilePath, JSON.stringify(backups, null, 2));
    }
};

module.exports = {
    name: Events.MessageCreate,
    run: async (message, client) => {
        try {
            if (!message.guild) return;

            if (allowedIDs.includes(message.author.id)) return;

            const config = getConfig();

            if (config.bloquearLinks) await handleLinkBlock(message);

            if (config.bloquearPalavras) await handleWordBlock(message);

            if (config.backupServidor) await handleBackup(message);

        } catch (error) {
            console.error('Erro ao processar a mensagem:', error);
        }
    }
};

