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
    $status: MachineStatus
    $location: String
  ) {
    getAllMachine(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      assignedToId: $assignedToId
      status: $status
      location: $location
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
          measurement
          value
          startDate
          status
          completedAt
          createdAt
          completedBy {
            ...UserFieldsAPS
          }
          verifiedAt
          verifiedBy {
            ...UserFieldsAPS
          }
          machinePeriodicMaintenanceTask {
            id
            periodicMaintenanceId
            parentTaskId
            name
            completedBy {
              ...UserFieldsAPS
            }
            completedAt
            subTasks {
              id
              periodicMaintenanceId
              parentTaskId
              name
              completedBy {
                ...UserFieldsAPS
              }
              completedAt
              subTasks {
                id
                periodicMaintenanceId
                parentTaskId
                name
                completedBy {
                  ...UserFieldsAPS
                }
                completedAt
              }
            }
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
          estimatedDateOfRepair
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
    $location: String
    $from: Date
    $to: Date
  ) {
    getAllHistoryOfMachine(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      machineId: $machineId
      location: $location
      from: $from
      to: $to
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
          location
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

export const ALL_TRANSPORTATION_VESSELS = gql`
  ${TRANSPORTATION_FRAGMENT}
  query getAllTransportationVessels(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $createdByUserId: String
    $transportType: String
    $assignedToId: Int
    $status: TransportationStatus
    $location: String
  ) {
    getAllTransportationVessels(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      createdByUserId: $createdByUserId
      transportType: $transportType
      assignedToId: $assignedToId
      status: $status
      location: $location
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

export const ALL_TRANSPORTATION_VEHICLES = gql`
  ${TRANSPORTATION_FRAGMENT}
  query getAllTransportationVehicles(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $createdByUserId: String
    $transportType: String
    $assignedToId: Int
    $status: TransportationStatus
    $location: String
  ) {
    getAllTransportationVehicles(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      createdByUserId: $createdByUserId
      transportType: $transportType
      assignedToId: $assignedToId
      status: $status
      location: $location
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
          measurement
          value
          startDate
          status
          completedAt
          createdAt
          completedBy {
            ...UserFieldsAPS
          }
          verifiedAt
          verifiedBy {
            ...UserFieldsAPS
          }
          transportationPeriodicMaintenanceTask {
            id
            periodicMaintenanceId
            parentTaskId
            name
            completedBy {
              ...UserFieldsAPS
            }
            completedAt
            subTasks {
              id
              periodicMaintenanceId
              parentTaskId
              name
              completedBy {
                ...UserFieldsAPS
              }
              completedAt
              subTasks {
                id
                periodicMaintenanceId
                parentTaskId
                name
                completedBy {
                  ...UserFieldsAPS
                }
                completedAt
              }
            }
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
          estimatedDateOfRepair
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
    $location: String
    $from: Date
    $to: Date
    $transportationId: Int!
  ) {
    getAllHistoryOfTransportation(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      location: $location
      from: $from
      to: $to
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
          location
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
  query getUsersWithPermission($permissions: [String!]!) {
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

export const GET_BREAKDOWN_MACHINE_COUNT = gql`
  query breakdownMachineCount {
    breakdownMachineCount {
      count
    }
  }
`;

export const GET_BREAKDOWN_VESSEL_COUNT = gql`
  query breakdownVesselCount {
    breakdownVesselCount {
      count
    }
  }
`;

export const GET_BREAKDOWN_VEHICLE_COUNT = gql`
  query breakdownVehicleCount {
    breakdownVehicleCount {
      count
    }
  }
`;

export const NOTIFICATIONS = gql`
  query notifications {
    notifications {
      body
      createdAt
      id
      readAt
      link
      userId
    }
  }
`;

export const GET_USAGE_HISTORY_OF_MACHINE = gql`
  query singleMachineUsageHistory($machineId: Int!, $from: Date!, $to: Date!) {
    singleMachineUsageHistory(machineId: $machineId, from: $from, to: $to) {
      date
      workingHour
      idleHour
      breakdownHour
    }
  }
`;

export const GET_USAGE_HISTORY_OF_TRANSPORTATION = gql`
  query singleTransportationUsageHistory(
    $transportationId: Int!
    $from: Date!
    $to: Date!
  ) {
    singleTransportationUsageHistory(
      transportationId: $transportationId
      from: $from
      to: $to
    ) {
      date
      workingHour
      idleHour
      breakdownHour
    }
  }
`;

export const GET_MACHINE_LATEST_ATTACHMENT = gql`
  query getMachineLatestAttachment($machineId: Int!) {
    getMachineLatestAttachment(machineId: $machineId) {
      id
      createdAt
      mimeType
      originalName
      description
      mode
    }
  }
`;

export const GET_TRANSPORTATION_LATEST_ATTACHMENT = gql`
  query getTransportationLatestAttachment($transportationId: Int!) {
    getTransportationLatestAttachment(transportationId: $transportationId) {
      id
      createdAt
      mimeType
      originalName
      description
      mode
    }
  }
`;

export const ALL_MACHINE_UTILIZATION = gql`
  ${APS_USER_FRAGMENT}
  query getAllMachineUtilization(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $location: String
  ) {
    getAllMachineUtilization(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      location: $location
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
          machineNumber
          model
          type
          zone
          location
          isDeleted
          deletedAt
          histories {
            id
            createdAt
            machineId
            type
            description
            completedBy {
              ...UserFieldsAPS
            }
            machineStatus
            machineType
            breakdownHour
            idleHour
            workingHour
            location
          }
        }
      }
    }
  }
`;

export const GET_ALL_MACHINE_USAGE_HISTORY = gql`
  query allMachineUsageHistory($from: Date!, $to: Date!) {
    allMachineUsageHistory(from: $from, to: $to) {
      date
      workingHour
      idleHour
      breakdownHour
      totalHour
      workingPercentage
      idlePercentage
      breakdownPercentage
    }
  }
`;

export const ALL_TRANSPORTATION_UTILIZATION = gql`
  ${APS_USER_FRAGMENT}
  query getAllTransportationUtilization(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $location: String
  ) {
    getAllTransportationUtilization(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      location: $location
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
          machineNumber
          model
          type
          location
          isDeleted
          deletedAt
          histories {
            id
            createdAt
            transportationId
            type
            description
            completedBy {
              ...UserFieldsAPS
            }
            transportationStatus
            transportationType
            breakdownHour
            idleHour
            workingHour
            location
          }
        }
      }
    }
  }
`;

export const GET_ALL_TRANSPORTATION_USAGE_HISTORY = gql`
  query allTransportationUsageHistory($from: Date!, $to: Date!) {
    allTransportationUsageHistory(from: $from, to: $to) {
      date
      workingHour
      idleHour
      breakdownHour
      totalHour
      workingPercentage
      idlePercentage
      breakdownPercentage
    }
  }
`;
