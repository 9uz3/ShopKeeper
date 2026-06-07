const Discord = require("discord.js");
const { carrinhos, produtos } = require("../DataBaseJson")
const { DentroCarrinho1 } = require("./DentroCarrinho")



async function VerificarCupom(interaction, cupom) {



    const ggg = carrinhos.get(interaction.channel.id)

    const hhhh = produtos.get(`${ggg.infos.produto}.Cupom`)
    const gggaaa = hhhh.find(campo22 => campo22.Nome === cupom)



    if (ggg.cupomadicionado !== undefined) return interaction.reply({ content: `âŒ Você já possuí um cupom aplicado.`, flags: [Discord.MessageFlags.Ephemeral] })

    if (gggaaa == undefined) return interaction.reply({ content: `âŒ Cupom não encontrado para esse produto!`, flags: [Discord.MessageFlags.Ephemeral] })



    if (Date.now() > gggaaa.diasvalidos) {
        const indexToDelete = hhhh.findIndex(campo22 => campo22.Nome === cupom);

        if (indexToDelete !== -1) {
            hhhh.splice(indexToDelete, 1);
        }

        await produtos.set(`${ggg.infos.produto}.Cupom`, hhhh)

        interaction.reply({ content: `âŒ Cupom não encontrado para esse produto!`, flags: [Discord.MessageFlags.Ephemeral] })
        return
    }




    if (gggaaa.condicoes?.cargospodeusar !== undefined) {
        const member = await interaction.guild.members.fetch(interaction.user.id);
        const temCargo = member.roles.cache.has(gggaaa.condicoes?.cargospodeusar);

        if (temCargo == false) return interaction.reply({ content: `âŒ Você não possui permissão para utilizar esse cupom!`, flags: [Discord.MessageFlags.Ephemeral] })
    }


    if (gggaaa.qtd !== undefined) {
        if (gggaaa.usos >= gggaaa.qtd) return interaction.reply({ content: `âŒ Esse cupom foi limitado em  \`${gggaaa.qtd}\` usos (que já foram utilizados).`, flags: [Discord.MessageFlags.Ephemeral] })
    }

    if (gggaaa.maxuse !== undefined) {
        if (gggaaa.users !== undefined) {
            const occurrences = gggaaa.users.filter(id => id === interaction.user.id).length;

            if (occurrences >= gggaaa.maxuse) {
                await interaction.reply({ content: `âŒ Você já utilizou esse cupom o maximo de vezes permitidas \`${gggaaa.maxuse}\` (POR PESSOA).`, flags: [Discord.MessageFlags.Ephemeral] })
                return
            }
        }
    }

    if (gggaaa.condicoes?.precominimo !== undefined) {
        if (Number(ggg.quantidadeselecionada) < Number(gggaaa.condicoes?.precominimo)) return interaction.reply({ content: `âŒ Para utilizar o cupom \`${cupom}\` você precisa inserir uma quantia igual ou acima de \`${Number(gggaaa.condicoes.precominimo)}\`.`, flags: [Discord.MessageFlags.Ephemeral] })
    }

    if (gggaaa.condicoes?.qtdmaxima !== undefined) {
        if (Number(ggg.quantidadeselecionada) > Number(gggaaa.condicoes?.qtdmaxima)) return interaction.reply({ content: `âŒ Para utilizar o cupom \`${cupom}\` você precisa inserir uma quantia igual ou abaixo de \`${Number(gggaaa.condicoes.qtdmaxima)}\`.`, flags: [Discord.MessageFlags.Ephemeral] })
    }



    gggaaa.usos = gggaaa.usos + 1


    gggaaa.users = gggaaa.users || [];
    gggaaa.users.push(interaction.user.id)
    await produtos.set(`${ggg.infos.produto}.Cupom`, hhhh)


    await carrinhos.set(`${interaction.channel.id}.cupomadicionado`, cupom)

    await DentroCarrinho1(interaction, 1)


}

module.exports = {
    VerificarCupom
}

