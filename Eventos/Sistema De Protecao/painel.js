const Discord = require("discord.js");
const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require("discord.js");
const fs = require('fs');
const path = require('path');
const { configuracao } = require('../../DataBaseJson'); // Certifique-se de que esse arquivo exista e esteja correto

// Caminho do arquivo de configuração
const configPath = path.resolve(__dirname, '../../DataBaseJson/protecaoconfig.json');

// Função para carregar a configuração
const loadConfig = () => {
    try {
        const rawConfig = fs.readFileSync(configPath);
        return JSON.parse(rawConfig);
    } catch (error) {
        return { proteção: { bloquearLinks: false, bloquearPalavras: false, backupServidor: false } }; // Retorne valores padrão
    }
};

// Função para salvar a configuração
const saveConfig = (config) => {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
    }
};

// Função para obter a configuração
const getConfig = () => {
    const config = loadConfig();
    return config.proteção || { bloquearLinks: false, bloquearPalavras: false, backupServidor: false }; // Retorne valores padrão
};

// Função para atualizar a configuração
const updateConfig = (newConfig) => {
    const config = loadConfig();
    config.proteção = { ...config.proteção, ...newConfig };
    saveConfig(config);
};

// Função para atualizar a mensagem do painel
const updatePanelMessage = async (interaction) => {
    const config = getConfig();

    const embed = new EmbedBuilder()
        .setTitle('Configurações de Proteção do Servidor')
        .addFields(
            { name: 'Bloquear Links', value: config.bloquearLinks ? 'Ativado' : 'Desativado', inline: true },
            { name: 'Bloquear Palavras', value: config.bloquearPalavras ? 'Ativado' : 'Desativado', inline: true },
            { name: 'Backup do Mensagens ', value: config.backupServidor ? 'Ativado' : 'Desativado', inline: true }
        )
        .setColor(configuracao.get('Cores.Principal') || '0cd4cc');

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('toggleLinks')
                .setLabel(config.bloquearLinks ? 'Desativar Bloqueio de Links' : 'Ativar Bloqueio de Links')
                .setStyle(config.bloquearLinks ? ButtonStyle.Danger : ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('togglePalavras')
                .setLabel(config.bloquearPalavras ? 'Desativar Bloqueio de Palavras' : 'Ativar Bloqueio de Palavras')
                .setStyle(config.bloquearPalavras ? ButtonStyle.Danger : ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('toggleBackup')
                .setLabel(config.backupServidor ? 'Desativar Backup do Mensagens' : 'Ativar Backup de Mensagens')
                .setStyle(config.backupServidor ? ButtonStyle.Danger : ButtonStyle.Success)
        );

    const actionRow2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('voltar00')
                .setLabel('Voltar')
                .setStyle(ButtonStyle.Secondary)
        );

    await interaction.update({ embeds: [embed], components: [row, actionRow2] });
};

module.exports = {
    name: 'interactionCreate',
    run: async (interaction, client) => {
        try {
            if (interaction.isButton()) {
                if (interaction.customId === 'protecaoserver') {
                    await updatePanelMessage(interaction);
                }

                if (interaction.customId === 'toggleLinks' || interaction.customId === 'togglePalavras' || interaction.customId === 'toggleBackup') {
                    const config = getConfig();
                    let updatedConfig = {};

                    if (interaction.customId === 'toggleLinks') {
                        updatedConfig.bloquearLinks = !config.bloquearLinks;
                    } else if (interaction.customId === 'togglePalavras') {
                        updatedConfig.bloquearPalavras = !config.bloquearPalavras;
                    } else if (interaction.customId === 'toggleBackup') {
                        updatedConfig.backupServidor = !config.backupServidor;
                    }

                    updateConfig(updatedConfig);
                    await updatePanelMessage(interaction);
                    await interaction.followUp({ content: 'Configuração atualizada!', flags: [Discord.MessageFlags.Ephemeral] });
                }

                if (interaction.customId === 'voltarautomaticos') {
                    await interaction.update({ content: 'Você voltou à configuração anterior.', components: [] });
                }
            }
        } catch (error) {
        }
    }
};


