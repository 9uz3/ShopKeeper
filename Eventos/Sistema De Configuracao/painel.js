
const Discord = require("discord.js")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const { Painel, Gerenciar2 } = require("../../Functions/Painel");
const { Gerenciar } = require("../../Functions/Gerenciar");
const { infosauth } = require("../../Functions/infosauth");
const { configauth } = require("../../Functions/eCloudConfigs");
const { automatico } = require("../../Functions/automaticos");
const { infoauth } = require("../../Functions/infoauth");
const { ecloud } = require("../../Functions/eCloudConfig");
const { ConfigRoles } = require("../../Functions/ConfigRoles");
const { msgbemvindo } = require("../../Functions/MensagemBemVindo");
const { estatisticas } = require("../../DataBaseJson");
const { profileuser } = require("../../Functions/profile");
const { produtos, configuracao, tickets } = require("../../DataBaseJson");
const { Posicao1 } = require("../../Functions/PosicoesFunction.js");
const { painelTicket } = require("../../Functions/PainelTickets.js");
const { CreateMessageTicket, Checkarmensagensticket } = require("../../Functions/CreateMensagemTicket.js");
const { CreateTicket } = require("../../Functions/CreateTicket.js");
const { GerenciarCampos2 } = require("../../Functions/GerenciarCampos.js");
const { MessageStock } = require("../../Functions/ConfigEstoque.js");
const EventEmitter = require("events");
const configAuth = require("../../DataBaseJson/configauth.json");
const discordOauth = require("discord-oauth2");
const oauthVerify = new discordOauth();

function getVerifyUrl() {
    if (configAuth.url && configAuth.clientid && configAuth.secret) {
        return `${configAuth.url}/auth/login`;
    }
    return 'https://discord.com/oauth2/authorize?client_id=1241397849195810846&redirect_uri=https://restorecord.com/api/callback&response_type=code&scope=identify+guilds.join+email&state=1250189025189298226';
}

