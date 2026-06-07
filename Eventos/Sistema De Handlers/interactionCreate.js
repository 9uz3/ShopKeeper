const { InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags, UserSelectMenuBuilder } = require('discord.js');
const permissionService = require('../../src/services/permissions');
const securityService = require('../../src/services/securityService');
const ticketService = require('../../src/services/ticketService');

module.exports = {
    name: 'interactionCreate',
    run: async (interaction, client) => {
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
            const customId = interaction.customId;

            if (customId.startsWith('ticket_')) {
                switch (customId) {
                    case 'ticket_claim':
                        return ticketService.claimTicket(interaction);
                    case 'ticket_close':
                        return ticketService.closeTicket(interaction.channel, interaction.user.id, 'Fechado pelo usuário');
                    case 'ticket_delete':
                        return interaction.channel.delete().catch(() => { });
                    case 'ticket_admin_panel':
                        return ticketService.showAdminPanel(interaction);
                    case 'ticket_admin_rename': {
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
                    }
                    case 'ticket_admin_lock':
                        return ticketService.lockTicket(interaction);
                    case 'ticket_admin_unlock':
                        return ticketService.unlockTicket(interaction);
                    case 'ticket_admin_adduser': {
                        const addUserSelect = new ActionRowBuilder().addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId('ticket_admin_adduser_select')
                                .setPlaceholder('Selecione um usuário para adicionar')
                        );
                        return interaction.reply({ content: 'Selecione o usuário:', components: [addUserSelect], flags: [MessageFlags.Ephemeral] });
                    }
                    case 'ticket_admin_removeuser': {
                        const removeUserSelect = new ActionRowBuilder().addComponents(
                            new UserSelectMenuBuilder()
                                .setCustomId('ticket_admin_removeuser_select')
                                .setPlaceholder('Selecione um usuário para remover')
                        );
                        return interaction.reply({ content: 'Selecione o usuário:', components: [removeUserSelect], flags: [MessageFlags.Ephemeral] });
                    }
                    case 'ticket_admin_delete':
                        return ticketService.closeTicket(interaction.channel, interaction.user.id, 'Fechado pelo administrador');
                    default:
                        break;
                }
                return;
            }

            if (customId === 'painelconfigvendas') {
                const { Gerenciar2 } = require('../../Functions/Painel');
                return Gerenciar2(interaction, client);
            }

            if (customId === 'painelconfigticket') {
                const { painelTicket } = require('../../src/services/ticketConfig');
                return painelTicket(interaction);
            }

            if (customId === 'painelconfigbv') {
                const config = require('../Sistema De Configuracao/configAntiFake&BemVindos');
                return config.run(interaction, client);
            }

            if (customId === 'painelpersonalizar') {
                const config = require('../Sistema De Configuracao/configRoles&Channels');
                return config.run(interaction, client);
            }

            if (customId === 'formasdepagamentos') {
                const { FormasDePagamentos } = require('../../Functions/FormasDePagamentosConfig');
                return FormasDePagamentos(interaction);
            }

            const ticketConfigHandlers = {
                'definiraparencia': () => require('../../src/services/ticketConfig').definirAparencia(interaction),
                'definircategoriaticket': () => require('../../src/services/ticketConfig').definirCategoria(interaction),
                'addfuncaoticket': () => require('../../src/services/ticketConfig').adicionarFuncao(interaction),
                'remfuncaoticket': () => require('../../src/services/ticketConfig').removerFuncao(interaction),
                'postarticket': () => require('../../src/services/ticketConfig').postarTicket(interaction, client),
                'sincronizarticket': () => require('../../src/services/ticketConfig').sincronizarTicket(interaction, client),
                'voltar1': () => {
                    const { Painel } = require('../../Functions/Painel');
                    return Painel(interaction, client);
                },
            };

            const handler = ticketConfigHandlers[customId];
            if (handler) return handler();

            if (customId === 'voltargerenciarproduto' || customId === 'colocarvenda' || customId === 'excluirproduto' || customId === 'syncproduto' || customId === 'voltar3') {
                const { Gerenciar2 } = require('../../Functions/Painel');
                return Gerenciar2(interaction, client);
            }

            if (customId === 'ConfigurarPagamentoManual') {
                const config = require('../Sistema De Configuracao/configPagamentos');
                const modal = config.createModal(interaction);
                return interaction.showModal(modal);
            }

            if (customId === 'criarrrr') {
                const { GerenciarProduto } = require('../../src/services/productService');
                return GerenciarProduto(interaction, 2, interaction.values?.[0]);
            }
        }

        if (interaction.isStringSelectMenu()) {
            if (interaction.customId === 'ticket_create') {
                return ticketService.createTicket(interaction, interaction.values[0]);
            }

            if (interaction.customId.startsWith('configproduto_')) {
                const { GerenciarProduto } = require('../../src/services/productService');
                return GerenciarProduto(interaction, 2, interaction.values[0]);
            }

            if (interaction.customId === 'remover_funcao_ticket_select') {
                const { tickets } = require('../../DataBaseJson');
                tickets.delete(`tickets.funcoes.${interaction.values[0]}`);
                const { painelTicket } = require('../../src/services/ticketConfig');
                await interaction.update({ content: '✅ Função removida!', components: [] });
                return painelTicket(interaction);
            }

            if (interaction.customId === 'comprarid') {
                const { CreateCarrinho } = require('../../Functions/CreateCarrinho');
                const [campo, produto] = interaction.values[0].split('_');
                return CreateCarrinho(interaction, { produto, campo });
            }

            if (interaction.customId === 'ticket_actions') {
                const { createPriorityMenu, createTransferMenu } = require('../../src/services/ticketActions');
                return interaction.values[0] === 'change_priority' ? createPriorityMenu(interaction) : createTransferMenu(interaction);
            }

            if (interaction.customId === 'ticket_admin_adduser_select') {
                return ticketService.addUserToTicket(interaction, interaction.values[0]);
            }

            if (interaction.customId === 'ticket_admin_removeuser_select') {
                return ticketService.removeUserFromTicket(interaction, interaction.values[0]);
            }
        }

        if (interaction.type === InteractionType.ModalSubmit) {
            if (interaction.customId === 'ticket_admin_rename_modal') {
                return ticketService.renameTicket(interaction, interaction.fields.getTextInputValue('new_name'));
            }

            if (interaction.customId === 'modal_aparencia_ticket') {
                const { tickets } = require('../../DataBaseJson');
                const title = interaction.fields.getTextInputValue('title');
                const description = interaction.fields.getTextInputValue('description');
                const color = interaction.fields.getTextInputValue('color');
                const banner = interaction.fields.getTextInputValue('banner');

                if (title) tickets.set('tickets.aparencia.title', title);
                if (description) tickets.set('tickets.aparencia.description', description);
                if (color) tickets.set('tickets.aparencia.color', color);
                if (banner) tickets.set('tickets.aparencia.banner', banner);

                const { painelTicket } = require('../../src/services/ticketConfig');
                await interaction.reply({ content: '✅ | Aparência atualizada!', ephemeral: true });
                return painelTicket(interaction);
            }

            if (interaction.customId === 'modal_categoria_ticket') {
                const { tickets } = require('../../DataBaseJson');
                const categoryId = interaction.fields.getTextInputValue('categoryId');
                tickets.set('tickets.categoria', categoryId);
                const { painelTicket } = require('../../src/services/ticketConfig');
                await interaction.reply({ content: '✅ | Categoria definida!', ephemeral: true });
                return painelTicket(interaction);
            }

            if (interaction.customId === 'modal_add_funcao_ticket') {
                const { tickets } = require('../../DataBaseJson');
                const nome = interaction.fields.getTextInputValue('nome');
                const predescricao = interaction.fields.getTextInputValue('predescricao');
                const descricao = interaction.fields.getTextInputValue('descricao');
                const emoji = interaction.fields.getTextInputValue('emoji');

                const key = nome.toLowerCase().replace(/\s+/g, '_');
                tickets.set(`tickets.funcoes.${key}`, { nome, predescricao, descricao, emoji });

                const { painelTicket } = require('../../src/services/ticketConfig');
                await interaction.reply({ content: '✅ | Função adicionada!', ephemeral: true });
                return painelTicket(interaction);
            }

            if (interaction.customId === 'sdaju112341111idsjjsdua') {
                const { GerenciarProduto } = require('../../src/services/productService');
                const nome = interaction.fields.getTextInputValue('tokenMP');
                return GerenciarProduto(interaction, 2, nome);
            }

            if (interaction.customId === 'ConfigurarPagamentoManual2') {
                const config = require('../Sistema De Configuracao/configPagamentos');
                return config.run(interaction, client);
            }
        }
    },
};
