const { InteractionType, ComponentType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags, ButtonStyle, UserSelectMenuBuilder } = require('discord.js');
const permissionService = require('../services/permissions');
const securityService = require('../services/securityService');
const ticketService = require('../services/ticketService');
const { getGreeting } = require('../utils/helpers');
const { createErrorEmbed, createBaseEmbed } = require('../utils/embedBuilder');
const { COLORS } = require('../constants');

async function handleInteraction(interaction, client) {
    if (securityService.isBlocked(interaction.user.id)) {
        return interaction.reply({ content: '❌ | Você está bloqueado de usar o bot.', ephemeral: true });
    }

    if (interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand() || interaction.isUserContextMenuCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName);
        if (cmd) {
            const cooldown = securityService.checkCooldown(interaction.user.id, interaction.commandName);
            if (cooldown.onCooldown) {
                return interaction.reply({
                    content: `⏳ | Aguarde ${Math.ceil(cooldown.remaining / 1000)}s antes de usar este comando novamente.`,
                    ephemeral: true,
                });
            }
            try {
                await cmd.run(client, interaction);
            } catch (error) {
                console.error(`Erro no comando ${interaction.commandName}:`, error);
                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({ content: '❌ | Ocorreu um erro ao executar este comando.', ephemeral: true });
                }
            }
        }
        return;
    }

    if (interaction.isButton()) {
        await handleButtonInteraction(interaction, client);
        return;
    }

    if (interaction.isStringSelectMenu()) {
        await handleSelectMenuInteraction(interaction, client);
        return;
    }

    if (interaction.type === InteractionType.ModalSubmit) {
        await handleModalInteraction(interaction, client);
        return;
    }
}

async function handleButtonInteraction(interaction, client) {
    const customId = interaction.customId;

    if (customId.startsWith('ticket_')) {
        await handleTicketButtons(interaction);
        return;
    }

    if (customId === 'painelconfigvendas') {
        const { Gerenciar2 } = require('../../Functions/Painel');
        return Gerenciar2(interaction, client);
    }

    if (customId === 'painelconfigticket') {
        const { painelTicket } = require('../services/ticketConfig');
        return painelTicket(interaction);
    }

    if (customId === 'painelconfigbv') {
        const config = require('../../Eventos/Sistema De Configuracao/configAntiFake&BemVindos');
        return config.run(interaction, client);
    }

    if (customId === 'eaffaawwawa') {
        const config = require('../../Eventos/Sistema De Configuracao/configRoles&Channels');
        return config.run(interaction, client);
    }

    const buttonHandlers = {
        'painelconfigticket': () => require('../services/ticketConfig').painelTicket(interaction),
        'definiraparencia': () => require('../services/ticketConfig').definirAparencia(interaction),
        'definircategoriaticket': () => require('../services/ticketConfig').definirCategoria(interaction),
        'addfuncaoticket': () => require('../services/ticketConfig').adicionarFuncao(interaction),
        'remfuncaoticket': () => require('../services/ticketConfig').removerFuncao(interaction),
        'postarticket': () => require('../services/ticketConfig').postarTicket(interaction, client),
        'sincronizarticket': () => require('../services/ticketConfig').sincronizarTicket(interaction, client),
    };

    const handler = buttonHandlers[customId];
    if (handler) return handler();
}

async function handleSelectMenuInteraction(interaction, client) {
    if (interaction.customId.startsWith('configproduto_')) {
        const { GerenciarProduto } = require('../services/productService');
        return GerenciarProduto(interaction, 2, interaction.values[0]);
    }

    if (interaction.customId === 'ticket_actions') {
        const action = interaction.values[0];
        if (action === 'change_priority') {
            const { createPriorityMenu } = require('../services/ticketActions');
            return createPriorityMenu(interaction);
        }
        if (action === 'transfer') {
            const { createTransferMenu } = require('../services/ticketActions');
            return createTransferMenu(interaction);
        }
    }

    if (interaction.customId === 'ticket_admin_adduser_select') {
        const userId = interaction.values[0];
        return ticketService.addUserToTicket(interaction, userId);
    }

    if (interaction.customId === 'ticket_admin_removeuser_select') {
        const userId = interaction.values[0];
        return ticketService.removeUserFromTicket(interaction, userId);
    }
}

async function handleModalInteraction(interaction, client) {
    const modalHandlers = {
        'ConfigurarPagamentoManual2': () => {
            const config = require('../../Eventos/Sistema De Configuracao/configPagamentos');
            return config.run(interaction, client);
        },
        'sdaju112341111idsjjsdua': () => {
            const { GerenciarProduto } = require('../services/productService');
            return GerenciarProduto(interaction, 2, interaction.fields.getTextInputValue('tokenMP'));
        },
        'ticket_admin_rename_modal': () => {
            const newName = interaction.fields.getTextInputValue('new_name');
            return ticketService.renameTicket(interaction, newName);
        },
    };

    const handler = modalHandlers[interaction.customId];
    if (handler) return handler();
}

async function handleTicketButtons(interaction) {
    switch (interaction.customId) {
        case 'ticket_claim':
            return ticketService.claimTicket(interaction);
        case 'ticket_close':
            return ticketService.closeTicket(interaction.channel, interaction.user.id, 'Fechado pelo usuário');
        case 'ticket_delete':
            return interaction.channel.delete().catch(() => { });
        case 'ticket_admin_panel':
            return ticketService.showAdminPanel(interaction);
        case 'ticket_admin_rename':
            const renameModal = new ModalBuilder()
                .setCustomId('ticket_admin_rename_modal')
                .setTitle('Renomear Ticket')
                .addComponents(
                    new ActionRowBuilder().addComponents(
                        new TextInputBuilder()
                            .setCustomId('new_name')
                            .setLabel('Novo nome do ticket')
                            .setStyle(TextInputStyle.Short)
                            .setPlaceholder('Ex: suporte・joao・1234')
                            .setRequired(true)
                    )
                );
            return interaction.showModal(renameModal);
        case 'ticket_admin_lock':
            return ticketService.lockTicket(interaction);
        case 'ticket_admin_unlock':
            return ticketService.unlockTicket(interaction);
        case 'ticket_admin_adduser':
            const addUserSelect = new ActionRowBuilder().addComponents(
                new UserSelectMenuBuilder()
                    .setCustomId('ticket_admin_adduser_select')
                    .setPlaceholder('Selecione um usuário para adicionar')
            );
            return interaction.reply({ content: 'Selecione o usuário:', components: [addUserSelect], flags: [MessageFlags.Ephemeral] });
        case 'ticket_admin_removeuser':
            const removeUserSelect = new ActionRowBuilder().addComponents(
                new UserSelectMenuBuilder()
                    .setCustomId('ticket_admin_removeuser_select')
                    .setPlaceholder('Selecione um usuário para remover')
            );
            return interaction.reply({ content: 'Selecione o usuário:', components: [removeUserSelect], flags: [MessageFlags.Ephemeral] });
        case 'ticket_admin_delete':
            return ticketService.closeTicket(interaction.channel, interaction.user.id, 'Fechado pelo administrador');
        default:
            break;
    }
}

module.exports = { handleInteraction };
