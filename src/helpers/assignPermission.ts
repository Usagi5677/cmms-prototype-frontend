import User from "../models/User";

export function permissionExist(data: User) {
  let hasRoleAdd = false;
  let hasRoleEdit = false;
  let hasRoleDelete = false;
  let hasMachineAdd = false;
  let hasMachineEdit = false;
  let hasMachineDelete = false;
  let hasMachineChecklistAdd = false;
  let hasMachineChecklistEdit = false;
  let hasMachineChecklistDelete = false;
  let hasMachinePeriodicMaintenanceAdd = false;
  let hasMachinePeriodicMaintenanceEdit = false;
  let hasMachinePeriodicMaintenanceDelete = false;
  let hasMachineSparePRAdd = false;
  let hasMachineSparePREdit = false;
  let hasMachineSparePRDelete = false;
  let hasMachineRepairAdd = false;
  let hasMachineRepairEdit = false;
  let hasMachineRepairDelete = false;
  let hasMachineBreakdownAdd = false;
  let hasMachineBreakdownEdit = false;
  let hasMachineBreakdownDelete = false;
  let hasMachineAttachmentAdd = false;
  let hasMachineAttachmentEdit = false;
  let hasMachineAttachmentDelete = false;
  let hasMachineAssignmentToUser = false;
  let hasMachineUnassignmentToUser = false;
  let hasTransportationAdd = false;
  let hasTransportationEdit = false;
  let hasTransportationDelete = false;
  let hasTransportationChecklistAdd = false;
  let hasTransportationChecklistEdit = false;
  let hasTransportationChecklistDelete = false;
  let hasTransportationPeriodicMaintenanceAdd = false;
  let hasTransportationPeriodicMaintenanceEdit = false;
  let hasTransportationPeriodicMaintenanceDelete = false;
  let hasTransportationSparePRAdd = false;
  let hasTransportationSparePREdit = false;
  let hasTransportationSparePRDelete = false;
  let hasTransportationRepairAdd = false;
  let hasTransportationRepairEdit = false;
  let hasTransportationRepairDelete = false;
  let hasTransportationBreakdownAdd = false;
  let hasTransportationBreakdownEdit = false;
  let hasTransportationBreakdownDelete = false;
  let hasTransportationAttachmentAdd = false;
  let hasTransportationAttachmentEdit = false;
  let hasTransportationAttachmentDelete = false;
  let hasTransportationAssignmentToUser = false;
  let hasTransportationUnassignmentToUser = false;
  let hasEditTransportationUsage = false;
  let hasEditMachineUsage = false;
  let hasAssignPermission = false;
  let hasAddUserWithRole = false;
  let hasEditUserRole = false;
  let hasViewAllMachines = false;
  let hasViewAllVessels = false;
  let hasViewAllVehicles = false;
  let hasViewMachine = false;
  let hasViewVessel = false;
  let hasViewVehicle = false;
  let hasViewAllAssignedMachines = false;
  let hasViewAllAssignedVessels = false;
  let hasViewAllAssignedVehicles = false;
  let hasViewUsers = false;
  let hasViewRoles = false;
  let hasViewMachineryReport = false;
  let hasViewTransportationReport = false;
  let hasVerifyMachinePeriodicMaintenance = false;
  let hasVerifyTransportationPeriodicMaintenance = false;

  data?.roles?.forEach((roleData) => {
    roleData?.role.permissionRoles.forEach((permissionData) => {
      switch (permissionData.permission) {
        case "ADD_ROLE":
          hasRoleAdd = true;
          break;
        case "EDIT_ROLE":
          hasRoleEdit = true;
          break;
        case "DELETE_ROLE":
          hasRoleDelete = true;
          break;
        case "ADD_MACHINE":
          hasMachineAdd = true;
          break;
        case "EDIT_MACHINE":
          hasMachineEdit = true;
          break;
        case "DELETE_MACHINE":
          hasMachineDelete = true;
          break;
        case "ADD_MACHINE_CHECKLIST":
          hasMachineChecklistAdd = true;
          break;
        case "EDIT_MACHINE_CHECKLIST":
          hasMachineChecklistEdit = true;
          break;
        case "DELETE_MACHINE_CHECKLIST":
          hasMachineChecklistDelete = true;
          break;
        case "ADD_MACHINE_PERIODIC_MAINTENANCE":
          hasMachinePeriodicMaintenanceAdd = true;
          break;
        case "EDIT_MACHINE_PERIODIC_MAINTENANCE":
          hasMachinePeriodicMaintenanceEdit = true;
          break;
        case "DELETE_MACHINE_PERIODIC_MAINTENANCE":
          hasMachinePeriodicMaintenanceDelete = true;
          break;
        case "ADD_MACHINE_SPARE_PR":
          hasMachineSparePRAdd = true;
          break;
        case "EDIT_MACHINE_SPARE_PR":
          hasMachineSparePREdit = true;
          break;
        case "DELETE_MACHINE_SPARE_PR":
          hasMachineSparePRDelete = true;
          break;
        case "ADD_MACHINE_REPAIR":
          hasMachineRepairAdd = true;
          break;
        case "EDIT_MACHINE_REPAIR":
          hasMachineRepairEdit = true;
          break;
        case "DELETE_MACHINE_REPAIR":
          hasMachineRepairDelete = true;
          break;
        case "ADD_MACHINE_BREAKDOWN":
          hasMachineBreakdownAdd = true;
          break;
        case "EDIT_MACHINE_BREAKDOWN":
          hasMachineBreakdownEdit = true;
          break;
        case "DELETE_MACHINE_BREAKDOWN":
          hasMachineBreakdownDelete = true;
          break;
        case "ADD_MACHINE_ATTACHMENT":
          hasMachineAttachmentAdd = true;
          break;
        case "EDIT_MACHINE_ATTACHMENT":
          hasMachineAttachmentEdit = true;
          break;
        case "DELETE_MACHINE_ATTACHMENT":
          hasMachineAttachmentDelete = true;
          break;
        case "ASSIGN_USER_TO_MACHINE":
          hasMachineAssignmentToUser = true;
          break;
        case "UNASSIGN_USER_TO_MACHINE":
          hasMachineUnassignmentToUser = true;
          break;
        case "ADD_TRANSPORTATION":
          hasTransportationAdd = true;
          break;
        case "EDIT_TRANSPORTATION":
          hasTransportationEdit = true;
          break;
        case "DELETE_TRANSPORTATION":
          hasTransportationDelete = true;
          break;
        case "ADD_TRANSPORTATION_CHECKLIST":
          hasTransportationChecklistAdd = true;
          break;
        case "EDIT_TRANSPORTATION_CHECKLIST":
          hasTransportationChecklistEdit = true;
          break;
        case "DELETE_TRANSPORTATION_CHECKLIST":
          hasTransportationChecklistDelete = true;
          break;
        case "ADD_TRANSPORTATION_PERIODIC_MAINTENANCE":
          hasTransportationPeriodicMaintenanceAdd = true;
          break;
        case "EDIT_TRANSPORTATION_PERIODIC_MAINTENANCE":
          hasTransportationPeriodicMaintenanceEdit = true;
          break;
        case "DELETE_TRANSPORTATION_PERIODIC_MAINTENANCE":
          hasTransportationPeriodicMaintenanceDelete = true;
          break;
        case "ADD_TRANSPORTATION_SPARE_PR":
          hasTransportationSparePRAdd = true;
          break;
        case "EDIT_TRANSPORTATION_SPARE_PR":
          hasTransportationSparePREdit = true;
          break;
        case "DELETE_TRANSPORTATION_SPARE_PR":
          hasTransportationSparePRDelete = true;
          break;
        case "ADD_TRANSPORTATION_REPAIR":
          hasTransportationRepairAdd = true;
          break;
        case "EDIT_TRANSPORTATION_REPAIR":
          hasTransportationRepairEdit = true;
          break;
        case "DELETE_TRANSPORTATION_REPAIR":
          hasTransportationRepairDelete = true;
          break;
        case "ADD_TRANSPORTATION_BREAKDOWN":
          hasTransportationBreakdownAdd = true;
          break;
        case "EDIT_TRANSPORTATION_BREAKDOWN":
          hasTransportationBreakdownEdit = true;
          break;
        case "DELETE_TRANSPORTATION_BREAKDOWN":
          hasTransportationBreakdownDelete = true;
          break;
        case "ADD_TRANSPORTATION_ATTACHMENT":
          hasTransportationAttachmentAdd = true;
          break;
        case "EDIT_TRANSPORTATION_ATTACHMENT":
          hasTransportationAttachmentEdit = true;
          break;
        case "DELETE_TRANSPORTATION_ATTACHMENT":
          hasTransportationAttachmentDelete = true;
          break;
        case "ASSIGN_USER_TO_TRANSPORTATION":
          hasTransportationAssignmentToUser = true;
          break;
        case "UNASSIGN_USER_TO_TRANSPORTATION":
          hasTransportationUnassignmentToUser = true;
          break;
        case "EDIT_MACHINE_USAGE":
          hasEditMachineUsage = true;
          break;
        case "EDIT_TRANSPORTATION_USAGE":
          hasEditTransportationUsage = true;
          break;
        case "ASSIGN_PERMISSION":
          hasAssignPermission = true;
          break;
        case "ADD_USER_WITH_ROLE":
          hasAddUserWithRole = true;
          break;
        case "EDIT_USER_ROLE":
          hasEditUserRole = true;
          break;
        case "VIEW_ALL_MACHINES":
          hasViewAllMachines = true;
          break;
        case "VIEW_ALL_VESSELS":
          hasViewAllVessels = true;
          break;
        case "VIEW_ALL_VEHICLES":
          hasViewAllVehicles = true;
          break;
        case "VIEW_MACHINE":
          hasViewMachine = true;
          break;
        case "VIEW_VESSEL":
          hasViewVessel = true;
          break;
        case "VIEW_VEHICLE":
          hasViewVehicle = true;
          break;
        case "VIEW_ALL_ASSIGNED_MACHINES":
          hasViewAllAssignedMachines = true;
          break;
        case "VIEW_ALL_ASSIGNED_VESSELS":
          hasViewAllAssignedVessels = true;
          break;
        case "VIEW_ALL_ASSIGNED_VEHICLES":
          hasViewAllAssignedVehicles = true;
          break;
        case "VIEW_USERS":
          hasViewUsers = true;
          break;
        case "VIEW_ROLES":
          hasViewRoles = true;
          break;
        case "VIEW_MACHINERY_REPORT":
          hasViewMachineryReport = true;
          break;
        case "VIEW_TRANSPORTATION_REPORT":
          hasViewTransportationReport = true;
          break;
        case "VERIFY_MACHINE_PERIODIC_MAINTENANCE":
          hasVerifyMachinePeriodicMaintenance = true;
          break;
        case "VERIFY_TRANSPORTATION_PERIODIC_MAINTENANCE":
          hasVerifyTransportationPeriodicMaintenance = true;
          break;
      }
    });
  });

  const permissions = {
    hasRoleAdd,
    hasRoleEdit,
    hasRoleDelete,
    hasMachineAdd,
    hasMachineEdit,
    hasMachineDelete,
    hasMachineChecklistAdd,
    hasMachineChecklistEdit,
    hasMachineChecklistDelete,
    hasMachinePeriodicMaintenanceAdd,
    hasMachinePeriodicMaintenanceEdit,
    hasMachinePeriodicMaintenanceDelete,
    hasMachineSparePRAdd,
    hasMachineSparePREdit,
    hasMachineSparePRDelete,
    hasMachineRepairAdd,
    hasMachineRepairEdit,
    hasMachineRepairDelete,
    hasMachineBreakdownAdd,
    hasMachineBreakdownEdit,
    hasMachineBreakdownDelete,
    hasMachineAttachmentAdd,
    hasMachineAttachmentEdit,
    hasMachineAttachmentDelete,
    hasMachineAssignmentToUser,
    hasMachineUnassignmentToUser,
    hasTransportationAdd,
    hasTransportationEdit,
    hasTransportationDelete,
    hasTransportationChecklistAdd,
    hasTransportationChecklistEdit,
    hasTransportationChecklistDelete,
    hasTransportationPeriodicMaintenanceAdd,
    hasTransportationPeriodicMaintenanceEdit,
    hasTransportationPeriodicMaintenanceDelete,
    hasTransportationSparePRAdd,
    hasTransportationSparePREdit,
    hasTransportationSparePRDelete,
    hasTransportationRepairAdd,
    hasTransportationRepairEdit,
    hasTransportationRepairDelete,
    hasTransportationBreakdownAdd,
    hasTransportationBreakdownEdit,
    hasTransportationBreakdownDelete,
    hasTransportationAttachmentAdd,
    hasTransportationAttachmentEdit,
    hasTransportationAttachmentDelete,
    hasTransportationAssignmentToUser,
    hasTransportationUnassignmentToUser,
    hasEditMachineUsage,
    hasEditTransportationUsage,
    hasAssignPermission,
    hasAddUserWithRole,
    hasEditUserRole,
    hasViewAllMachines,
    hasViewAllVessels,
    hasViewAllVehicles,
    hasViewMachine,
    hasViewVessel,
    hasViewVehicle,
    hasViewAllAssignedMachines,
    hasViewAllAssignedVessels,
    hasViewAllAssignedVehicles,
    hasViewUsers,
    hasViewRoles,
    hasViewMachineryReport,
    hasViewTransportationReport,
    hasVerifyMachinePeriodicMaintenance,
    hasVerifyTransportationPeriodicMaintenance
  };

  return permissions;
}
