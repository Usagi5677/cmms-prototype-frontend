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