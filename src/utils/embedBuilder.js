const { EmbedBuilder } = require('discord.js');
const { COLORS } = require('../constants');

function createBaseEmbed() {
    return new EmbedBuilder()
        .setColor(COLORS.PRIMARY)
        .setTimestamp();
}

function createSuccessEmbed(title, description) {
    return createBaseEmbed()
        .setColor(COLORS.SUCCESS)
        .setTitle(title || 'Sucesso')
        .setDescription(description || 'Operação realizada com sucesso.');
}

function createErrorEmbed(title, description) {
    return createBaseEmbed()
        .setColor(COLORS.DANGER)
        .setTitle(title || 'Erro')
        .setDescription(description || 'Ocorreu um erro ao executar esta operação.');
}

function createWarningEmbed(title, description) {
    return createBaseEmbed()
        .setColor(COLORS.WARNING)
        .setTitle(title || 'Aviso')
        .setDescription(description || 'Atenção necessária.');
}

function createTicketEmbed(title, description, user, guild) {
    const embed = createBaseEmbed()
        .setTitle(title)
        .setDescription(description)
        .setFooter({
            text: guild?.name || '',
            iconURL: guild?.iconURL({ dynamic: true }),
        });
    if (user) {
        embed.setAuthor({
            name: user.username,
            iconURL: user.displayAvatarURL({ dynamic: true }),
        });
    }
    return embed;
}

module.exports = {
    createBaseEmbed,
    createSuccessEmbed,
    createErrorEmbed,
    createWarningEmbed,
    createTicketEmbed,
};
