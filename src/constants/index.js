module.exports = {
    COLORS: {
        PRIMARY: '#5865F2',
        SUCCESS: '#22C55E',
        WARNING: '#F59E0B',
        DANGER: '#EF4444',
        BACKGROUND: '#0d0d0d',
        SURFACE: '#111827',
        PROCESSING: '#fcba03',
    },

    EMOJIS: {
        SUCCESS: '✅',
        ERROR: '❌',
        WARNING: '⚠️',
        LOADING: '🔄',
        TICKET: '🎫',
        CART: '🛒',
        PIX: '💳',
        MONEY: '💰',
        STAFF: '👨‍💼',
        SETTINGS: '⚙️',
        PACKAGE: '📦',
        DELETE: '🗑️',
        EDIT: '✏️',
        BACK: '◀️',
        NEXT: '▶️',
        LINK: '🔗',
        BELL: '🔔',
        LOCK: '🔒',
        UNLOCK: '🔓',
        WAVE: '👋',
        STAR: '⭐',
        DATE: '📅',
        TIME: '🕐',
    },

    TICKET_PRIORITIES: {
        LOW: { label: 'Baixa', value: 'low', color: '#22C55E' },
        MEDIUM: { label: 'Média', value: 'medium', color: '#F59E0B' },
        HIGH: { label: 'Alta', value: 'high', color: '#EF4444' },
        URGENT: { label: 'Urgente', value: 'urgent', color: '#7C3AED' },
    },

    TICKET_STATUS: {
        OPEN: 'open',
        CLOSED: 'closed',
        PENDING: 'pending',
        IN_PROGRESS: 'in_progress',
        RESOLVED: 'resolved',
    },

    PERMISSIONS: {
        ADMIN: 'admin',
        STAFF: 'staff',
        SUPPORT: 'support',
        FINANCE: 'finance',
    },

    TIME: {
        CART_EXPIRY: 10 * 60 * 1000,
        COOLDOWN: 5000,
    },
};
