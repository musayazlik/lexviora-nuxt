import { createAccessControl } from 'better-auth/plugins/access';
import {
  adminAc,
  defaultStatements,
} from 'better-auth/plugins/admin/access';

/**
 * Shared between the server (authorization checks) and the client
 * (conditional UI). Lives in `shared/` so both sides import the same file.
 */

const statement = {
  ...defaultStatements,
  content: ['create', 'update', 'delete', 'publish'],
} as const;

export const ac = createAccessControl(statement);

/** Full access: everything adminAc grants + all content permissions. */
export const adminRole = ac.newRole({
  ...adminAc,
  content: ['create', 'update', 'delete', 'publish'],
});

/** Editor: can draft and edit content, but never publish or delete. */
export const editorRole = ac.newRole({
  content: ['create', 'update'],
});

export const roles = { admin: adminRole, editor: editorRole };
