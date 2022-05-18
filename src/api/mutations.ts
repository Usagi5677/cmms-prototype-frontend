import { gql } from "@apollo/client";

export const CREATE_MACHINE = gql`
  mutation (
    $machineNumber: String!
    $model: String!
    $type: String!
    $zone: String!
    $location: String!
    $currentRunningHrs: Int!
    $lastServiceHrs: Int!
    $registeredDate: Date!
  ) {
    createMachine(
      machineNumber: $machineNumber
      model: $model
      type: $type
      zone: $zone
      location: $location
      currentRunningHrs: $currentRunningHrs
      lastServiceHrs: $lastServiceHrs
      registeredDate: $registeredDate
    )
  }
`;

export const EDIT_MACHINE = gql`
  mutation (
    $id: Int!
    $machineNumber: String!
    $model: String!
    $type: String!
    $zone: String!
    $location: String!
    $currentRunningHrs: Int!
    $lastServiceHrs: Int!
    $registeredDate: Date!
  ) {
    editMachine(
      id: $id
      machineNumber: $machineNumber
      model: $model
      type: $type
      zone: $zone
      location: $location
      currentRunningHrs: $currentRunningHrs
      lastServiceHrs: $lastServiceHrs
      registeredDate: $registeredDate
    )
  }
`;

export const DELETE_MACHINE = gql`
  mutation ($machineId: Int!) {
    removeMachine(machineId: $machineId)
  }
`;

export const ADD_MACHINE_CHECKLIST_ITEM = gql`
  mutation ($machineId: Int!, $description: String!, $type: String!) {
    addMachineChecklistItem(
      machineId: $machineId
      description: $description
      type: $type
    )
  }
`;

export const TOGGLE_MACHINE_CHECKLIST_ITEM = gql`
  mutation ($id: Int!, $complete: Boolean!) {
    toggleMachineChecklistItem(id: $id, complete: $complete)
  }
`;

export const DELETE_MACHINE_CHECKLIST_ITEM = gql`
  mutation ($id: Int!) {
    deleteMachineChecklistItem(id: $id)
  }
`;

export const ADD_MACHINE_PERIODIC_MAINTENANCE = gql`
  mutation (
    $machineId: Int!
    $title: String!
    $description: String!
    $period: Int!
    $notificationReminder: Int!
  ) {
    addMachinePeriodicMaintenance(
      machineId: $machineId
      title: $title
      description: $description
      period: $period
      notificationReminder: $notificationReminder
    )
  }
`;

export const EDIT_MACHINE_PERIODIC_MAINTENANCE = gql`
  mutation (
    $id: Int!
    $title: String!
    $description: String!
    $period: Int!
    $notificationReminder: Int!
  ) {
    editMachinePeriodicMaintenance(
      id: $id
      title: $title
      description: $description
      period: $period
      notificationReminder: $notificationReminder
    )
  }
`;

export const SET_MACHINE_PERIODIC_MAINTENANCE_STATUS = gql`
  mutation ($id: Int!, $status: PeriodicMaintenanceStatus!) {
    setMachinePeriodicMaintenanceStatus(id: $id, status: $status)
  }
`;

export const DELETE_MACHINE_PERIODIC_MAINTENANCE = gql`
  mutation ($id: Int!) {
    deleteMachinePeriodicMaintenance(id: $id)
  }
`;

export const ADD_MACHINE_SPARE_PR = gql`
  mutation (
    $machineId: Int!
    $title: String!
    $description: String!
    $requestedDate: Date!
  ) {
    addMachineSparePR(
      machineId: $machineId
      title: $title
      description: $description
      requestedDate: $requestedDate
    )
  }
`;

export const EDIT_MACHINE_SPARE_PR = gql`
  mutation (
    $id: Int!
    $title: String!
    $description: String!
    $requestedDate: Date!
  ) {
    editMachineSparePR(
      id: $id
      title: $title
      description: $description
      requestedDate: $requestedDate
    )
  }
`;

export const DELETE_MACHINE_SPARE_PR = gql`
  mutation ($id: Int!) {
    deleteMachineSparePR(id: $id)
  }
`;

export const SET_MACHINE_SPARE_PR_STATUS = gql`
  mutation ($id: Int!, $status: SparePRStatus!) {
    setMachineSparePRStatus(id: $id, status: $status)
  }
`;

export const ADD_MACHINE_REPAIR = gql`
  mutation ($machineId: Int!, $title: String!, $description: String!) {
    addMachineRepair(
      machineId: $machineId
      title: $title
      description: $description
    )
  }
`;

export const EDIT_MACHINE_REPAIR = gql`
  mutation ($id: Int!, $title: String!, $description: String!) {
    editMachineRepair(id: $id, title: $title, description: $description)
  }
`;

export const DELETE_MACHINE_REPAIR = gql`
  mutation ($id: Int!) {
    deleteMachineRepair(id: $id)
  }
`;

