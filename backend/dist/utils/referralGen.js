"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferral = void 0;
const nanoid_1 = require("nanoid");
const generateReferral = () => {
    return `REF-${(0, nanoid_1.nanoid)(8)}`;
};
exports.generateReferral = generateReferral;