module.exports = {
    name: 'interactionCreate',

    run: async (interaction, client) => {

        if (interaction.type == Discord.InteractionType.ModalSubmit) {

            if (interaction.customId == 'sdaju11111231idsj1233js123dua123') {
                let NOME = interaction.fields.getTextInputValue('tokenMP');
                let PREDESC = interaction.fields.getTextInputValue('tokenMP2');
                let DESC = interaction.fields.getTextInputValue('tokenMP3');
                let BANNER = interaction.fields.getTextInputValue('tokenMP5');
                let EMOJI = interaction.fields.getTextInputValue('tokenMP6');

                NOME = NOME.replace('.', '');
                PREDESC = PREDESC.replace('.', '');

                if (tickets.get(`tickets.funcoes.${NOME}`) !== null) {
                    return interaction.reply({ content: `âŒ | Já existe uma função com esse nome!`, flags: [Discord.MessageFlags.Ephemeral] });
                }

                if (NOME.length > 32) {
                    return interaction.reply({ content: `âŒ | O nome não pode ter mais de 32 caracteres!`, flags: [Discord.MessageFlags.Ephemeral] });
                } else {
                    tickets.set(`tickets.funcoes.${NOME}.nome`, NOME)
                }

                if (PREDESC.length > 64) {
                    return interaction.reply({ content: `âŒ | A pré descrição não pode ter mais de 64 caracteres!`, flags: [Discord.MessageFlags.Ephemeral] });
                } else {
                    tickets.set(`tickets.funcoes.${NOME}.predescricao`, PREDESC)
                }

                if (DESC !== '') {
                    if (DESC.length > 1024) {
                        return interaction.reply({ content: `âŒ | A descrição não pode ter mais de 1024 caracteres!`, flags: [Discord.MessageFlags.Ephemeral] });
                    } else {
                        tickets.set(`tickets.funcoes.${NOME}.descricao`, DESC)
                    }
                }

                if (BANNER !== '') {
                    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                    if (!urlRegex.test(BANNER)) {
                        tickets.set(`tickets.funcoes.${NOME}.banner`, BANNER)
                        return interaction.reply({ message: dd, content: `âŒ | Você escolheu incorretamente a URL do banner!`, flags: [Discord.MessageFlags.Ephemeral] });
                    } else {
                        tickets.set(`tickets.funcoes.${NOME}.banner`, BANNER)
                    }
                }

                if (EMOJI !== '') {
                    const emojiRegex = /^<:.+:\d+>$|^<a:.+:\d+>$|^\p{Emoji}$/u;
                    if (!emojiRegex.test(EMOJI)) {
                        return interaction.reply({ content: `âŒ | Você escolheu incorretamente o emoji!`, flags: [Discord.MessageFlags.Ephemeral] });
                    } else {
                        tickets.set(`tickets.funcoes.${NOME}.emoji`, EMOJI)
                    }
                }

                await painelTicket(interaction)

                interaction.followUp({ content: `✅ | Função adicionada com sucesso!`, flags: [Discord.MessageFlags.Ephemeral] });




            }

            if (interaction.customId == '0-89du0awd8awdaw8daw') {

                let TITULO = interaction.fields.getTextInputValue('tokenMP');
                let DESC = interaction.fields.getTextInputValue('tokenMP2');
                let BANNER = interaction.fields.getTextInputValue('tokenMP3');
                let COREMBED = interaction.fields.getTextInputValue('tokenMP5');

                if (TITULO.length > 256) {
                    return interaction.reply({ content: `âŒ | O título não pode ter mais de 256 caracteres!`, flags: [Discord.MessageFlags.Ephemeral] });
                }
                if (DESC.length > 1024) {
                    return interaction.reply({ content: `âŒ | A descrição não pode ter mais de 1024 caracteres!`, flags: [Discord.MessageFlags.Ephemeral] });
                }

                if (COREMBED !== '') {
                    const hexColorRegex = /^#?([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
                    if (!hexColorRegex.test(COREMBED)) {
                        
                        return interaction.reply({ content: `âŒ Código Hex Color \`${COREMBED}\` inváldo, tente pegar [nesse site.](https://www.google.com/search?q=color+picker&oq=color+picker) `, flags: [Discord.MessageFlags.Ephemeral] });
                    }else{
                        tickets.set(`tickets.aparencia.color`, COREMBED)
                    }
                }



                if (BANNER !== '') {
                    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
                    if (!urlRegex.test(BANNER)) {
                     
                        return interaction.reply({ message: dd, content: `âŒ | Você escolheu incorretamente a URL do banner!`, flags: [Discord.MessageFlags.Ephemeral] });
                    }else{
                        tickets.set(`tickets.aparencia.banner`, BANNER)
                    }
                }

                if (TITULO !== '') {
                    tickets.set(`tickets.aparencia.title`, TITULO)
                } else {
                    tickets.delete(`tickets.aparencia.title`)
                }

                if (DESC !== '') {
                    tickets.set(`tickets.aparencia.description`, DESC)
                } else {
                    tickets.delete(`tickets.aparencia.description`)
                }

                await painelTicket(interaction)


            }

      


            if (interaction.customId === 'aslfdjauydvaw769dg7waajnwndjo') {

                let VALOR = interaction.fields.getTextInputValue('tokenMP');
                let CARGO = interaction.fields.getTextInputValue('tokenMP2');


                if (CARGO !== '' && VALOR !== '') {
                    const role = await interaction.guild.roles.fetch(CARGO);

                    if (role === null) {
                        return interaction.reply({ content: `âŒ | Você escolheu incorretamente o ID do cargo!`, flags: [Discord.MessageFlags.Ephemeral] });
                    }

                    if (isNaN(VALOR)) {
                        return interaction.reply({ content: `âŒ | Você escolheu incorretamente o valor!`, flags: [Discord.MessageFlags.Ephemeral] });
                    }

                    configuracao.set(`posicoes.pos1.role`, CARGO);
                    configuracao.set(`posicoes.pos1.valor`, VALOR);
                } else {
                    configuracao.delete(`posicoes.pos1`);
                }

                await Posicao1(interaction, client)
                //  interaction.followUp({ content: `✅ | Posição definida com sucesso!`, flags: [Discord.MessageFlags.Ephemeral] });

            }

            if (interaction.customId === "faq") {
                const messageContent = `<:flay_point:1264131946905337918> Sua verificação é essencial para reforçar a segurança do servidor e manter nossa comunidade protegida.\n<:flay_point:1264131946905337918> Além disso, em casos raros de queda do servidor, a verificação nos permite trazê-lo de volta rapidamente para que você não perca nenhum momento importante.\n<:flay_point:1264131946905337918> Isso também ajuda a evitar contas falsas.`;
          
                interaction.reply({
                  content: messageContent,
                  components: [
                    {
                      type: 1,
                      components: [
                        {
                          type: 2, 
                          style: 5,
                          label: "Verificar-se",
                          url: getVerifyUrl()
                        }
                      ]
                    }
                  ],
                  flags: [Discord.MessageFlags.Ephemeral]
                });
              }

            if (interaction.customId === 'awiohdbawudwdwhduawdnuaw') {

                let VALOR = interaction.fields.getTextInputValue('tokenMP');
                let CARGO = interaction.fields.getTextInputValue('tokenMP2');


                if (CARGO !== '' && VALOR !== '') {
                    const role = await interaction.guild.roles.fetch(CARGO);

                    if (role === null) {
                        return interaction.reply({ content: `âŒ | Você escolheu incorretamente o ID do cargo!`, flags: [Discord.MessageFlags.Ephemeral] });
                    }

                    if (isNaN(VALOR)) {
                        return interaction.reply({ content: `âŒ | Você escolheu incorretamente o valor!`, flags: [Discord.MessageFlags.Ephemeral] });
                    }

                    configuracao.set(`posicoes.pos2.role`, CARGO);
                    configuracao.set(`posicoes.pos2.valor`, VALOR);
                } else {
                    configuracao.delete(`posicoes.pos2`);
                }

                await Posicao1(interaction, client)
                // interaction.followUp({ content: `✅ | Posição definida com sucesso!`, flags: [Discord.MessageFlags.Ephemeral] });
            }

            if (interaction.customId === 'uy82819171h172') {

                let VALOR = interaction.fields.getTextInputValue('tokenMP');
                let CARGO = interaction.fields.getTextInputValue('tokenMP2');

                if (CARGO !== '' && VALOR !== '') {
                    const role = await interaction.guild.roles.fetch(CARGO);

                    if (role === null) {
                        return interaction.reply({ content: `âŒ | Você escolheu incorretamente o ID do cargo!`, flags: [Discord.MessageFlags.Ephemeral] });
                    }

                    if (isNaN(VALOR)) {
                        return interaction.reply({ content: `âŒ | Você escolheu incorretamente o valor!`, flags: [Discord.MessageFlags.Ephemeral] });
                    }

                    configuracao.set(`posicoes.pos3.role`, CARGO);
                    configuracao.set(`posicoes.pos3.valor`, VALOR);
                } else {
                    configuracao.delete(`posicoes.pos3`);
                }

                await Posicao1(interaction, client)
                // interaction.followUp({ content: `✅ | Posição definida com sucesso!`, flags: [Discord.MessageFlags.Ephemeral] });
            }

        }

        if (interaction.isAutocomplete()) {
            if (interaction.commandName === 'manage_item') {
                const nomeDigitado = interaction.options.getFocused().toLowerCase();
                const produtosFiltrados = produtos.filter(produto => produto.ID.toLowerCase().includes(nomeDigitado));
                const produtosSelecionados = produtosFiltrados.slice(0, 25);
        
                const config = produtosSelecionados.flatMap(produto => {
                    // Verificando se o objeto 'produto' tem a propriedade 'data'
                    if (produto.data && produto.data.Campos) {
                        const matchingFields = produto.data.Campos.filter(campo =>
                            campo.Nome.toLowerCase().includes(nomeDigitado)
                        );
        
                        return matchingFields.map(campo => ({
                            name: `ðŸ§µ ${campo.Nome}`,
                            value: `${produto.ID}_${campo.Nome}`,
                        }));
                    } else {
                        // Se 'data' ou 'Campos' não estiverem definidos, retorna um array vazio
                        return [];
                    }
                });
        
                // Limitando o número de opções para 25 ou menos
                const response = config.length > 25 ? config.slice(0, 25) : config;
        
                interaction.respond(response);
            }        

            if (interaction.commandName === 'manage_stock') {
                const nomeDigitado = interaction.options.getFocused().toLowerCase();
                const produtosFiltrados = produtos.filter(produto => produto.ID.toLowerCase().includes(nomeDigitado));
                const produtosSelecionados = produtosFiltrados.slice(0, 25);
            
                const response = produtosSelecionados.map(produto => {
                const name = produto.data.Config ? produto.data.Config.name : "Nome Não Disponível";
            
                    // Construir o objeto de opção
                    const option = {
                        name: `ðŸ§µ ${name}`,
                        value: produto.ID
                    };
            
                    // Verificar se o valor da opção excede o limite máximo de caracteres
                    if (JSON.stringify(option).length > 100) {
                        // Se exceder, truncar o valor da opção
                        option.name = option.name.substring(0, 90) + '...'; // Limitar a 90 caracteres e adicionar '...'
                        option.value = option.value.substring(0, 90) + '...'; // Limitar a 90 caracteres e adicionar '...'
                    }
            
                    return option;
                });
                
                // Responder com a lista de produtos e opções correspondentes
                interaction.respond(response.length > 0 ? response : [{ name: 'Nenhum produto registrado foi encontrado', value: 'nada' }]);
            }
            


            if (interaction.commandName == 'manage_product') {
                var nomeDigitado = interaction.options.getFocused().toLowerCase();
                var produtosFiltrados = produtos.filter(x => x.ID.toLowerCase().includes(nomeDigitado));
                var produtosSelecionados = produtosFiltrados.slice(0, 25);

                const config = produtosSelecionados.map(x => {
                    const name = x.data.Config ? x.data.Config.name : "Nome Não Disponível";
                    return {
                        name: `ðŸ§µ ${name}`,
                        value: `${x.ID}`
                    };
                });
                
                interaction.respond(!config.length ? [{ name: `Nenhum produto registrado foi encontrado`, value: `nada` }] : config);

            }
        }

        let valorticket
        if (interaction.isButton() && interaction.customId.startsWith('AbrirTicket_')) {
            valorticket = interaction.customId.replace('AbrirTicket_', '');
            CreateTicket(interaction, valorticket)
        } else if (interaction.isStringSelectMenu() && interaction.customId === 'abrirticket') {
            valorticket = interaction.values[0]
            CreateTicket(interaction, valorticket)
        }

        if (interaction.isStringSelectMenu()) {

            if(interaction.customId == 'asdihadbhawhdwhdaw'){


                const campo = interaction.values[0].split('_')[0]
                const produto = interaction.values[0].split('_')[1]


                GerenciarCampos2(interaction, campo, produto, true)

            }

            if(interaction.customId == 'stockhasdhvsudasd'){

                const campo = interaction.values[0].split('_')[0]
                const produto = interaction.values[0].split('_')[1]

                MessageStock(interaction, 1, produto, campo, true)


            }

            if (interaction.customId == 'deletarticketsfunction') {
                const valordelete = interaction.values
                for (const iterator of valordelete) {
                    tickets.delete(`tickets.funcoes.${iterator}`)
                }
                painelTicket(interaction)
            }



            // buton com customid AbrirTicket





        }


        if (interaction.isChannelSelectMenu()) {

            if (interaction.customId == 'canalpostarticket') {
                await interaction.reply({ content: `🔄 | Aguarde estamos criando sua mensagem!`, flags: [Discord.MessageFlags.Ephemeral] });
                await CreateMessageTicket(interaction, interaction.values[0], client)
                interaction.editReply({ content: `✅ | Mensagem criada com sucesso!`, flags: [Discord.MessageFlags.Ephemeral] });
            }

            if (interaction.customId == 'categoriaselectticket') {
                const categoryId = interaction.values[0];
                tickets.set('tickets.categoria', categoryId);
                interaction.reply({ content: `✅ | Categoria configurada com sucesso!`, flags: [Discord.MessageFlags.Ephemeral] });
            }

        }

        if (interaction.isButton()) {

            if (interaction.customId == 'definircategoriaticket') {
                const select = new Discord.ChannelSelectMenuBuilder()
                    .setCustomId('categoriaselectticket')
                    .setPlaceholder('Selecione a categoria para os tickets')
                    .setChannelTypes(Discord.ChannelType.GuildCategory);

                const row = new ActionRowBuilder().addComponents(select);
                interaction.reply({ components: [row], content: `Selecione a categoria onde os tickets serão criados.`, flags: [Discord.MessageFlags.Ephemeral] });
            }

            if (interaction.customId == 'sincronizarticket') {
                await interaction.reply({ content: `🔄 | Aguarde estamos atualizando suas mensagem!`, flags: [Discord.MessageFlags.Ephemeral] });
                await Checkarmensagensticket(client)
                interaction.editReply({ content: `✅ | Mensagens atualizada com sucesso!`, flags: [Discord.MessageFlags.Ephemeral] });
            }



            if (interaction.customId == 'arquivar') {

                if (!interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargoadm')) && !interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargosup'))) return interaction.reply({ content: `âŒ | Você não tem permissão para fazer isso!`, flags: [Discord.MessageFlags.Ephemeral] });

                try {
                    await interaction.channel.setArchived(true)
                } catch (error) { }
            }


            if (interaction.customId == 'assumir') {
                let ticketId = interaction.message.id;
                if (tickets[ticketId] && tickets[ticketId].hasStaffInteracted) {
                    return interaction.reply({ content: 'âŒ | Este ticket já foi atendido.', flags: [Discord.MessageFlags.Ephemeral] });
                }
            
                if (!interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargoadm')) && !interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargosup'))) {
                    return interaction.reply({ content: `âŒ | Você não tem permissão para assumir este ticket!`, flags: [Discord.MessageFlags.Ephemeral] });
                }
            
                try {
                    const staffMember = interaction.member;
                    const partes = interaction.channel.name.split('・');
                    const ownerId = partes[partes.length - 1];
            
                    const owner = await interaction.guild.members.fetch(ownerId);
            
                    const confirmationEmbed = new EmbedBuilder()
                        .setColor('#2b2d31')
                        .setDescription(`👋 | Olá <@!${ownerId}>, Seu Ticket foi Assumido Pelo Staff ${staffMember}.`);
            
                    const ticketChannel = interaction.guild.channels.cache.get(ticketId);
            
                    const buttonRow = new ActionRowBuilder() .addComponents(
                        new ButtonBuilder()
                                .setLabel('Ir para o Ticket')
                                .setStyle('5')
                                .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`)
                        );
            
                    await owner.send({ embeds: [confirmationEmbed], components: [buttonRow] });
            
                    const confirmationEmbed222 = new EmbedBuilder()
                    .setColor('#2b2d31')
                    .setDescription(`👋 | Olá <@!${ownerId}>, Seu Ticket foi Assumido Pelo Staff ${staffMember}.`);
            
                    tickets[ticketId] = { hasStaffInteracted: true, hasPokeStaffBeenClicked: false, staffMemberId: staffMember.id };
            
            
                    await interaction.reply({ embeds: [confirmationEmbed222] });
                } catch (error) {
                }
            }                                

              if (interaction.customId === 'deletar') {
                if (!interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargoadm')) &&
                    !interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargosup'))) {
                    return interaction.reply({ content: 'âŒ | Você não tem permissão para fazer isso!', flags: [Discord.MessageFlags.Ephemeral] });
                }
            
                try {
                    const deletedChannelName = interaction.channel?.name || 'Desconhecido';
            
                    // Obtenha as mensagens do canal antes de excluí-lo
                    const fetchedMessages = await interaction.channel.messages.fetch({ limit: 100 });
                    const messagesContent = fetchedMessages.map(msg => `${msg.author.tag}: ${msg.content}`).join('\n');
            
                    // Salve as mensagens em um arquivo de texto
                    const fs = require('fs');
                    fs.writeFileSync('mensagens_antigas.txt', messagesContent);
            
                    // Exclua o canal
                    await interaction.channel.delete();
            
                    // Construa a mensagem embutida
                    const embed = new EmbedBuilder()
                        .setColor('#ff0000')
                        .setTitle(`Canal Deletado: ${deletedChannelName}`)
                        .setDescription(`O canal foi deletado por ${interaction.user} \`(${interaction.user.id})\``)
            
                    // Enviar mensagem embutida para o canal de logs
                    const logsChannelId = configuracao.get(`ConfigChannels.logsticket`);
                    const logsChannel = interaction.guild.channels.cache.get(logsChannelId);
                    if (logsChannel) {
                        await logsChannel.send({ embeds: [embed], files: [{ attachment: 'mensagens_antigas.txt', name: 'mensagens_antigas.txt' }] });
                    } else {
                        console.error(`Canal de logs não encontrado com ID ${logsChannelId}`);
                    }
                } catch (error) {
                    console.error('Erro ao deletar o canal:', error);
                }
            }

            if (interaction.customId === 'lembrar123') {
                if (!interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargoadm')) && !interaction.member.roles.cache.has(configuracao.get('ConfigRoles.cargosup'))) {
                    return interaction.reply({ content: `âŒ | Você não tem permissão para fazer isso!`, flags: [Discord.MessageFlags.Ephemeral] });
                }
            
                try {
                    const threadNameParts = interaction.channel.name.split('・');
                    const threadOwnerId = threadNameParts[threadNameParts.length - 1];
                    const user = await interaction.client.users.fetch(threadOwnerId);
            
                    // Determinando a saudação com base no horário de São Paulo
                    const brazilTime = new Date().toLocaleString("en-US", {timeZone: "America/Sao_Paulo"});
                    const hour = new Date(brazilTime).getHours();
                    let saudacao;
            
                    if (hour >= 0 && hour < 12) {
                        saudacao = 'Bom dia';
                    } else if (hour >= 12 && hour < 18) {
                        saudacao = 'Boa tarde';
                    } else {
                        saudacao = 'Boa noite';
                    }
            
                    // Mensagem personalizada para o usuário com saudação dinâmica
                    const mensagem = `${saudacao} <@${threadOwnerId}>, você possui um ticket pendente de resposta; se não for respondido, poderá ser fechado.`;
            
                    const row = new ActionRowBuilder() .addComponents(
                        new ButtonBuilder()
                            .setURL(`https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`)
                            .setLabel('Ir para o Ticket')
                            .setStyle('5')
                    );
        
                    await user.send({
                        content: mensagem,
                        components: [row]
                    });
            
                    await interaction.reply({ content: `✅ | Mensagem enviada ao criador do ticket.`, flags: [Discord.MessageFlags.Ephemeral] });
            
                } catch (error) {
                    await interaction.reply({ content: `âŒ | Não foi possível enviar a mensagem, pois o usuário provavelmente bloqueou mensagens privadas.`, flags: [Discord.MessageFlags.Ephemeral] });
                }
            }            

            if (interaction.customId == `postarticket`) {
                const ggg = tickets.get(`tickets.funcoes`)
                const ggg2 = tickets.get(`tickets.aparencia`)


                if (ggg == null || Object.keys(ggg).length == 0 || ggg2 == null || Object.keys(ggg2).length == 0) {
                    return interaction.reply({ content: `âŒ Adicione uma função antes de postar a mensagem.`, flags: [Discord.MessageFlags.Ephemeral] });
                } else {
                    const selectaaa = new Discord.ChannelSelectMenuBuilder()
                        .setCustomId('canalpostarticket')
                        .setPlaceholder('Clique aqui para selecionar')
                        .setChannelTypes(Discord.ChannelType.GuildText)

                    const row1 = new ActionRowBuilder()
                        .addComponents(selectaaa);

                    interaction.reply({ components: [row1], content: `Selecione o canal onde quer postar a mensagem.`, flags: [Discord.MessageFlags.Ephemeral], })

                }
            }



            if (interaction.customId == 'remfuncaoticket') {


                const ggg = tickets.get(`tickets.funcoes`)

             
                    
                if (ggg == null || Object.keys(ggg).length == 0) {
                    return interaction.reply({ content: `âŒ Não existe nenhuma função criada para remover.`, flags: [Discord.MessageFlags.Ephemeral] });
                }
                
                 else {

                    const selectMenuBuilder = new Discord.StringSelectMenuBuilder()
                        .setCustomId('deletarticketsfunction')
                        .setPlaceholder('Clique aqui para selecionar')
                        .setMinValues(0)

                    for (const chave in ggg) {
                        const item = ggg[chave];

                        const option = {
                            label: `${item.nome}`,
                            description: `${item.predescricao}`,
                            value: item.nome
                        };

                        selectMenuBuilder.addOptions(option);


                    }

                    selectMenuBuilder.setMaxValues(Object.keys(ggg).length)

                    const style2row = new ActionRowBuilder().addComponents(selectMenuBuilder);
                    try {
                        await interaction.update({ components: [style2row], content: `${interaction.user} Qual funções deseja remover?`, embeds: [] })
                    } catch (error) {
                    }
                }

            }


            if (interaction.customId == 'rendimento') {
                const row = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("todayyyy")
                            .setLabel('Hoje')
                            .setStyle(2)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("7daysss")
                            .setLabel('Últimos 7 dias')
                            .setStyle(2)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("30dayss")
                            .setLabel('Últimos 30 dias')
                            .setStyle(2)
                            .setDisabled(false),
                        new ButtonBuilder()
                            .setCustomId("totalrendimento")
                            .setLabel('Rendimento Total')
                            .setStyle(3)
                            .setDisabled(false),
                    )
                interaction.reply({ content: `Olá senhor **${interaction.user.username}**, selecione algum filtro.`, components: [row], flags: [Discord.MessageFlags.Ephemeral] })
            }

            if (interaction.customId == 'gerenciarposicao') {

                Posicao1(interaction, client)

            }



            if (interaction.customId == 'Editarprimeiraposição') {

                const aa = configuracao.get(`posicoes`)

                const modalaAA = new ModalBuilder()
                    .setCustomId('aslfdjauydvaw769dg7waajnwndjo')
                    .setTitle(`Definir primeira posição`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`VALOR`)
                    .setPlaceholder(`Insira uma quantia, ex: 100`)
                    .setValue(aa?.pos1?.valor == undefined ? '' : aa.pos1?.valor)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`CARGO`)
                    .setPlaceholder(`Insira um id de algum cargo`)
                    .setValue(aa?.pos1?.role == undefined ? '' : aa.pos1?.role)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);

                modalaAA.addComponents(firstActionRow3, firstActionRow4);

                await interaction.showModal(modalaAA);
            }

            if (interaction.customId == 'Editarsegundaposição') {
                const aa = configuracao.get(`posicoes`)

                const modalaAA = new ModalBuilder()
                    .setCustomId('awiohdbawudwdwhduawdnuaw')
                    .setTitle(`Definir segunda posição`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`VALOR`)
                    .setPlaceholder(`Insira uma quantia, ex: 100`)
                    .setValue(aa?.pos2?.valor == undefined ? '' : aa.pos2?.valor)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`CARGO`)
                    .setPlaceholder(`Insira um id de algum cargo`)
                    .setValue(aa?.pos2?.role == undefined ? '' : aa.pos2?.role)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);

                modalaAA.addComponents(firstActionRow3, firstActionRow4);

                await interaction.showModal(modalaAA);
            }

            if (interaction.customId == 'Editarterceiraposição') {
                const aa = configuracao.get(`posicoes`)
                const modalaAA = new ModalBuilder()
                    .setCustomId('uy82819171h172')
                    .setTitle(`Definir terceira posição`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`VALOR`)
                    .setPlaceholder(`Insira uma quantia, ex: 100`)
                    .setValue(aa?.pos3?.valor == undefined ? '' : aa.pos3?.valor)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`CARGO`)
                    .setPlaceholder(`Insira um id de algum cargo`)
                    .setValue(aa?.pos3?.role == undefined ? '' : aa.pos3?.role)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);

                modalaAA.addComponents(firstActionRow3, firstActionRow4);

                await interaction.showModal(modalaAA);
            }


                if (interaction.customId == 'todayyyy' || interaction.customId == '7daysss' || interaction.customId == '30dayss' || interaction.customId == 'totalrendimento') {

                let name
                let rendimentoTotal = 0, quantidadeTotal = 0, produtosEntregue = 0

                if (interaction.customId == 'todayyyy') {
                    name = 'Resumo das vendas de hoje'
                    const hoje = new Date().toDateString()
                    const allStats = estatisticas.fetchAll()
                    for (const s of allStats) {
                        if (s.data?.timestamp && new Date(s.data.timestamp).toDateString() === hoje) {
                            rendimentoTotal += Number(s.data.valor) || 0
                            quantidadeTotal++
                            if (s.data.entregue) produtosEntregue++
                        }
                    }
                } else if (interaction.customId == '7daysss') {
                    name = 'Resumo das vendas nos últimos 7 dias'
                    const semanaAtras = Date.now() - 7 * 24 * 60 * 60 * 1000
                    const allStats = estatisticas.fetchAll()
                    for (const s of allStats) {
                        if (s.data?.timestamp && s.data.timestamp >= semanaAtras) {
                            rendimentoTotal += Number(s.data.valor) || 0
                            quantidadeTotal++
                            if (s.data.entregue) produtosEntregue++
                        }
                    }
                } else if (interaction.customId == '30dayss') {
                    name = 'Resumo das vendas nos últimos 30 dias'
                    const mesAtras = Date.now() - 30 * 24 * 60 * 60 * 1000
                    const allStats = estatisticas.fetchAll()
                    for (const s of allStats) {
                        if (s.data?.timestamp && s.data.timestamp >= mesAtras) {
                            rendimentoTotal += Number(s.data.valor) || 0
                            quantidadeTotal++
                            if (s.data.entregue) produtosEntregue++
                        }
                    }
                } else if (interaction.customId == 'totalrendimento') {
                    name = 'Resumo geral de todas as vendas'
                    const allStats = estatisticas.fetchAll()
                    for (const s of allStats) {
                        if (s.data?.valor) {
                            rendimentoTotal += Number(s.data.valor) || 0
                            quantidadeTotal++
                            if (s.data.entregue) produtosEntregue++
                        }
                    }
                }


                const embed = new EmbedBuilder()
                    .setColor(`${configuracao.get(`Cores.Principal`) == null ? '0cd4cc': configuracao.get('Cores.Principal')}`)
                    .setTitle(`${name}`)
                    .addFields(
                        { name: `**Rendimento**`, value: `\`R$ ${Number(rendimentoTotal).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\``, inline: true },
                        { name: `**Pedidos aprovados**`, value: `\`${quantidadeTotal}\``, inline: true },
                        { name: `**Produtos entregues**`, value: `\`${produtosEntregue}\``, inline: true },
                    )
                    .setAuthor({ name: `${interaction.user.username}` })
                    .setTimestamp()
                    .setFooter({ text: `${interaction.user.username}` })

                interaction.update({ embeds: [embed] })
            }



            if (interaction.customId.startsWith('criarrrr')) {

                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju11111idsjjsdua')
                    .setTitle(`Criação`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`NOME`)
                    .setPlaceholder(`Insira o nome do seu produto`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`DESCRIÇíO`)
                    .setPlaceholder(`Insira uma descrição para seu produto`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(1024)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`ENTREGA AUTOMíTICA?`)
                    .setPlaceholder(`Digite "sim" ou "não"`)
                    .setStyle(TextInputStyle.Short)
                    .setMaxLength(3)
                    .setRequired(true)

                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('tokenMP4')
                    .setLabel(`ICONE (OPCIONAL)`)
                    .setPlaceholder(`Insira uma URL de uma imagem ou gif`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN6 = new TextInputBuilder()
                    .setCustomId('tokenMP5')
                    .setLabel(`BANNER (OPCIONAL)`)
                    .setPlaceholder(`Insira uma URL de uma imagem ou gif`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);
                const firstActionRow7 = new ActionRowBuilder().addComponents(newnameboteN6);



                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6, firstActionRow7);
                await interaction.showModal(modalaAA);

            }

            if (interaction.customId.startsWith('infoauth')) {

                infoauth(interaction, client)

            }

            if (interaction.customId.startsWith('voltarconfigauth')) {

                configauth(interaction, client)

            }

            if (interaction.customId.startsWith('infosauth')) {

                infosauth(interaction, client)

            } 

            if (interaction.customId.startsWith('voltarauth')) {

                ecloud(interaction, client)

            }

            if (interaction.customId.startsWith('voltar1')) {

                Painel(interaction, client)

            }


            if (interaction.customId.startsWith('addfuncaoticket')) {

                const dd = tickets.get('tickets.funcoes')
               
                
                if (dd && Object.keys(dd).length > 24) {
                    return interaction.reply({ content: `âŒ | Você não pode criar mais de 24 funções em seu TICKET!` });
                }
                  
                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju11111231idsj1233js123dua123')
                    .setTitle(`Adicionar função`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`NOME DA FUNÇíO`)
                    .setPlaceholder(`Insira aqui um nome, como: Suporte`)
                    .setStyle(TextInputStyle.Short)

                    .setRequired(true)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`PRÉ DESCRIÇíO`)
                    .setPlaceholder(`Insira aqui uma pré descrição, ex: "Preciso de suporte."`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true)
                    .setMaxLength(99)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`DESCRIÇíO`)
                    .setPlaceholder(`Insira aqui a descrição da função.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(false)
                    .setMaxLength(99)

                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('tokenMP5')
                    .setLabel(`BANNER (OPCIONAL)`)
                    .setPlaceholder(`Insira aqui uma URL de uma imagem ou GIF`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN6 = new TextInputBuilder()
                    .setCustomId('tokenMP6')
                    .setLabel(`EMOJI DA FUNÇíO`)
                    .setPlaceholder(`Insira um nome ou id de um emoji do servidor.`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);
                const firstActionRow7 = new ActionRowBuilder().addComponents(newnameboteN6);


                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6, firstActionRow7);
                await interaction.showModal(modalaAA);

            }
            if (interaction.customId.startsWith('definiraparencia')) {



                const modalaAA = new ModalBuilder()
                    .setCustomId('0-89du0awd8awdaw8daw')
                    .setTitle(`Editar Ticket`);

                const dd = tickets.get(`tickets.aparencia`)

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`TITULO`)
                    .setPlaceholder(`Insira aqui um nome, como: Entrar em contato`)
                    .setStyle(TextInputStyle.Short)
                    .setValue(dd?.title == undefined ? '' : dd.title)
                    .setRequired(true)


                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`DESCRIÇíO`)
                    .setPlaceholder(`Insira aqui uma descrição.`)
                    .setStyle(TextInputStyle.Paragraph)
                    .setValue(dd?.description == undefined ? '' : dd.description)
                    .setMaxLength(500)
                    .setRequired(true)


                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`BANNER (OPCIONAL)`)
                    .setPlaceholder(`Insira aqui uma URL de uma imagem ou GIF`)
                    .setStyle(TextInputStyle.Short)
                    .setValue(dd?.banner == undefined ? '' : dd.banner)
                    .setRequired(false)



                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('tokenMP5')
                    .setLabel(`COR DO EMBED (OPCIONAL)`)
                    .setPlaceholder(`Insira aqui um código Hex Color, ex: FFFFFF`)
                    .setStyle(TextInputStyle.Short)
                    .setValue(dd?.color == undefined ? '' : dd.color)
                    .setRequired(false)


                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);

                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6);
                await interaction.showModal(modalaAA);



            }

            if (interaction.customId.startsWith('painelconfigticket')) {


                painelTicket(interaction)


            }



            if (interaction.customId.startsWith('personalizarbot')) {

                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju11111231idsjjs123dua123')
                    .setTitle(`Editar perfil do bot`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`NOME DE USUíRIO`)
                    .setValue(`${client.user.username}`)
                    .setPlaceholder(`Insira um nome de usuário (só pode mudar 3x por hora)`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`AVATAR`)
                    .setPlaceholder(`Insira uma URL de um ícone`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`STATUS 1`)
                    .setPlaceholder(`Insira aqui um status personalizado`)
                    //.setValue(`COLOCA AQUI O STATUS 1`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('tokenMP5')
                    .setLabel(`STATUS 2`)
                    //.setValue(`COLOCA AQUI O STATUS 2`)
                    .setPlaceholder(`Insira aqui um status personalizado`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);

                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6);
                await interaction.showModal(modalaAA);

            }


            if (interaction.customId.startsWith('coresembeds')) {

                const modalaAA = new ModalBuilder()
                    .setCustomId('sdaju11111idsjjs123dua123')
                    .setTitle(`Editar cores dos embeds`);

                const newnameboteN = new TextInputBuilder()
                    .setCustomId('tokenMP')
                    .setLabel(`COR PRINCIPAL`)
                    .setPlaceholder(`Insira aqui um código Hex Color, ex: #Obd4cd`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN2 = new TextInputBuilder()
                    .setCustomId('tokenMP2')
                    .setLabel(`COR DE PROCESSAMENTO`)
                    .setPlaceholder(`Insira aqui um código Hex Color, ex: #fcba03`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN4 = new TextInputBuilder()
                    .setCustomId('tokenMP3')
                    .setLabel(`COR DE SUCESSO`)
                    .setPlaceholder(`Insira aqui um código Hex Color, ex: #39fc03`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN5 = new TextInputBuilder()
                    .setCustomId('tokenMP5')
                    .setLabel(`COR DE FALHA`)
                    .setPlaceholder(`Insira aqui um código Hex Color, ex: #ff0000`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const newnameboteN6 = new TextInputBuilder()
                    .setCustomId('tokenMP6')
                    .setLabel(`COR DE FINALIZADO`)
                    .setPlaceholder(`Insira aqui um código Hex Color, ex: #7363ff`)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false)

                const firstActionRow3 = new ActionRowBuilder().addComponents(newnameboteN);
                const firstActionRow4 = new ActionRowBuilder().addComponents(newnameboteN2);
                const firstActionRow5 = new ActionRowBuilder().addComponents(newnameboteN4);
                const firstActionRow6 = new ActionRowBuilder().addComponents(newnameboteN5);
                const firstActionRow7 = new ActionRowBuilder().addComponents(newnameboteN6);



                modalaAA.addComponents(firstActionRow3, firstActionRow4, firstActionRow5, firstActionRow6, firstActionRow7);
                await interaction.showModal(modalaAA);

            }



            if (interaction.customId.startsWith('voltar2')) {

                Gerenciar(interaction, client)

            }

            if (interaction.customId.startsWith('eaffaawwawa')) {
                automatico(interaction, client)
            }

            if (interaction.customId.startsWith('voltarautomaticos')) {
                automatico(interaction, client)
            }

            if (interaction.customId.startsWith('ecloud')) {
                ecloud(interaction, client)
            }

            if (interaction.customId.startsWith('configauth')) {
                configauth(interaction, client)
            }

            if (interaction.customId.startsWith('gerenciarconfigs')) {
                Gerenciar(interaction, client)
            }

            if (interaction.customId.startsWith('configcargos')) {
                ConfigRoles(interaction, client)
            }
            if (interaction.customId.startsWith('painelpersonalizar')) {


                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("coresembeds")
                            .setLabel('Editar cores dos embeds')
                            .setEmoji(`1178080366871973958`)
                            .setStyle(1),

                        new ButtonBuilder()
                            .setCustomId("personalizarbot")
                            .setLabel('Personalizar Bot')
                            .setEmoji(`1178080828933283960`)
                            .setStyle(1),

                        new ButtonBuilder()
                            .setCustomId("definirtema")
                            .setLabel('Definir tema')
                            .setEmoji(`1178066208835252266`)
                            .setDisabled(true)
                            .setStyle(1)
                    )

                const row3 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId("voltar1")
                            .setLabel('Voltar')
                            .setEmoji(`1178068047202893869`)
                            .setStyle(2)
                    )

                interaction.update({ embeds: [], components: [row2, row3], content: `Escolha uma opção e use sua criatividade e profissionalismo ;) ` })


            }
            if (interaction.customId.startsWith('painelconfigbv')) {

                msgbemvindo(interaction, client)

            }

            if (interaction.customId.startsWith('voltar3')) {

                Gerenciar2(interaction, client)

            }

            if (interaction.customId.startsWith('voltar00')) {

                Painel(interaction, client)

            }


            if (interaction.customId.startsWith('painelconfigvendas')) {


                Gerenciar2(interaction, client)





            }



        }
    }
}

