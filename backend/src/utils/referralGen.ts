import { nanoid } from 'nanoid';

export const generateReferral = () => {
    return `REF-${nanoid(8)}`;
};