export const SET_MACHINE_REPAIR_STATUS = gql`
  mutation ($id: Int!, $status: RepairStatus!) {
    setMachineRepairStatus(id: $id, status: $status)
  }
`;

export const ADD_MACHINE_BREAKDOWN = gql`
  mutation ($machineId: Int!, $title: String!, $description: String!) {
    addMachineBreakdown(
      machineId: $machineId
      title: $title
      description: $description
    )
  }
`;

export const EDIT_MACHINE_BREAKDOWN = gql`
  mutation ($id: Int!, $title: String!, $description: String!) {
    editMachineBreakdown(id: $id, title: $title, description: $description)
  }
`;

export const DELETE_MACHINE_BREAKDOWN = gql`
  mutation ($id: Int!) {
    deleteMachineBreakdown(id: $id)
  }
`;

export const SET_MACHINE_BREAKDOWN_STATUS = gql`
  mutation ($id: Int!, $status: BreakdownStatus!) {
    setMachineBreakdownStatus(id: $id, status: $status)
  }
`;

export const SET_MACHINE_STATUS = gql`
  mutation ($machineId: Int!, $status: MachineStatus!) {
    setMachineStatus(machineId: $machineId, status: $status)
  }
`;

export const DELETE_MACHINE_ATTACHMENT = gql`
  mutation ($id: Int!) {
    removeMachineAttachment(id: $id)
  }
`;

export const EDIT_MACHINE_ATTACHMENT = gql`
  mutation ($id: Int!, $description: String!) {
    editMachineAttachment(id: $id, description: $description)
  }
`;

export const CREATE_TRANSPORTATION = gql`
  mutation (
    $machineNumber: String!
    $model: String!
    $type: String!
    $department: String!
    $location: String!
    $engine: String!
    $measurement: String!
    $transportType: String!
    $currentMileage: Int!
    $lastServiceMileage: Int!
    $registeredDate: Date!
  ) {
    createTransportation(
      machineNumber: $machineNumber
      model: $model
      type: $type
      department: $department
      location: $location
      engine: $engine
      measurement: $measurement
      transportType: $transportType
      currentMileage: $currentMileage
      lastServiceMileage: $lastServiceMileage
      registeredDate: $registeredDate
    )
  }
`;

export const EDIT_TRANSPORTATION = gql`
  mutation (
    $id: Int!
    $machineNumber: String!
    $model: String!
    $type: String!
    $department: String!
    $location: String!
    $engine: String!
    $measurement: String!
    $transportType: String!
    $currentMileage: Int!
    $lastServiceMileage: Int!
    $registeredDate: Date!
  ) {
    editTransportation(
      id: $id
      machineNumber: $machineNumber
      model: $model
      type: $type
      department: $department
      location: $location
      engine: $engine
      measurement: $measurement
      transportType: $transportType
      currentMileage: $currentMileage
      lastServiceMileage: $lastServiceMileage
      registeredDate: $registeredDate
    )
  }
`;

export const DELETE_TRANSPORTATION = gql`
  mutation ($transportationId: Int!) {
    removeTransportation(transportationId: $transportationId)
  }
`;

export const SET_TRANSPORTATION_STATUS = gql`
  mutation ($transportationId: Int!, $status: TransportationStatus!) {
    setTransportationStatus(
      transportationId: $transportationId
      status: $status
    )
  }
`;

export const ADD_TRANSPORTATION_CHECKLIST_ITEM = gql`
  mutation ($transportationId: Int!, $description: String!, $type: String!) {
    addTransportationChecklistItem(
      transportationId: $transportationId
      description: $description
      type: $type
    )
  }
`;

export const DELETE_TRANSPORTATION_CHECKLIST_ITEM = gql`
  mutation ($id: Int!) {
    deleteTransportationChecklistItem(id: $id)
  }
`;

export const TOGGLE_TRANSPORTATION_CHECKLIST_ITEM = gql`
  mutation ($id: Int!, $complete: Boolean!) {
    toggleTransportationChecklistItem(id: $id, complete: $complete)
  }
`;

export const ADD_TRANSPORTATION_PERIODIC_MAINTENANCE = gql`
  mutation (
    $transportationId: Int!
    $title: String!
    $description: String!
    $period: Int!
    $notificationReminder: Int!
  ) {
    addTransportationPeriodicMaintenance(
      transportationId: $transportationId
      title: $title
      description: $description
      period: $period
      notificationReminder: $notificationReminder
    )
  }
`;

export const SET_TRANSPORTATION_PERIODIC_MAINTENANCE_STATUS = gql`
  mutation ($id: Int!, $status: PeriodicMaintenanceStatus!) {
    setTransportationPeriodicMaintenanceStatus(id: $id, status: $status)
  }
`;

