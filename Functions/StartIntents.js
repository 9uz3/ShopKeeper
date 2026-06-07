const config = require("../config.js");

function AtivarIntents() {

    fetch('https://discord.com/api/v10/users/@me', {
        headers: {
            Authorization: `Bot ${config.token}`,
        },
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const url = `https://discord.com/api/v9/applications/${data.id}`;
            return fetch(url, {
                method: "PATCH",
                headers: {
                    Authorization: `Bot ${config.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "flags": 8953856,
                }),
            });

        })
        .catch(() => {})
}




module.exports = {
    AtivarIntents
}

