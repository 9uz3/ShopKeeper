function getGreeting() {
    const brazilTime = new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' });
    const hour = new Date(brazilTime).getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
}

function formatCurrency(value) {
    return Number(value).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function isValidURL(str) {
    return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(str);
}

function truncate(str, maxLength) {
    if (!str) return '';
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str;
}

function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getTimeRemaining(timestamp) {
    const diff = timestamp - Date.now();
    if (diff <= 0) return 'Expirado';
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
}

module.exports = {
    getGreeting,
    formatCurrency,
    generateUUID,
    isValidURL,
    truncate,
    chunkArray,
    sleep,
    getTimeRemaining,
};
