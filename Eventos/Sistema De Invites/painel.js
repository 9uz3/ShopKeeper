const Discord = require("discord.js");
const { 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require("discord.js");
const fs = require('fs');
const path = require('path');
const { configuracao } = require('../../DataBaseJson');
const configPath = path.resolve(__dirname, '../../DataBaseJson/inviteTracker.json');

// Função para carregar os dados de convites
const loadInviteData = () => {
    try {
        const rawData = fs.readFileSync(configPath);
        return JSON.parse(rawData);
    } catch (error) {
        return { invites: {}, inviterPoints: {}, welcomeChannel: null };
    }
};

// Função para salvar os dados de convites
const saveInviteData = (data) => {
    try {
        fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Erro ao salvar dados de convites:', error);
    }
};

// Função para gerar o painel de convites
const generateInvitePanel = () => {
    const data = loadInviteData();
    const inviterPoints = data.inviterPoints || {}; // Garante que inviterPoints seja um objeto, mesmo que vazio

    const embed = new EmbedBuilder()
        .setTitle('Painel de Rastreamento de Convites')
        .setDescription('Aqui estão os detalhes dos convites:')
        .setColor(configuracao.get('Cores.Principal') || '0cd4cc');

    const actionRow2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('voltar00')
                .setLabel('Voltar')
                .setEmoji('1178068047202893869')
                .setStyle(ButtonStyle.Secondary)
        );

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('topInvites')
                .setLabel('Top Convidadores')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('userInvites')
                .setLabel('Ver Convites de um Usuário')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('configInvites')
                .setLabel('Configurações de Convites')
                .setStyle(ButtonStyle.Primary)
        );

    return { embed, row, actionRow2 };
};

module.exports = {
    name: 'interactionCreate',
    run: async (interaction, client) => {
        try {
            if (interaction.isButton()) {
                if (interaction.customId === 'invitetraker') {
                    const { embed, row, actionRow2 } = generateInvitePanel();
                    await interaction.update({ embeds: [embed], components: [row, actionRow2] });
                }

                if (interaction.customId === 'topInvites') {
                    const data = loadInviteData();
                    const inviterPoints = data.inviterPoints || {}; // Garantir que seja um objeto, mesmo que vazio

                    const embed = new EmbedBuilder()
                        .setTitle('Top Convidadores')
                        .setDescription('Aqui estão os usuários que mais convidaram:')
                        .addFields(
                            { name: 'Convidadores', value: Object.entries(inviterPoints).map(([id, points]) => `<@${id}>: ${points} convites`).join('\n') || 'Nenhum convidado registrado' }
                        )
                        .setColor(configuracao.get('Cores.Principal') || '0cd4cc');

                        const actionRow2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('voltar00')
                .setLabel('Voltar')
                .setEmoji('1178068047202893869')
                .setStyle(ButtonStyle.Secondary)
        );

                    await interaction.update({ embeds: [embed], components: [actionRow2] });
                }

                if (interaction.customId === 'userInvites') {
                    const embed = new EmbedBuilder()
                        .setTitle('Ver Convites de um Usuário')
                        .setDescription('Por favor, mencione o usuário para verificar os convites.')
                        .setColor(configuracao.get('Cores.Principal') || '0cd4cc');

                    await interaction.update({ embeds: [embed], components: [] });

                    // Aguardando a resposta do usuário
                    const filter = response => response.author.id === interaction.user.id;
                    const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

                    collector.on('collect', async response => {
                        const mentionedUser = response.mentions.users.first();
                        if (!mentionedUser) {
                            await interaction.followUp({ content: 'Nenhum usuário mencionado. Tente novamente.', flags: [Discord.MessageFlags.Ephemeral] });
                            return;
                        }

                        const data = loadInviteData();
                        const inviterPoints = data.inviterPoints || {}; // Garantir que seja um objeto, mesmo que vazio
                        const userPoints = inviterPoints[mentionedUser.id] || 0;

                        const resultEmbed = new EmbedBuilder()
                            .setTitle(`Convites de ${mentionedUser.tag}`)
                            .setDescription(`${mentionedUser} tem ${userPoints} convites.`)
                            .setColor(configuracao.get('Cores.Principal') || '0cd4cc');

                        await interaction.followUp({ embeds: [resultEmbed], flags: [Discord.MessageFlags.Ephemeral] });
                    });
                }

                if (interaction.customId === 'configInvites') {
                    const embed = new EmbedBuilder()
                        .setTitle('Configurações de Convites')
                        .setDescription('Aqui você pode configurar as opções de rastreamento de convites.')
                        .setColor(configuracao.get('Cores.Principal') || '0cd4cc');

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('setWelcomeChannel')
                                .setLabel('Definir Canal de Boas-Vindas')
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId('resetInvites')
                                .setLabel('Resetar Convites')
                                .setStyle(ButtonStyle.Danger)
                        );

                    await interaction.update({ embeds: [embed], components: [row] });
                }

                if (interaction.customId === 'setWelcomeChannel') {
                    const embed = new EmbedBuilder()
                        .setTitle('Definir Canal de Boas-Vindas')
                        .setDescription('Por favor, mencione o canal que você deseja definir como canal de boas-vindas.')
                        .setColor(configuracao.get('Cores.Principal') || '0cd4cc');

                    await interaction.update({ embeds: [embed], components: [] });

                    // Aguardando a resposta do usuário
                    const filter = response => response.author.id === interaction.user.id;
                    const collector = interaction.channel.createMessageCollector({ filter, time: 15000, max: 1 });

                    collector.on('collect', async response => {
                        const mentionedChannel = response.mentions.channels.first();
                        if (!mentionedChannel) {
                            await interaction.followUp({ content: 'Nenhum canal mencionado. Tente novamente.', flags: [Discord.MessageFlags.Ephemeral] });
                            return;
                        }

                        const data = loadInviteData();
                        data.welcomeChannel = mentionedChannel.id;
                        saveInviteData(data);

                        const resultEmbed = new EmbedBuilder()
                            .setTitle('Canal de Boas-Vindas Definido')
                            .setDescription(`O canal de boas-vindas foi definido para ${mentionedChannel}.`)
                            .setColor(configuracao.get('Cores.Principal') || '0cd4cc');

                        await interaction.followUp({ embeds: [resultEmbed], flags: [Discord.MessageFlags.Ephemeral] });
                    });
                }

                if (interaction.customId === 'resetInvites') {
                    const data = { invites: {}, inviterPoints: {}, welcomeChannel: null };
                    saveInviteData(data);

                    const embed = new EmbedBuilder()
                        .setTitle('Convites Resetados')
                        .setDescription('Todos os dados de convites foram resetados.')
                        .setColor('#FF0000');

                    await interaction.update({ embeds: [embed], components: [] });
                }
            }
        } catch (error) {
            console.error('Erro ao processar a interação:', error);
        }
    }
};


