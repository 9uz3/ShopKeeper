const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const { products: productDb, config } = require('../database');
const { QuickDB } = require('quick.db');
const { COLORS } = require('../constants');
const { formatCurrency, isValidURL } = require('../utils/helpers');

const db = new QuickDB();

function GerenciarProduto(interaction, status, productName) {
    const product = productDb.get(productName);

    if (status !== 3) {
        db.set(interaction.message.id, { name: productName });
    }

    let campos = '';
    if (!product.Campos || product.Campos.length === 0) {
        campos = 'Nenhum campo adicionado';
    } else {
        const start = Math.max(0, product.Campos.length - 5);
        for (let i = product.Campos.length - 1; i >= start; i--) {
            const c = product.Campos[i];
            campos += `- Nome: \`${c.Nome}\` Estoque: \`${c.estoque.length}\` Valor: \`R$ ${formatCurrency(c.valor)}\`\n`;
        }
        if (product.Campos.length > 5) {
            campos += `E mais ${product.Campos.length - 5}...`;
        }
    }

    let cupomText = '';
    if (!product.Cupom || product.Cupom.length === 0) {
        cupomText = 'Nenhum cupom';
    } else {
        const start = Math.max(0, product.Cupom.length - 3);
        for (let i = product.Cupom.length - 1; i >= start; i--) {
            const cup = product.Cupom[i];
            cupomText += `- Código: \`${cup.Nome}\` Qtd: \`${cup.qtd || 'Ilimitado'}\` Desconto: \`${cup.desconto}%\` Usos: \`${cup.usos || 0}\`\n`;
        }
        if (product.Cupom.length > 3) {
            cupomText += `E mais ${product.Cupom.length - 3}...`;
        }
    }

    const embed = new EmbedBuilder()
        .setAuthor({ iconURL: interaction.guild.iconURL({ dynamic: true }), name: product.Config.name })
        .setTitle('Detalhes do Produto')
        .setColor(config.get('Cores.Principal') || COLORS.PRIMARY)
        .addFields(
            { name: '📦 Campos', value: campos },
            { name: '🎫 Cupons', value: cupomText },
            { name: '🚚 Entrega automática', value: product.Config.entrega || 'Não' }
        )
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
        .setTimestamp();

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('editproduto').setLabel('Editar').setEmoji('✏️').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('gencampos').setLabel('Gerenciar campos').setEmoji('📋').setStyle(ButtonStyle.Primary),
        new ButtonBuilder().setCustomId('gencupons').setLabel('Gerenciar cupons').setEmoji('🎟️').setStyle(ButtonStyle.Primary),
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('colocarvenda').setLabel('Colocar à venda').setEmoji('💰').setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId('excluirproduto').setLabel('Excluir').setEmoji('🗑️').setStyle(ButtonStyle.Danger),
    );

    const row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId('syncproduto').setLabel('Sincronizar').setEmoji('🔄').setStyle(ButtonStyle.Secondary),
        new ButtonBuilder().setCustomId('voltar3').setLabel('Voltar').setEmoji('◀️').setStyle(ButtonStyle.Secondary),
    );

    const components = [row1, row2, row3];

    if (status === 1) interaction.editReply({ embeds: [embed], components });
    else if (status === 2) interaction.update({ embeds: [embed], components });
    else if (status === 3) {
        interaction.reply({ embeds: [embed], components, flags: [MessageFlags.Ephemeral], fetchReply: true })
            .then(async () => {
                const message = await interaction.fetchReply();
                db.set(message.id, { name: productName });
            });
    }
}

module.exports = { GerenciarProduto };
