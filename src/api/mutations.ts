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