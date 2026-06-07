const fs = require("fs");
const path = require("path");

async function getPermissions() {
    const filePath = path.join(__dirname, "..", "DataBaseJson", "perms.json");
    let perms;
    try {
        if (fs.existsSync(filePath)) {
            perms = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        } else {
            return null;
        }
    } catch {
        return null;
    }
    return Object.values(perms);
}

module.exports = {
    getPermissions
};