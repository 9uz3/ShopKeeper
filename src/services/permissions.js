const { permissions: permDb } = require('../database');

class PermissionService {
    constructor() {
        this.cache = new Map();
        this.cacheTTL = 60000;
    }

    async checkPermission(userId, requiredPermission) {
        const userPerms = await this.getUserPermissions(userId);
        if (userPerms.includes('*')) return true;
        return userPerms.includes(requiredPermission);
    }

    async getUserPermissions(userId) {
        const cached = this.cache.get(userId);
        if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
            return cached.permissions;
        }

        const allPerms = permDb.fetchAll();
        const userPerms = [];

        for (const entry of allPerms) {
            if (entry.data.users?.includes(userId)) {
                userPerms.push(entry.ID);
            }
        }

        this.cache.set(userId, {
            permissions: userPerms,
            timestamp: Date.now(),
        });

        return userPerms;
    }

    async addPermission(userId, permission) {
        const existing = permDb.get(permission) || { users: [] };
        if (!existing.users.includes(userId)) {
            existing.users.push(userId);
            permDb.set(permission, existing);
            this.cache.delete(userId);
        }
    }

    async removePermission(userId, permission) {
        const existing = permDb.get(permission);
        if (existing?.users) {
            existing.users = existing.users.filter(id => id !== userId);
            permDb.set(permission, existing);
            this.cache.delete(userId);
        }
    }

    async listPermissions(userId) {
        return this.getUserPermissions(userId);
    }

    invalidateCache(userId) {
        this.cache.delete(userId);
    }
}

module.exports = new PermissionService();