export const EDIT_TRANSPORTATION_PERIODIC_MAINTENANCE = gql`
  mutation (
    $id: Int!
    $title: String!
    $description: String!
    $period: Int!
    $notificationReminder: Int!
  ) {
    editTransportationPeriodicMaintenance(
      id: $id
      title: $title
      description: $description
      period: $period
      notificationReminder: $notificationReminder
    )
  }
`;

export const DELETE_TRANSPORTATION_PERIODIC_MAINTENANCE = gql`
  mutation ($id: Int!) {
    deleteTransportationPeriodicMaintenance(id: $id)
  }
`;

export const ADD_TRANSPORTATION_SPARE_PR = gql`
  mutation (
    $transportationId: Int!
    $title: String!
    $description: String!
    $requestedDate: Date!
  ) {
    addTransportationSparePR(
      transportationId: $transportationId
      title: $title
      description: $description
      requestedDate: $requestedDate
    )
  }
`;

export const EDIT_TRANSPORTATION_SPARE_PR = gql`
  mutation (
    $id: Int!
    $title: String!
    $description: String!
    $requestedDate: Date!
  ) {
    editTransportationSparePR(
      id: $id
      title: $title
      description: $description
      requestedDate: $requestedDate
    )
  }
`;

export const DELETE_TRANSPORTATION_SPARE_PR = gql`
  mutation ($id: Int!) {
    deleteTransportationSparePR(id: $id)
  }
`;

export const SET_TRANSPORTATION_SPARE_PR_STATUS = gql`
  mutation ($id: Int!, $status: SparePRStatus!) {
    setTransportationSparePRStatus(id: $id, status: $status)
  }
`;

export const ADD_TRANSPORTATION_REPAIR = gql`
  mutation ($transportationId: Int!, $title: String!, $description: String!) {
    addTransportationRepair(
      transportationId: $transportationId
      title: $title
      description: $description
    )
  }
`;

export const EDIT_TRANSPORTATION_REPAIR = gql`
  mutation ($id: Int!, $title: String!, $description: String!) {
    editTransportationRepair(id: $id, title: $title, description: $description)
  }
`;

export const DELETE_TRANSPORTATION_REPAIR = gql`
  mutation ($id: Int!) {
    deleteTransportationRepair(id: $id)
  }
`;

export const SET_TRANSPORTATION_REPAIR_STATUS = gql`
  mutation ($id: Int!, $status: RepairStatus!) {
    setTransportationRepairStatus(id: $id, status: $status)
  }
`;

export const ADD_TRANSPORTATION_BREAKDOWN = gql`
  mutation ($transportationId: Int!, $title: String!, $description: String!) {
    addTransportationBreakdown(
      transportationId: $transportationId
      title: $title
      description: $description
    )
  }
`;

export const EDIT_TRANSPORTATION_BREAKDOWN = gql`
  mutation ($id: Int!, $title: String!, $description: String!) {
    editTransportationBreakdown(
      id: $id
      title: $title
      description: $description
    )
  }
`;

export const DELETE_TRANSPORTATION_BREAKDOWN = gql`
  mutation ($id: Int!) {
    deleteTransportationBreakdown(id: $id)
  }
`;

export const SET_TRANSPORTATION_BREAKDOWN_STATUS = gql`
  mutation ($id: Int!, $status: BreakdownStatus!) {
    setTransportationBreakdownStatus(id: $id, status: $status)
  }
`;

export const EDIT_TRANSPORTATION_ATTACHMENT = gql`
  mutation ($id: Int!, $description: String!) {
    editTransportationAttachment(id: $id, description: $description)
  }
`;

export const DELETE_TRANSPORTATION_ATTACHMENT = gql`
  mutation ($id: Int!) {
    removeTransportationAttachment(id: $id)
  }
`;

export const ADD_ROLE = gql`
  mutation ($name: String!) {
    addRole(name: $name)
  }
`;

export const EDIT_ROLE = gql`
  mutation ($id: Int!, $name: String!) {
    editRole(id: $id, name: $name)
  }
`;

export const DELETE_ROLE = gql`
  mutation ($id: Int!) {
    removeRole(id: $id)
  }
`;

export const ASSIGN_PERMISSION = gql`
  mutation ($roleId: Int!, $permissions: [Permission!]!) {
    assignPermission(roleId: $roleId, permissions: $permissions)
  }
`;

export const ADD_USER_ROLE = gql`
  mutation ($userId: Int!, $roles: [Int!]!) {
    addUserRole(userId: $userId, roles: $roles)
  }
`;

export const REMOVE_USER_ROLE = gql`
  mutation ($userId: Int!, $roleId: Int!) {
    removeUserRole(userId: $userId, roleId: $roleId)
  }
`;

export const ADD_APP_USER = gql`
  mutation addAppUser($userId: String!, $roles: [Int!]!) {
    addAppUser(userId: $userId, roles: $roles)
  }
`;