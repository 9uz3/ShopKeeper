const { JsonDatabase } = require('wio.db');
const path = require('path');

const dbPath = (name) => path.join(__dirname, '..', '..', 'DataBaseJson', `${name}.json`);

const products = new JsonDatabase({ databasePath: dbPath('produtos') });
const carts = new JsonDatabase({ databasePath: dbPath('carrinhos') });
const payments = new JsonDatabase({ databasePath: dbPath('pagamentos') });
const orders = new JsonDatabase({ databasePath: dbPath('pedidos') });
const config = new JsonDatabase({ databasePath: dbPath('configuracao') });
const stats = new JsonDatabase({ databasePath: dbPath('estatisticas') });
const tickets = new JsonDatabase({ databasePath: dbPath('tickets') });
const permissions = new JsonDatabase({ databasePath: dbPath('perms') });
const autoConfigs = new JsonDatabase({ databasePath: dbPath('configautos') });
const users = new JsonDatabase({ databasePath: dbPath('users') });
const clients = new JsonDatabase({ databasePath: dbPath('clients') });
const refunds = new JsonDatabase({ databasePath: dbPath('refounds') });

module.exports = {
    products,
    carts,
    payments,
    orders,
    config,
    stats,
    tickets,
    permissions,
    autoConfigs,
    users,
    clients,
    refunds,
};
