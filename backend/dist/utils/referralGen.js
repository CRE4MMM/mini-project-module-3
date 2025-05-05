"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferral = void 0;
const { nanoid } = require('nanoid/non-secure');
const generateReferral = () => {
    return `REF-${nanoid(8)}`;
};
exports.generateReferral = generateReferral;
