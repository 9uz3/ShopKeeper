require('dotenv').config();

module.exports = {
    token: process.env.TOKEN || '',
    ownerId: process.env.OWNER_ID || '',
    getMpApi: () => process.env.MP_API_KEY || '',
    restartApiKey: process.env.RESTART_API_KEY || '',
    port: process.env.PORT || 3000,
};
