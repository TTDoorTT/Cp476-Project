function canManageResource(sessionUser, ownerId) {
  if (!sessionUser) return false;
  if (sessionUser.role === "admin") return true;
  return sessionUser.id === ownerId;
}

module.exports = { canManageResource };