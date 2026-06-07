const { } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Caminho para o arquivo de banco de dados JSON
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

// Função para rastrear convites
const trackInvites = async (member) => {
    try {
        const inviteData = loadInviteData();
        if (!inviteData.invites) {
            inviteData.invites = {};
        }

        // Obter convites antes do novo membro entrar
        const invitesBefore = inviteData.invites[member.guild.id] || [];

        // Obter convites após o novo membro entrar
        const invitesAfter = await member.guild.invites.fetch();

        // Encontrar o convite usado
        const usedInvite = invitesAfter.find(inv => {
            const previousInvite = invitesBefore.find(i => i.code === inv.code);
            return previousInvite ? inv.uses > previousInvite.uses : false;
        });

        const welcomeChannelId = inviteData.welcomeChannel;
        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

        if (usedInvite) {
            const inviterId = usedInvite.inviter.id;
            const remainingUses = usedInvite.maxUses > 0 ? usedInvite.maxUses - usedInvite.uses : 'âˆž';

            if (welcomeChannel) {
                await welcomeChannel.send(
                    `${member.user.tag} foi convidado por <@${inviterId}> e agora tem ${remainingUses} convites restantes.`
                );
            }

            // Atualizar os dados do convite no arquivo
            inviteData.invites[member.guild.id] = invitesAfter.map(inv => ({
                code: inv.code,
                uses: inv.uses,
                inviterId: inv.inviter.id,
                maxUses: inv.maxUses,
            }));
            saveInviteData(inviteData);
        } else {
            if (welcomeChannel) {
                await welcomeChannel.send(
                    `${member.user.tag} chegou usando o convite personalizado URL do servidor.`
                );
            }
        }
    } catch (error) {
        console.error('Erro ao rastrear convites:', error);
    }
};

// Função para lidar com a saída de membros
const trackLeaves = async (member) => {
    try {
        const inviteData = loadInviteData();
        if (!inviteData.invites) return;

        const inviterPoints = inviteData.inviterPoints || {};

        // Verificar se o usuário foi convidado por alguém e diminuir o contador
        const inviteUsed = Object.values(inviteData.invites[member.guild.id] || []).find(inv => inv.inviterId === member.id);
        if (inviteUsed) {
            const inviterId = inviteUsed.inviterId;
            inviterPoints[inviterId] = (inviterPoints[inviterId] || 0) - 1;
            saveInviteData(inviteData);
        }
    } catch (error) {
        console.error('Erro ao rastrear saídas:', error);
    }
};

// Exportando para guildMemberAdd
module.exports = {
    name: 'guildMemberAdd',
    run: async (member, client) => {
        await trackInvites(member);
    }
};

// Exportando para guildMemberRemove
module.exports = {
    name: 'guildMemberRemove',
    run: async (member, client) => {
        await trackLeaves(member);
    }
};

