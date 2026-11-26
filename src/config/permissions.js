import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
};

export const ac = createAccessControl(statement);

export const adminRole = ac.newRole({
  ...adminAc.statements,
});

export const studentRole = ac.newRole({});

export const tutorRole = ac.newRole({});