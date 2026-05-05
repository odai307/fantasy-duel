const INVITE_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const INVITE_CODE_LENGTH = 6;
const MAX_INVITE_CODE_RETRIES = 6;

function normalizeInviteCode(inviteCode) {
  if (!inviteCode) return null;
  return inviteCode.trim().replace(/\s+/g, '').toUpperCase();
}

function randomInviteCode(length = INVITE_CODE_LENGTH) {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * INVITE_CODE_ALPHABET.length);
    code += INVITE_CODE_ALPHABET[index];
  }
  return code;
}

module.exports = {
  normalizeInviteCode,
  randomInviteCode,
  INVITE_CODE_LENGTH,
  INVITE_CODE_ALPHABET,
  MAX_INVITE_CODE_RETRIES,
};
