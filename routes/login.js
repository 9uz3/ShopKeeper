const { Router } = require("express");
const router = Router();
const discordOauth = require("discord-oauth2");

router.get("/auth/login", async(req, res) => {
    try {
        const {url, clientid, secret} = require("../DataBaseJson/configauth.json");
        if (!clientid || !secret) {
            return res.status(400).json({
                message: "Configuração de autenticação incompleta. Configure o clientid e secret no painel do bot.",
                status: 400
            });
        }
        const oauth = new discordOauth();
        res.redirect(oauth.generateAuthUrl({
            clientId: clientid,
            clientSecret: secret,
            scope: ["identify", "guilds.join"],
            redirectUri: `${url}/auth/callback`
        }));
    } catch(err) {
        res.status(500).json({
            message: `${err.message}`,
            status: 500
        });
    }
});

module.exports = router;