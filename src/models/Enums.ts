export enum MachineStatus {
  Working = "Working",
  Idle = "Idle",
  Breakdown = "Breakdown",
  Dispose = "Dispose",
}

export enum TransportationStatus {
  Working = "Working",
  Idle = "Idle",
  Breakdown = "Breakdown",
  Dispose = "Dispose",
}


export enum RepairStatus {
  Done = "Done",
  Pending = "Pending",
}

export enum BreakdownStatus {
  Done = "Done",
  Pending = "Pending",
  Breakdown = "Breakdown",
}

export enum SparePRStatus {
  Done = "Done",
  Pending = "Pending",
}

export enum PeriodicMaintenanceStatus {
  Done = "Done",
  Pending = "Pending",
  Missed = "Missed",
}


export enum PermissionEnum {
  ADD_ROLE = 'ADD_ROLE',
  EDIT_ROLE = 'EDIT_ROLE',
  DELETE_ROLE = 'DELETE_ROLE',
  ADD_MACHINE = 'ADD_MACHINE',
  EDIT_MACHINE = 'EDIT_MACHINE',
  DELETE_MACHINE = 'DELETE_MACHINE',
  ADD_MACHINE_CHECKLIST = 'ADD_MACHINE_CHECKLIST',
  EDIT_MACHINE_CHECKLIST = 'EDIT_MACHINE_CHECKLIST',
  DELETE_MACHINE_CHECKLIST = 'DELETE_MACHINE_CHECKLIST',
  ADD_MACHINE_PERIODIC_MAINTENANCE = 'ADD_MACHINE_PERIODIC_MAINTENANCE',
  EDIT_MACHINE_PERIODIC_MAINTENANCE = 'EDIT_MACHINE_PERIODIC_MAINTENANCE',
  DELETE_MACHINE_PERIODIC_MAINTENANCE = 'DELETE_MACHINE_PERIODIC_MAINTENANCE',
  ADD_MACHINE_SPARE_PR = 'ADD_MACHINE_SPARE_PR',
  EDIT_MACHINE_SPARE_PR = 'EDIT_MACHINE_SPARE_PR',
  DELETE_MACHINE_SPARE_PR = 'DELETE_MACHINE_SPARE_PR',
  ADD_MACHINE_REPAIR = 'ADD_MACHINE_REPAIR',
  EDIT_MACHINE_REPAIR = 'EDIT_MACHINE_REPAIR',
  DELETE_MACHINE_REPAIR = 'DELETE_MACHINE_REPAIR',
  ADD_MACHINE_BREAKDOWN = 'ADD_MACHINE_BREAKDOWN',
  EDIT_MACHINE_BREAKDOWN = 'EDIT_MACHINE_BREAKDOWN',
  DELETE_MACHINE_BREAKDOWN = 'DELETE_MACHINE_BREAKDOWN',
  ADD_MACHINE_ATTACHMENT = 'ADD_MACHINE_ATTACHMENT',
  EDIT_MACHINE_ATTACHMENT = 'EDIT_MACHINE_ATTACHMENT',
  DELETE_MACHINE_ATTACHMENT = 'DELETE_MACHINE_ATTACHMENT',
  ADD_TRANSPORTATION = 'ADD_TRANSPORTATION',
  EDIT_TRANSPORTATION = 'EDIT_TRANSPORTATION',
  DELETE_TRANSPORTATION = 'DELETE_TRANSPORTATION',
  ADD_TRANSPORTATION_CHECKLIST = 'ADD_TRANSPORTATION_CHECKLIST',
  EDIT_TRANSPORTATION_CHECKLIST = 'EDIT_TRANSPORTATION_CHECKLIST',
  DELETE_TRANSPORTATION_CHECKLIST = 'DELETE_TRANSPORTATION_CHECKLIST',
  ADD_TRANSPORTATION_PERIODIC_MAINTENANCE = 'ADD_TRANSPORTATION_PERIODIC_MAINTENANCE',
  EDIT_TRANSPORTATION_PERIODIC_MAINTENANCE = 'EDIT_TRANSPORTATION_PERIODIC_MAINTENANCE',
  DELETE_TRANSPORTATION_PERIODIC_MAINTENANCE = 'DELETE_TRANSPORTATION_PERIODIC_MAINTENANCE',
  ADD_TRANSPORTATION_SPARE_PR = 'ADD_TRANSPORTATION_SPARE_PR',
  EDIT_TRANSPORTATION_SPARE_PR = 'EDIT_TRANSPORTATION_SPARE_PR',
  DELETE_TRANSPORTATION_SPARE_PR = 'DELETE_TRANSPORTATION_SPARE_PR',
  ADD_TRANSPORTATION_REPAIR = 'ADD_TRANSPORTATION_REPAIR',
  EDIT_TRANSPORTATION_REPAIR = 'EDIT_TRANSPORTATION_REPAIR',
  DELETE_TRANSPORTATION_REPAIR = 'DELETE_TRANSPORTATION_REPAIR',
  ADD_TRANSPORTATION_BREAKDOWN = 'ADD_TRANSPORTATION_BREAKDOWN',
  EDIT_TRANSPORTATION_BREAKDOWN = 'EDIT_TRANSPORTATION_BREAKDOWN',
  DELETE_TRANSPORTATION_BREAKDOWN = 'DELETE_TRANSPORTATION_BREAKDOWN',
  ADD_TRANSPORTATION_ATTACHMENT = 'ADD_TRANSPORTATION_ATTACHMENT',
  EDIT_TRANSPORTATION_ATTACHMENT = 'EDIT_TRANSPORTATION_ATTACHMENT',
  DELETE_TRANSPORTATION_ATTACHMENT = 'DELETE_TRANSPORTATION_ATTACHMENT',
  ASSIGN_USER_TO_MACHINE = 'ASSIGN_USER_TO_MACHINE',
  UNASSIGN_USER_TO_MACHINE = 'UNASSIGN_USER_TO_MACHINE',
  ASSIGN_USER_TO_TRANSPORTATION = 'ASSIGN_USER_TO_TRANSPORTATION',
  UNASSIGN_USER_TO_TRANSPORTATION = 'UNASSIGN_USER_TO_TRANSPORTATION',
  EDIT_MACHINE_USAGE = 'EDIT_MACHINE_USAGE',
  EDIT_TRANSPORTATION_USAGE = 'EDIT_TRANSPORTATION_USAGE',
  ASSIGN_PERMISSION = 'ASSIGN_PERMISSION',
  ADD_USER_WITH_ROLE = 'ADD_USER_WITH_ROLE',
  EDIT_USER_ROLE = 'EDIT_USER_ROLE',
  VIEW_ALL_MACHINES = 'VIEW_ALL_MACHINES',
  VIEW_ALL_VESSELS = 'VIEW_ALL_VESSELS',
  VIEW_ALL_VEHICLES = 'VIEW_ALL_VEHICLES',
  VIEW_MACHINE = 'VIEW_MACHINE',
  VIEW_VESSEL = 'VIEW_VESSEL',
  VIEW_VEHICLE = 'VIEW_VEHICLE',
  VIEW_ALL_ASSIGNED_MACHINES = 'VIEW_ALL_ASSIGNED_MACHINES',
  VIEW_ALL_ASSIGNED_VESSELS = 'VIEW_ALL_ASSIGNED_VESSELS',
  VIEW_ALL_ASSIGNED_VEHICLES = 'VIEW_ALL_ASSIGNED_VEHICLES',
  VIEW_USERS = 'VIEW_USERS',
  VIEW_ROLES = 'VIEW_ROLES',
  VIEW_MACHINERY_REPORT = 'VIEW_MACHINERY_REPORT',
  VIEW_TRANSPORTATION_REPORT = 'VIEW_TRANSPORTATION_REPORT',
}