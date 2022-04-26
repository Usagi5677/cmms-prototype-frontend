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

export const SET_MACHINE_PERIODIC_MAINTENANCE = gql`
  mutation ($id: Int!, $status: PeriodicMaintenanceStatus!) {
    setMachinePeriodicMaintenanceStatus(id: $id, status: $status)
  }
`;
