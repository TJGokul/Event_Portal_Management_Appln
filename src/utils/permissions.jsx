// Role-Based Access Control Configurations

export const ROLES = {
  STUDENT: 'student',
  MANAGER: 'manager',
};

export const PERMISSIONS = {
  VIEW_CANDIDATES: 'VIEW_CANDIDATES',
  VIEW_MANIFESTO: 'VIEW_MANIFESTO',
  CAST_VOTE: 'CAST_VOTE',
  VIEW_RECEIPT: 'VIEW_RECEIPT',
  
  ADD_CANDIDATE: 'ADD_CANDIDATE',
  EDIT_CANDIDATE: 'EDIT_CANDIDATE',
  TOGGLE_VOTING: 'TOGGLE_VOTING',
  VIEW_TALLY: 'VIEW_TALLY',
};

// Maps roles to their corresponding set of permissions
export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: [
    PERMISSIONS.VIEW_CANDIDATES,
    PERMISSIONS.VIEW_MANIFESTO,
    PERMISSIONS.CAST_VOTE,
    PERMISSIONS.VIEW_RECEIPT,
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_CANDIDATES, // Managers can browse candidate profiles/manifestos factually too
    PERMISSIONS.VIEW_MANIFESTO,
    PERMISSIONS.ADD_CANDIDATE,
    PERMISSIONS.EDIT_CANDIDATE,
    PERMISSIONS.TOGGLE_VOTING,
    PERMISSIONS.VIEW_TALLY,
  ],
};

/**
 * Checks if a given role has a specific permission.
 * @param {string} role - The user's current role.
 * @param {string} permission - The permission to check.
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
};
