const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
}

const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

const logFile = path.join(logDir, `bot-${dateStr}.log`);
const stream = fs.createWriteStream(logFile, { flags: 'a', encoding: 'utf-8' });

stream.write(`===== Bot iniciado em ${now.toLocaleString('pt-BR')} =====\n\n`);

const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = function (...args) {
    const timestamp = new Date().toLocaleString('pt-BR');
    const message = `[${timestamp}] [LOG] ${args.map(a => typeof a === 'string' ? a : JSON.stringify(a, null, 2)).join(' ')}`;
    stream.write(message + '\n');
    originalLog.apply(console, args);
};

console.error = function (...args) {
    const timestamp = new Date().toLocaleString('pt-BR');
    const message = `[${timestamp}] [ERRO] ${args.map(a => a instanceof Error ? `${a.message}\n${a.stack}` : typeof a === 'string' ? a : JSON.stringify(a, null, 2)).join(' ')}`;
    stream.write(message + '\n');
    originalError.apply(console, args);
};

console.warn = function (...args) {
    const timestamp = new Date().toLocaleString('pt-BR');
    const message = `[${timestamp}] [AVISO] ${args.map(a => typeof a === 'string' ? a : JSON.stringify(a, null, 2)).join(' ')}`;
    stream.write(message + '\n');
    originalWarn.apply(console, args);
};

process.on('exit', () => {
    stream.write(`\n===== Bot encerrado em ${new Date().toLocaleString('pt-BR')} =====\n`);
    stream.end();
});

module.exports = { logFile };
