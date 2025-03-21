import User from "../models/User";

export function permissionExist(data: User) {
  let hasRoleAdd = false;
  let hasRoleEdit = false;
  let hasRoleDelete = false;
  let hasEntityAdd = false;
  let hasEntityEdit = false;
  let hasEntityDelete = false;
  let hasEntityChecklistAdd = false;
  let hasEntityChecklistEdit = false;
  let hasEntityChecklistDelete = false;
  let hasEntityPeriodicMaintenanceAdd = false;
  let hasEntityPeriodicMaintenanceEdit = false;
  let hasEntityPeriodicMaintenanceDelete = false;
  let hasEntitySparePRAdd = false;
  let hasEntitySparePREdit = false;
  let hasEntitySparePRDelete = false;
  let hasEntityRepairRequestAdd = false;
  let hasEntityRepairRequestEdit = false;
  let hasEntityRepairRequestDelete = false;
  let hasEntityBreakdownAdd = false;
  let hasEntityBreakdownEdit = false;
  let hasEntityBreakdownDelete = false;
  let hasEntityAttachmentAdd = false;
  let hasEntityAttachmentEdit = false;
  let hasEntityAttachmentDelete = false;
  let hasEntityAssignmentToUser = false;
  let hasEntityUnassignmentToUser = false;
  let hasEditMachineLocation = false;
  let hasEditTransportationLocation = false;
  let hasEditEntityLocation = false;
  let hasAssignPermission = false;
  let hasAddUserWithRole = false;
  let hasEditUserRole = false;
  let hasEditUserLocation = false;
  let hasVerifyMachinePeriodicMaintenance = false;
  let hasVerifyTransportationPeriodicMaintenance = false;
  let hasVerifyEntityPeriodicMaintenance = false;
  let hasViewAllMachines = false;
  let hasViewAllVessels = false;
  let hasViewAllVehicles = false;
  let hasViewAllEntity = false;
  let hasViewMachine = false;
  let hasViewVessel = false;
  let hasViewVehicle = false;
  let hasViewEntity = false;
  let hasViewAllAssignedMachines = false;
  let hasViewAllAssignedVessels = false;
  let hasViewAllAssignedVehicles = false;
  let hasViewAllAssignedEntity = false;
  let hasViewRoles = false;
  let hasViewDashboardMachineryUtilization = false;
  let hasViewDashboardTransportsUtilization = false;
  let hasViewDashboardEntityUtilization = false;
  let hasViewDashboardMachineryMaintenance = false;
  let hasViewDashboardTransportsMaintenance = false;
  let hasViewDashboardEntityMaintenance = false;
  let hasViewDashboardMachineryPMTask = false;
  let hasViewDashboardTransportsPMTask = false;
  let hasViewDashboardEntityPMTask = false;
  let hasViewDashboardMyMachineryPMTask = false;
  let hasViewDashboardMyTransportsPMTask = false;
  let hasViewDashboardMyEntityPMTask = false;
  let hasViewDashboardStatusCount = false;
  let hasViewDashboardAssignedMachinery = false;
  let hasViewDashboardAssignedTransports = false;
  let hasViewDashboardAssignedEntity = false;

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
        case "EDIT_MACHINE_LOCATION":
          hasEditMachineLocation = true;
          break;
        case "EDIT_TRANSPORTATION_LOCATION":
          hasEditTransportationLocation = true;
          break;
        case "ADD_ENTITY":
          hasEntityAdd = true;
          break;
        case "EDIT_ENTITY":
          hasEntityEdit = true;
          break;
        case "DELETE_ENTITY":
          hasEntityDelete = true;
          break;
        case "ADD_ENTITY_CHECKLIST":
          hasEntityChecklistAdd = true;
          break;
        case "EDIT_ENTITY_CHECKLIST":
          hasEntityChecklistEdit = true;
          break;
        case "DELETE_ENTITY_CHECKLIST":
          hasEntityChecklistDelete = true;
          break;
        case "ADD_ENTITY_PERIODIC_MAINTENANCE":
          hasEntityPeriodicMaintenanceAdd = true;
          break;
        case "EDIT_ENTITY_PERIODIC_MAINTENANCE":
          hasEntityPeriodicMaintenanceEdit = true;
          break;
        case "DELETE_ENTITY_PERIODIC_MAINTENANCE":
          hasEntityPeriodicMaintenanceDelete = true;
          break;
        case "ADD_ENTITY_SPARE_PR":
          hasEntitySparePRAdd = true;
          break;
        case "EDIT_ENTITY_SPARE_PR":
          hasEntitySparePREdit = true;
          break;
        case "DELETE_ENTITY_SPARE_PR":
          hasEntitySparePRDelete = true;
          break;
        case "ADD_ENTITY_REPAIR_REQUEST":
          hasEntityRepairRequestAdd = true;
          break;
        case "EDIT_ENTITY_REPAIR_REQUEST":
          hasEntityRepairRequestEdit = true;
          break;
        case "DELETE_ENTITY_REPAIR_REQUEST":
          hasEntityRepairRequestDelete = true;
          break;
        case "ADD_ENTITY_BREAKDOWN":
          hasEntityBreakdownAdd = true;
          break;
        case "EDIT_ENTITY_BREAKDOWN":
          hasEntityBreakdownEdit = true;
          break;
        case "DELETE_ENTITY_BREAKDOWN":
          hasEntityBreakdownDelete = true;
          break;
        case "ADD_ENTITY_ATTACHMENT":
          hasEntityAttachmentAdd = true;
          break;
        case "EDIT_ENTITY_ATTACHMENT":
          hasEntityAttachmentEdit = true;
          break;
        case "DELETE_ENTITY_ATTACHMENT":
          hasEntityAttachmentDelete = true;
          break;
        case "ASSIGN_USER_TO_ENTITY":
          hasEntityAssignmentToUser = true;
          break;
        case "UNASSIGN_USER_TO_ENTITY":
          hasEntityUnassignmentToUser = true;
          break;
        case "EDIT_ENTITY_LOCATION":
          hasEditEntityLocation = true;
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
        case "EDIT_USER_LOCATION":
          hasEditUserLocation = true;
          break;
        case "VERIFY_MACHINE_PERIODIC_MAINTENANCE":
          hasVerifyMachinePeriodicMaintenance = true;
          break;
        case "VERIFY_TRANSPORTATION_PERIODIC_MAINTENANCE":
          hasVerifyTransportationPeriodicMaintenance = true;
          break;
        case "VERIFY_ENTITY_PERIODIC_MAINTENANCE":
          hasVerifyEntityPeriodicMaintenance = true;
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
        case "VIEW_ALL_ENTITY":
          hasViewAllEntity = true;
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
        case "VIEW_ENTITY":
          hasViewEntity = true;
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
        case "VIEW_ALL_ASSIGNED_ENTITY":
          hasViewAllAssignedEntity = true;
          break;
        case "VIEW_ROLES":
          hasViewRoles = true;
          break;
        case "VIEW_DASHBOARD_MACHINERY_UTILIZATION":
          hasViewDashboardMachineryUtilization = true;
          break;
        case "VIEW_DASHBOARD_TRANSPORTS_UTILIZATION":
          hasViewDashboardTransportsUtilization = true;
          break;
        case "VIEW_DASHBOARD_ENTITY_UTILIZATION":
          hasViewDashboardEntityUtilization = true;
          break;
        case "VIEW_DASHBOARD_MACHINERY_MAINTENANCE":
          hasViewDashboardMachineryMaintenance = true;
          break;
        case "VIEW_DASHBOARD_TRANSPORTS_MAINTENANCE":
          hasViewDashboardTransportsMaintenance = true;
          break;
        case "VIEW_DASHBOARD_ENTITY_MAINTENANCE":
          hasViewDashboardEntityMaintenance = true;
          break;
        case "VIEW_DASHBOARD_MACHINERY_PERIODIC_MAINTENANCE_TASK":
          hasViewDashboardMachineryPMTask = true;
          break;
        case "VIEW_DASHBOARD_TRANSPORTS_PERIODIC_MAINTENANCE_TASK":
          hasViewDashboardTransportsPMTask = true;
          break;
        case "VIEW_DASHBOARD_ENTITY_PERIODIC_MAINTENANCE_TASK":
          hasViewDashboardEntityPMTask = true;
          break;
        case "VIEW_DASHBOARD_MY_MACHINERY_PERIODIC_MAINTENANCE_TASK":
          hasViewDashboardMyMachineryPMTask = true;
          break;
        case "VIEW_DASHBOARD_MY_TRANSPORTS_PERIODIC_MAINTENANCE_TASK":
          hasViewDashboardMyTransportsPMTask = true;
          break;
        case "VIEW_DASHBOARD_MY_ENTITY_PERIODIC_MAINTENANCE_TASK":
          hasViewDashboardMyEntityPMTask = true;
          break;
        case "VIEW_DASHBOARD_STATUS_COUNT":
          hasViewDashboardStatusCount = true;
          break;
        case "VIEW_DASHBOARD_ASSIGNED_MACHINERY":
          hasViewDashboardAssignedMachinery = true;
          break;
        case "VIEW_DASHBOARD_ASSIGNED_TRANSPORTS":
          hasViewDashboardAssignedTransports = true;
          break;
        case "VIEW_DASHBOARD_ASSIGNED_ENTITY":
          hasViewDashboardAssignedEntity = true;
          break;
      }
    });
  });

  const permissions = {
    hasRoleAdd,
    hasRoleEdit,
    hasRoleDelete,
    hasEntityAdd,
    hasEntityEdit,
    hasEntityDelete,
    hasEntityChecklistAdd,
    hasEntityChecklistEdit,
    hasEntityChecklistDelete,
    hasEntityPeriodicMaintenanceAdd,
    hasEntityPeriodicMaintenanceEdit,
    hasEntityPeriodicMaintenanceDelete,
    hasEntitySparePRAdd,
    hasEntitySparePREdit,
    hasEntitySparePRDelete,
    hasEntityRepairRequestAdd,
    hasEntityRepairRequestEdit,
    hasEntityRepairRequestDelete,
    hasEntityBreakdownAdd,
    hasEntityBreakdownEdit,
    hasEntityBreakdownDelete,
    hasEntityAttachmentAdd,
    hasEntityAttachmentEdit,
    hasEntityAttachmentDelete,
    hasEntityAssignmentToUser,
    hasEntityUnassignmentToUser,
    hasEditMachineLocation,
    hasEditTransportationLocation,
    hasEditEntityLocation,
    hasAssignPermission,
    hasAddUserWithRole,
    hasEditUserRole,
    hasEditUserLocation,
    hasVerifyMachinePeriodicMaintenance,
    hasVerifyTransportationPeriodicMaintenance,
    hasVerifyEntityPeriodicMaintenance,
    hasViewAllMachines,
    hasViewAllVessels,
    hasViewAllVehicles,
    hasViewAllEntity,
    hasViewMachine,
    hasViewVessel,
    hasViewVehicle,
    hasViewEntity,
    hasViewAllAssignedMachines,
    hasViewAllAssignedVessels,
    hasViewAllAssignedVehicles,
    hasViewAllAssignedEntity,
    hasViewRoles,
    hasViewDashboardMachineryUtilization,
    hasViewDashboardTransportsUtilization,
    hasViewDashboardEntityUtilization,
    hasViewDashboardMachineryMaintenance,
    hasViewDashboardTransportsMaintenance,
    hasViewDashboardEntityMaintenance,
    hasViewDashboardMachineryPMTask,
    hasViewDashboardTransportsPMTask,
    hasViewDashboardEntityPMTask,
    hasViewDashboardMyMachineryPMTask,
    hasViewDashboardMyTransportsPMTask,
    hasViewDashboardMyEntityPMTask,
    hasViewDashboardStatusCount,
    hasViewDashboardAssignedMachinery,
    hasViewDashboardAssignedTransports,
    hasViewDashboardAssignedEntity,
  };

  return permissions;
}
