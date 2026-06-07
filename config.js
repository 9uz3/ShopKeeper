require('dotenv').config();
const { configuracao } = require("./DataBaseJson");

module.exports = {
    token: process.env.TOKEN || "",
    dono: process.env.OWNER_ID || "1249509132088901656",
    getMpApi: () => process.env.MP_API_KEY || configuracao.get('pagamentos.MpAPI') || "",
};

