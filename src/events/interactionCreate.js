const { handleInteraction } = require('../handlers/interactionHandler');

module.exports = {
    name: 'interactionCreate',
    run: async (interaction, client) => {
        await handleInteraction(interaction, client);
    },
};
