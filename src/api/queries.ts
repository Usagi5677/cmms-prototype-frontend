import { gql } from "@apollo/client";
import { MACHINE_FRAGMENT, USER_FRAGMENT } from "./fragments";

export const ME_QUERY = gql`
  query {
    me {
      id
      rcno
      fullName
      email
      userId
    }
  }
`;

export const ALL_MACHINES = gql`
  ${MACHINE_FRAGMENT}
  query getAllMachine(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $createdByUserId: String
  ) {
    getAllMachine(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      createdByUserId: $createdByUserId
    ) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
        count
      }
      edges {
        node {
          ...MachineFields
        }
      }
    }
  }
`;

export const GETSINGLEMACHINE = gql`
  ${MACHINE_FRAGMENT}
  ${USER_FRAGMENT}
  query getSingleMachine($machineId: Int!) {
    getSingleMachine(machineId: $machineId) {
      ...MachineFields
      repairs {
        id
        title
        description
      }
      checklistItems {
        id
        description
        type
        completedAt
        completedBy {
          ...UserFields
        }
      }
    }
  }
`;

export const GET_ALL_PERIODIC_MAINTENANCE_OF_MACHINE = gql`
  ${USER_FRAGMENT}
  query getAllPeriodicMaintenanceOfMachine(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $machineId: Int!
  ) {
    getAllPeriodicMaintenanceOfMachine(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      machineId: $machineId
    ) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
        count
      }
      edges {
        node {
          id
          machineId
          title
          description
          period
          notificationReminder
          status
          completedAt
          completedBy {
            ...UserFields
          }
        }
      }
    }
  }
`;


export const GET_ALL_SPARE_PR_OF_MACHINE = gql`
  ${USER_FRAGMENT}
  query getAllSparePROfMachine(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $machineId: Int!
  ) {
    getAllSparePROfMachine(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      machineId: $machineId
    ) {
      pageInfo {
        endCursor
        hasNextPage
        hasPreviousPage
        startCursor
        count
      }
      edges {
        node {
          id
          machineId
          title
          description
          requestedDate
          status
          completedAt
          completedBy {
            ...UserFields
          }
        }
      }
    }
  }
`;