import { gql } from "@apollo/client";
import {
  APS_USER_FRAGMENT,
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
      roles {
        roleId
        role {
          id
          name
          permissionRoles {
            permission
          }
        }
      }
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
    $assignedToId: Int
  ) {
    getAllMachine(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      assignedToId: $assignedToId
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
  ${APS_USER_FRAGMENT}
  query getSingleMachine($machineId: Int!) {
    getSingleMachine(machineId: $machineId) {
      ...MachineFields
      checklistItems {
        id
        description
        type
        completedAt
        completedBy {
          ...UserFieldsAPS
        }
      }
      assignees {
        ...UserFieldsAPS
      }
    }
  }
`;

export const GET_ALL_PERIODIC_MAINTENANCE_OF_MACHINE = gql`
  ${APS_USER_FRAGMENT}
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
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const GET_ALL_SPARE_PR_OF_MACHINE = gql`
  ${APS_USER_FRAGMENT}
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
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const GET_ALL_REPAIR_OF_MACHINE = gql`
  ${APS_USER_FRAGMENT}
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
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const GET_ALL_BREAKDOWN_OF_MACHINE = gql`
  ${APS_USER_FRAGMENT}
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
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const GET_ALL_HISTORY_OF_MACHINE = gql`
  ${APS_USER_FRAGMENT}
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
            ...UserFieldsAPS
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
  ${APS_USER_FRAGMENT}
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
            ...UserFieldsAPS
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
    $assignedToId: Int
  ) {
    getAllTransportation(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      createdByUserId: $createdByUserId
      transportType: $transportType
      assignedToId: $assignedToId
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
  ${APS_USER_FRAGMENT}
  query getSingleTransportation($transportationId: Int!) {
    getSingleTransportation(transportationId: $transportationId) {
      ...TransportationFields
      checklistItems {
        id
        description
        type
        completedAt
        completedBy {
          ...UserFieldsAPS
        }
      }
      assignees {
        ...UserFieldsAPS
      }
    }
  }
`;

export const GET_ALL_PERIODIC_MAINTENANCE_OF_TRANSPORTATION = gql`
  ${APS_USER_FRAGMENT}
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
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const GET_ALL_SPARE_PR_OF_TRANSPORTATION = gql`
  ${APS_USER_FRAGMENT}
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
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const GET_ALL_REPAIR_OF_TRANSPORTATION = gql`
  ${APS_USER_FRAGMENT}
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
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const GET_ALL_BREAKDOWN_OF_TRANSPORTATION = gql`
  ${APS_USER_FRAGMENT}
  query getAllBreakdownOfTransportation(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $transportationId: Int!
  ) {
    getAllBreakdownOfTransportation(
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
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const GET_ALL_HISTORY_OF_TRANSPORTATION = gql`
  ${APS_USER_FRAGMENT}
  query getAllHistoryOfTransportation(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $transportationId: Int!
  ) {
    getAllHistoryOfTransportation(
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
          type
          description
          createdAt
          completedBy {
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const GET_ALL_ATTACHMENT_OF_TRANSPORTATION = gql`
  ${APS_USER_FRAGMENT}
  query transportationAttachments(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $transportationId: Int!
  ) {
    transportationAttachments(
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
          createdAt
          mimeType
          originalName
          description
          mode
          createdAt
          completedBy {
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const GET_ALL_ROLES = gql`
  ${APS_USER_FRAGMENT}
  query getAllRoles(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
  ) {
    getAllRoles(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
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
          name
          permissionRoles {
            permission
          }
          createdAt
          createdBy {
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const SEARCH_APS_QUERY = gql`
  ${APS_USER_FRAGMENT}
  query search($query: String!) {
    searchAPSUsers(query: $query) {
      ...UserFieldsAPS
      roles {
        id
      }
    }
  }
`;

export const GET_ALL_USERS = gql`
  ${APS_USER_FRAGMENT}
  query getAllUsers(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
  ) {
    getAllUsers(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
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
          ...UserFieldsAPS
          roles {
            roleId
            userId
            role {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const GET_ROLES = gql`
  query getRoles {
    getRoles {
      id
      name
    }
  }
`;

export const GET_USERS_WITH_PERMISSION = gql`
  ${APS_USER_FRAGMENT}
  query getUsersWithPermission($permissions: [Permission!]!) {
    getUsersWithPermission(permissions: $permissions) {
      ...UserFieldsAPS
    }
  }
`;

export const GET_MACHINE_REPORT = gql`
  query getMachineReport($from: Date!, $to: Date!) {
    getMachineReport(from: $from, to: $to) {
      type
      working
      breakdown
    }
  }
`;

export const GET_TRANSPORTATION_REPORT = gql`
  query getTransportationReport($from: Date!, $to: Date!) {
    getTransportationReport(from: $from, to: $to) {
      type
      working
      breakdown
    }
  }
`;
