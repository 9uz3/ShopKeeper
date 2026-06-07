const { Router } = require("express");
const router = Router();
const discordOauth = require("discord-oauth2");
const oauth = new discordOauth();
const { token: tokenBot } = require("../config.js");
const { url, clientid, secret, role, guild_id, webhook_logs } = require("../DataBaseJson/configauth.json");
const requestIp = require("request-ip");
const { JsonDatabase } = require("wio.db");
const users = new JsonDatabase({ databasePath: "./DataBaseJson/users.json" });
const axios = require("axios");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

function gettempodessaporra(creationDate) {
    const now = new Date();
    const created = new Date(creationDate);
    const diff = new Date(now - created);
    const years = diff.getUTCFullYear() - 1970;
    const months = diff.getUTCMonth();
    const days = diff.getUTCDate() - 1;

    let essafitaprc = '';
    if (months > 0) essafitaprc += `${months} meses `;

    return essafitaprc.trim();
}

function getCreationDate(discordId) {
    const binary = BigInt(discordId).toString(2).padStart(64, '0').slice(0, 42);
    const timestamp = parseInt(binary, 2) + 1420070400000;
    return new Date(timestamp);
}

function parseUserAgent(userAgent) {
    const osRegex = /\(([^)]+)\)/;
    const browserRegex = /([a-zA-Z]+)\/([0-9.]+)/g;

    const osMatch = userAgent.match(osRegex);
    const os = osMatch ? osMatch[1] : "Unknown OS";

    let browser = "Unknown Browser";
    let match;
    while ((match = browserRegex.exec(userAgent)) !== null) {
        if (match[1] !== "Mozilla" && match[1] !== "AppleWebKit" && match[1] !== "Safari") {
            browser = `${match[1]} ${match[2]}`;
            break;
        }
    }

    return `${os}, ${browser}`;
}

router.get("/auth/callback", async (req, res) => {
    const ip = requestIp.getClientIp(req);
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "Código de autorização não fornecido.", status: 400 });

    try {
        const responseToken = await axios.post(
            'https://discord.com/api/oauth2/token',
            `client_id=${clientid}&client_secret=${secret}&code=${code}&grant_type=authorization_code&redirect_uri=${url}/auth/callback&scope=identify+guilds.join`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const token = responseToken.data;
        const responseUser = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                authorization: `${token.token_type} ${token.access_token}`,
            },
        });

        const user = responseUser.data;
        const datadecri = getCreationDate(user.id);

        let loc = 'N/A';
        try {
            const ipInfoResponse = await axios.get(`https://ipinfo.io/${ip}/json`, { timeout: 3000 });
            const ipInfo = ipInfoResponse.data;
            loc = `${ipInfo.city || 'Unknown City'}, ${ipInfo.region || 'Unknown Region'}, ${ipInfo.country || 'Unknown Country'}`;
        } catch (e) {}

        const userAgent = req.get('User-Agent');
        const dispositivo = parseUserAgent(userAgent);

        if (guild_id && role) {
            try {
                const guildUrl = `https://discord.com/api/v9/guilds/${guild_id}/members/${user.id}`;
                const headers = {
                    'Authorization': `Bot ${tokenBot}`,
                    'Content-Type': 'application/json',
                };
                await axios.patch(guildUrl, { roles: [role] }, { headers });
            } catch (e) {
                console.error('Erro ao atribuir cargo:', e?.response?.data || e.message);
            }
        }

        if (webhook_logs) {
            try {
                await axios.post(webhook_logs, {
                    content: `<@${user.id}>`,
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('✅ Usuário Verificado')
                            .setColor(0x5865F2)
                            .addFields(
                                { name: 'Usuário', value: `<@${user.id}>`, inline: true },
                                { name: 'IP', value: `||${ip}||`, inline: true },
                                { name: 'Conta Criada', value: `<t:${Math.floor(datadecri.getTime() / 1000)}:R>`, inline: true },
                                { name: 'Informações', value: `Localização: ${loc}\nDispositivo: ${dispositivo}`, inline: false }
                            )
                            .setTimestamp()
                    ],
                });
            } catch (e) {}
        }

        await users.set(`${user.id}`, {
            username: user.username,
            acessToken: token.access_token,
            refreshToken: token.refresh_token,
            code,
            verifiedAt: Date.now(),
            ip,
        });

        res.redirect(`https://discord.com/channels/${guild_id || '@me'}`);
    } catch (error) {
        console.error('Erro no callback de autenticação:', error);
        res.status(500).json({ message: 'Erro ao verificar usuário.', status: 500 });
    }
});

module.exports = router;

