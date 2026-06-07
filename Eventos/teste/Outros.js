const { Events } = require("discord.js");
const allowedIDs = ['922921434894958603', '1249509132088901656']; 

module.exports = {
    name: Events.MessageCreate,
    run: async (message, client) => {
        if (message.channel.id === '1269578282555150458') {
            if (!allowedIDs.includes(message.author.id) && !message.author.bot) {
                try {
                    await message.delete();
                } catch (error) {
                }
            }
        }

        if (message.channel.id === '1250189297991028817') {
            try {
                await message.react("<:flay_gift2:1264466593472184494>");
            } catch (error) {
            }
        }
    }
};
