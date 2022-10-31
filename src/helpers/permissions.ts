import { Entity } from "../models/Entity/Entity";
import EntityAssign from "../models/Entity/EntityAssign";
import User from "../models/User";

export function hasPermissions(
  user: User,
  permissions: string[],
  type: "all" | "any" = "all",
  userPermissions?: string[]
) {
  if (!userPermissions) {
    userPermissions = [];
    // Get all permissions from all roles of user
    for (const role of user.roles) {
      if (role.role?.permissionRoles) {
        const rolePermissions = role.role.permissionRoles.map(
          (pr: any) => pr.permission
        );
        userPermissions.push(...rolePermissions);
      }
    }
    // Remove duplicates
    userPermissions = [...new Set(userPermissions)];
  }
  let exists = true;
  // Returns true if user has all the permissions
  if (type === "all") {
    for (const permission of permissions) {
      if (!userPermissions?.includes(permission)) {
        exists = false;
        break;
      }
    }
  }
  // Returns true if user has any one of the permissions
  else {
    exists = false;
    for (const permission of permissions) {
      if (userPermissions?.includes(permission)) {
        exists = true;
        break;
      }
    }
  }
  return exists;
}

export function isAssignedType(
  type: "Admin" | "Engineer" | "Technician" | "User" | "any",
  entity: Entity,
  user: any
) {
  if (!entity) return false;
  const assignments = entity?.assignees;
  if(assignments) {
    let ofType;
    if (type === "any") {
      ofType = assignments;
    } else {
      ofType = assignments.filter((a) => a.type === type);
    }
    const ofTypeIds = ofType.map((o) => o.user.id);
    if (ofTypeIds.includes(user.id)) return true;
  }
  
}

// Check if user is assigned to type to any entity
export function isAssignedTypeToAny(
  type: "Admin" | "Engineer" | "Technician" | "User" | "any",
  user: any
) {
  const assignments = user.entityAssignment;
  let ofType: EntityAssign[];
  if (type === "any") {
    ofType = assignments;
  } else {
    ofType = assignments.filter((a: EntityAssign) => a.type === type);
  }
  if (ofType.length > 0) return true;
}
