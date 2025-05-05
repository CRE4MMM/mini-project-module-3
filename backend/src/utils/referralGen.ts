const { nanoid } = require('nanoid/non-secure');

export const generateReferral = () => {
  return `REF-${nanoid(8)}`;
};