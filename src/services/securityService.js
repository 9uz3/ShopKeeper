class SecurityService {
    constructor() {
        this.cooldowns = new Map();
        this.rateLimits = new Map();
        this.blockedUsers = new Set();
    }

    checkCooldown(userId, command, cooldownMs = 5000) {
        const key = `${userId}_${command}`;
        const lastUsed = this.cooldowns.get(key);
        if (lastUsed && Date.now() - lastUsed < cooldownMs) {
            return {
                onCooldown: true,
                remaining: cooldownMs - (Date.now() - lastUsed),
            };
        }
        this.cooldowns.set(key, Date.now());
        return { onCooldown: false, remaining: 0 };
    }

    checkRateLimit(userId, maxRequests = 10, windowMs = 60000) {
        const now = Date.now();
        if (!this.rateLimits.has(userId)) {
            this.rateLimits.set(userId, { count: 1, start: now });
            return { limited: false, count: 1 };
        }

        const data = this.rateLimits.get(userId);
        if (now - data.start > windowMs) {
            this.rateLimits.set(userId, { count: 1, start: now });
            return { limited: false, count: 1 };
        }

        data.count++;
        if (data.count > maxRequests) {
            return { limited: true, count: data.count };
        }

        return { limited: false, count: data.count };
    }

    blockUser(userId) {
        this.blockedUsers.add(userId);
    }

    unblockUser(userId) {
        this.blockedUsers.delete(userId);
    }

    isBlocked(userId) {
        return this.blockedUsers.has(userId);
    }

    validateInput(input, maxLength = 100) {
        if (typeof input !== 'string') return false;
        if (input.length > maxLength) return false;
        if (/[<>]/g.test(input)) return false;
        return true;
    }

    sanitizeMessage(content) {
        return content
            .replace(/@everyone/g, '@\u200Beveryone')
            .replace(/@here/g, '@\u200Bhere')
            .replace(/<@&/g, '<@&\u200B');
    }
}

module.exports = new SecurityService();
