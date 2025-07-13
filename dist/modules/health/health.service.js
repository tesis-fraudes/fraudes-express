"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const check = async () => {
    return {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date(),
    };
};
exports.default = { check };
