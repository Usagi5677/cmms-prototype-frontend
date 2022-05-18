export enum MachineStatus {
  Working = "Working",
  Pending = "Pending",
  Breakdown = "Breakdown",
}

export enum TransportationStatus {
  Working = "Working",
  Pending = "Pending",
  Breakdown = "Breakdown",
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
  ADD_ROLE = "ADD_ROLE",
  EDIT_ROLE = "EDIT_ROLE",
  DELETE_ROLE = "DELETE_ROLE",
  ADD_PERMISSION = "ADD_PERMISSION",
  EDIT_PERMISSION = "EDIT_PERMISSION",
  DELETE_PERMISSION = "DELETE_PERMISSION",
  ADD_MACHINE = "ADD_MACHINE",
  EDIT_MACHINE = "EDIT_MACHINE",
  DELETE_MACHINE = "DELETE_MACHINE",
  ADD_TRANSPORTATION = "ADD_TRANSPORTATION",
  EDIT_TRANSPORTATION = "EDIT_TRANSPORTATION",
  DELETE_TRANSPORTATION = "DELETE_TRANSPORTATION",
}