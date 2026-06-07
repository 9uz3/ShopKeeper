const { EmbedBuilder } = require("discord.js");
const { carrinhos, pagamentos, configuracao } = require("../DataBaseJson");

async function CloseThreds(client) {
    for (const guild of client.guilds.cache.values()) {
        const hilos = guild.channels.cache.filter((channel) => {
            return channel.isThread() && channel.name.includes('🛒');
        });

        for (const element of hilos.values()) {
            const ignorePattern = /^🛒・membros・\d+$/;
            if (ignorePattern.test(element.name)) {
                continue;
            }

            const dataOriginal = new Date(element.createdTimestamp);
            const novoTimestamp = dataOriginal.getTime() + 10 * 60 * 1000;
            if (Date.now() > novoTimestamp) {
                try {
                    await element.delete();
                } catch (error) {
                }

                const texto = element.name;
                const partes = texto.split("・");
                const ultimoNumero = partes[partes.length - 1];
                pagamentos.delete(element.id);
                carrinhos.delete(element.id);

                try {
                    const member = await client.users.fetch(ultimoNumero);

                    const embed = new EmbedBuilder()
                        .setColor(`${configuracao.get(`Cores.Erro`) == null ? `#ff0000` : configuracao.get(`Cores.Erro`)}`)
                        .setTitle(`Carrinho expirado.`)
                        .setDescription(`Seu carrinho foi fechado por inatividade.`);

                    await member.send({ embeds: [embed] });
                } catch (error) {
                }

                try {
                    const channela = await client.channels.fetch(configuracao.get('ConfigChannels.logpedidos'));

                    const embed = new EmbedBuilder()
                        .setColor(`${configuracao.get(`Cores.Erro`) == null ? `#ff0000` : configuracao.get(`Cores.Erro`)}`)
                        .setTitle(`Carrinho expirado.`)
                        .setDescription(`O carrinho de <@!${ultimoNumero}> foi fechado por inatividade (\`10 Minutos\`).`);

                    await channela.send({ embeds: [embed] });
                } catch (error) {
                }
            }
        }
    }
}

module.exports = {
    CloseThreds
};

