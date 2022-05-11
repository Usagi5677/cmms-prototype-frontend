import { gql } from "@apollo/client";
import {
  MACHINE_FRAGMENT,
  TRANSPORTATION_FRAGMENT,
  USER_FRAGMENT,
} from "./fragments";

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

export const GET_SINGLE_MACHINE = gql`
  ${MACHINE_FRAGMENT}
  ${USER_FRAGMENT}
  query getSingleMachine($machineId: Int!) {
    getSingleMachine(machineId: $machineId) {
      ...MachineFields
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
          createdAt
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
          createdAt
          completedBy {
            ...UserFields
          }
        }
      }
    }
  }
`;

export const GET_ALL_REPAIR_OF_MACHINE = gql`
  ${USER_FRAGMENT}
  query getAllRepairOfMachine(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $machineId: Int!
  ) {
    getAllRepairOfMachine(
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
          createdAt
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

export const GET_ALL_BREAKDOWN_OF_MACHINE = gql`
  ${USER_FRAGMENT}
  query getAllBreakdownOfMachine(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $machineId: Int!
  ) {
    getAllBreakdownOfMachine(
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
          createdAt
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

export const GET_ALL_HISTORY_OF_MACHINE = gql`
  ${USER_FRAGMENT}
  query getAllHistoryOfMachine(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $machineId: Int!
  ) {
    getAllHistoryOfMachine(
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
          type
          description
          createdAt
          completedBy {
            ...UserFields
          }
        }
      }
    }
  }
`;

export const SINGLE_MACHINE_ATTACHMENT = gql`
  query machineAttachment($id: Int!) {
    machineAttachment(id: $id) {
      id
      createdAt
      mimeType
      originalName
      description
      mode
    }
  }
`;

export const GET_ALL_ATTACHMENT_OF_MACHINE = gql`
  ${USER_FRAGMENT}
  query machineAttachments(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $machineId: Int!
  ) {
    machineAttachments(
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
          createdAt
          mimeType
          originalName
          description
          mode
          createdAt
          completedBy {
            ...UserFields
          }
        }
      }
    }
  }
`;

export const ALL_TRANSPORTATION = gql`
  ${TRANSPORTATION_FRAGMENT}
  query getAllTransportation(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $createdByUserId: String
    $transportType: String
  ) {
    getAllTransportation(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      createdByUserId: $createdByUserId
      transportType: $transportType
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
          ...TransportationFields
        }
      }
    }
  }
`;

export const GET_SINGLE_TRANSPORTATION = gql`
  ${TRANSPORTATION_FRAGMENT}
  ${USER_FRAGMENT}
  query getSingleTransportation($transportationId: Int!) {
    getSingleTransportation(transportationId: $transportationId) {
      ...TransportationFields
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

export const GET_ALL_PERIODIC_MAINTENANCE_OF_TRANSPORTATION = gql`
  ${USER_FRAGMENT}
  query getAllPeriodicMaintenanceOfTransportation(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $transportationId: Int!
  ) {
    getAllPeriodicMaintenanceOfTransportation(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      transportationId: $transportationId
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
          transportationId
          title
          description
          period
          notificationReminder
          status
          completedAt
          createdAt
          completedBy {
            ...UserFields
          }
        }
      }
    }
  }
`;

export const GET_ALL_SPARE_PR_OF_TRANSPORTATION = gql`
  ${USER_FRAGMENT}
  query getAllSparePROfTransportation(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $transportationId: Int!
  ) {
    getAllSparePROfTransportation(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      transportationId: $transportationId
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
          transportationId
          title
          description
          requestedDate
          status
          completedAt
          createdAt
          completedBy {
            ...UserFields
          }
        }
      }
    }
  }
`;

export const GET_ALL_REPAIR_OF_TRANSPORTATION = gql`
  ${USER_FRAGMENT}
  query getAllRepairOfTransportation(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $transportationId: Int!
  ) {
    getAllRepairOfTransportation(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      transportationId: $transportationId
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
          transportationId
          title
          description
          createdAt
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
