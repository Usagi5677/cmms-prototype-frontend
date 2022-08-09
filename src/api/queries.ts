import { gql } from "@apollo/client";
import {
  APS_USER_FRAGMENT,
  CHECKLIST_TEMPLATE_FRAGMENT,
  MACHINE_FRAGMENT,
  TRANSPORTATION_FRAGMENT,
  ENTITY_FRAGMENT,
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
      location
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
    $location: [String!]
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
    $location: [String!]
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
    $location: [String!]
    $department: [String!]
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
      department: $department
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
    $location: [String!]
    $department: [String!]
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
      department: $department
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
  query getSingleTransportation($transportationId: Int!) {
    getSingleTransportation(transportationId: $transportationId) {
      ...TransportationFields
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
    $location: [String!]
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
          location
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
    $location: [String!]
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
          type {
            id
            name
          }
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
    $location: [String!]
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
          type {
            id
            name
          }
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

export const GET_ALL_MACHINE_PERIODIC_MAINTENANCE = gql`
  query getAllMachinePeriodicMaintenance(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $status: PeriodicMaintenanceStatus
    $location: [String!]
  ) {
    getAllMachinePeriodicMaintenance(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
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
          id
          machineId
          title
          measurement
          value
          startDate
          status
          completedAt
          createdAt
          machine {
            id
            machineNumber
            model
            type {
              id
              name
            }
            zone
            location
          }
        }
      }
    }
  }
`;

export const GET_ALL_TRANSPORTATION_PERIODIC_MAINTENANCE = gql`
  query getAllTransportationPeriodicMaintenance(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $status: PeriodicMaintenanceStatus
    $location: [String!]
  ) {
    getAllTransportationPeriodicMaintenance(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
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
          id
          transportationId
          title
          measurement
          value
          startDate
          status
          completedAt
          createdAt
          transportation {
            id
            machineNumber
            model
            type {
              id
              name
            }
            location
          }
        }
      }
    }
  }
`;

export const GET_ALL_MACHINE_PM_TASK = gql`
  ${APS_USER_FRAGMENT}
  query getAllMachinePeriodicMaintenanceTask(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $complete: Boolean
    $location: [String!]
    $status: PeriodicMaintenanceStatus
    $assignedToId: Int
  ) {
    getAllMachinePeriodicMaintenanceTask(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      complete: $complete
      location: $location
      status: $status
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
          id
          periodicMaintenanceId
          name
          parentTaskId
          completedAt
          periodicMaintenance {
            status
            machine {
              id
              location
              zone
              machineNumber
              assignees {
                user {
                  ...UserFieldsAPS
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_TRANSPORTATION_PM_TASK = gql`
  ${APS_USER_FRAGMENT}
  query getAllTransportationPeriodicMaintenanceTask(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $complete: Boolean
    $location: [String!]
    $status: PeriodicMaintenanceStatus
    $assignedToId: Int
  ) {
    getAllTransportationPeriodicMaintenanceTask(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      complete: $complete
      location: $location
      status: $status
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
          id
          periodicMaintenanceId
          name
          parentTaskId
          completedAt
          periodicMaintenance {
            status
            transportation {
              id
              location
              machineNumber
              assignees {
                user {
                  ...UserFieldsAPS
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_MACHINE_PM_TASK_STATUS_COUNT = gql`
  query allMachinePMTaskStatusCount($assignedToId: Int) {
    allMachinePMTaskStatusCount(assignedToId: $assignedToId) {
      pending
      done
    }
  }
`;

export const GET_ALL_TRANSPORTATION_PM_TASK_STATUS_COUNT = gql`
  query allTransportationPMTaskStatusCount($assignedToId: Int) {
    allTransportationPMTaskStatusCount(assignedToId: $assignedToId) {
      pending
      done
    }
  }
`;

export const GET_ALL_MACHINE_PM_STATUS_COUNT = gql`
  query allMachinePMStatusCount {
    allMachinePMStatusCount {
      missed
      pending
      done
    }
  }
`;

export const GET_ALL_TRANSPORTATION_PM_STATUS_COUNT = gql`
  query allTransportationPMStatusCount {
    allTransportationPMStatusCount {
      missed
      pending
      done
    }
  }
`;

export const CHECKLIST_TEMPLATES = gql`
  query checklistTemplates(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $type: String
  ) {
    checklistTemplates(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      type: $type
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
          type
        }
      }
    }
  }
`;

export const CHECKLIST_TEMPLATE_DETAILS = gql`
  ${CHECKLIST_TEMPLATE_FRAGMENT}
  query checklistTemplate($id: Int!) {
    checklistTemplate(id: $id) {
      ...ChecklistTemplateFields
    }
  }
`;

export const ENTITY_CHECKLIST_TEMPLATE = gql`
  ${CHECKLIST_TEMPLATE_FRAGMENT}
  query entityChecklistTemplate($input: EntityChecklistTemplateInput!) {
    entityChecklistTemplate(input: $input) {
      ...ChecklistTemplateFields
    }
  }
`;

export const GET_CHECKLIST = gql`
  ${APS_USER_FRAGMENT}
  query checklist($input: ChecklistInput!) {
    checklist(input: $input) {
      id
      workingHour
      currentMeterReading
      to
      attachments {
        id
        entityId
        createdAt
        mimeType
        originalName
        description
        mode
        createdAt
        user {
          ...UserFieldsAPS
        }
      }
      items {
        id
        description
        completedBy {
          id
          rcno
          fullName
        }
        completedAt
        issues {
          id
          description
          createdAt
          user {
            id
            rcno
            fullName
          }
        }
      }
      comments {
        id
        description
        createdAt
        user {
          id
          rcno
          fullName
        }
      }
    }
  }
`;

export const GET_ALL_MACHINE_AND_TRANSPORTATION_STATUS_COUNT = gql`
  query allMachineAndTransportStatusCount($isAssigned: Boolean) {
    allMachineAndTransportStatusCount(isAssigned: $isAssigned) {
      machineWorking
      machineIdle
      machineBreakdown
      machineDispose
      transportationWorking
      transportationIdle
      transportationBreakdown
      transportationDispose
    }
  }
`;

export const GET_ALL_ENTITY_STATUS_COUNT = gql`
  query allEntityStatusCount($isAssigned: Boolean, $entityType: String) {
    allEntityStatusCount(isAssigned: $isAssigned, entityType: $entityType) {
      working
      idle
      breakdown
      dispose
    }
  }
`;

export const GET_ROLE_WITH_PERMISSION = gql`
  ${APS_USER_FRAGMENT}
  query getRoleWithPermission($roleId: Int!) {
    getRoleWithPermission(roleId: $roleId) {
      id
      name
      createdAt
      permissionRoles {
        roleId
        permission
      }
      createdBy {
        ...UserFieldsAPS
      }
    }
  }
`;
export const CHECKLIST_SUMMARIES = gql`
  query checklistSummary($input: ChecklistSummaryInput!) {
    checklistSummary(input: $input) {
      id
      from
      to
      type
      hasComments
      workingHour
      currentMeterReading
      itemCompletion
      hasIssues
    }
  }
`;

export const GET_ALL_ASSIGNED_MACHINES = gql`
  ${MACHINE_FRAGMENT}
  query getAllAssignedMachine(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $assignedToId: Int
    $status: MachineStatus
    $location: [String!]
    $isAssigned: Boolean
  ) {
    getAllAssignedMachine(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      assignedToId: $assignedToId
      status: $status
      location: $location
      isAssigned: $isAssigned
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

export const GET_ALL_ASSIGNED_TRANSPORTATION = gql`
  ${TRANSPORTATION_FRAGMENT}
  query getAllAssignedTransportation(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $assignedToId: Int
    $status: TransportationStatus
    $location: [String!]
    $isAssigned: Boolean
  ) {
    getAllAssignedTransportation(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      assignedToId: $assignedToId
      status: $status
      location: $location
      isAssigned: $isAssigned
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

export const SEARCH_ENTITY = gql`
  ${ENTITY_FRAGMENT}
  query searchEntity($query: String!, $limit: Int) {
    searchEntity(query: $query, limit: $limit) {
      ...EntityFields
    }
  }
`;

export const TYPES = gql`
  query types(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $name: String
    $entityType: String
  ) {
    types(
      after: $after
      before: $before
      first: $first
      last: $last
      name: $name
      entityType: $entityType
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
          entityType
        }
      }
    }
  }
`;

export const ALL_ENTITY = gql`
  ${ENTITY_FRAGMENT}
  query getAllEntity(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $createdByUserId: String
    $entityType: String
    $assignedToId: Int
    $status: EntityStatus
    $location: [String!]
    $department: [String!]
  ) {
    getAllEntity(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      createdByUserId: $createdByUserId
      entityType: $entityType
      assignedToId: $assignedToId
      status: $status
      location: $location
      department: $department
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
          ...EntityFields
        }
      }
    }
  }
`;

export const GET_SINGLE_ENTITY = gql`
  ${ENTITY_FRAGMENT}
  query getSingleEntity($entityId: Int!) {
    getSingleEntity(entityId: $entityId) {
      ...EntityFields
    }
  }
`;

export const GET_ALL_PERIODIC_MAINTENANCE_OF_ENTITY = gql`
  ${APS_USER_FRAGMENT}
  query getAllPeriodicMaintenanceOfEntity(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $entityId: Int!
  ) {
    getAllPeriodicMaintenanceOfEntity(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      entityId: $entityId
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
          entityId
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
          entityPeriodicMaintenanceTask {
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

export const GET_ALL_SPARE_PR_OF_ENTITY = gql`
  ${APS_USER_FRAGMENT}
  query getAllSparePROfEntity(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $entityId: Int!
  ) {
    getAllSparePROfEntity(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      entityId: $entityId
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
          entityId
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

export const GET_ALL_REPAIR_OF_ENTITY = gql`
  ${APS_USER_FRAGMENT}
  query getAllRepairRequestOfEntity(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $entityId: Int!
  ) {
    getAllRepairRequestOfEntity(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      entityId: $entityId
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
          entityId
          internal
          projectName
          location
          reason
          additionalInfo
          attendInfo
          operatorId
          supervisorId
          projectManagerId
          repairedById
          approvedAt
          repairedAt
          requestedBy {
            ...UserFieldsAPS
          }
          operator {
            ...UserFieldsAPS
          }
          supervisor {
            ...UserFieldsAPS
          }
          projectManager {
            ...UserFieldsAPS
          }
          approvedBy {
            ...UserFieldsAPS
          }
          repairedBy {
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const GET_ALL_BREAKDOWN_OF_ENTITY = gql`
  ${APS_USER_FRAGMENT}
  query getAllBreakdownOfEntity(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $entityId: Int!
  ) {
    getAllBreakdownOfEntity(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      entityId: $entityId
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
          entityId
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

export const GET_ALL_HISTORY_OF_ENTITY = gql`
  ${APS_USER_FRAGMENT}
  query getAllHistoryOfEntity(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $location: [String!]
    $from: Date
    $to: Date
    $entityId: Int!
  ) {
    getAllHistoryOfEntity(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      location: $location
      from: $from
      to: $to
      entityId: $entityId
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
          entityId
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

export const GET_ALL_ATTACHMENT_OF_ENTITY = gql`
  ${APS_USER_FRAGMENT}
  query entityAttachments(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $entityId: Int!
  ) {
    entityAttachments(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      entityId: $entityId
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
          entityId
          createdAt
          mimeType
          originalName
          description
          mode
          createdAt
          user {
            ...UserFieldsAPS
          }
        }
      }
    }
  }
`;

export const GET_BREAKDOWN_ENTITY_COUNT = gql`
  query breakdownCount {
    breakdownCount {
      count
    }
  }
`;

export const GET_USAGE_HISTORY_OF_ENTITY = gql`
  query singleEntityUsageHistory($entityId: Int!, $from: Date!, $to: Date!) {
    singleEntityUsageHistory(entityId: $entityId, from: $from, to: $to) {
      date
      workingHour
      idleHour
      breakdownHour
    }
  }
`;

export const GET_ENTITY_LATEST_ATTACHMENT = gql`
  query getEntityLatestAttachment($entityId: Int!) {
    getEntityLatestAttachment(entityId: $entityId) {
      id
      createdAt
      mimeType
      originalName
      description
      mode
    }
  }
`;

export const ALL_ENTITY_UTILIZATION = gql`
  ${APS_USER_FRAGMENT}
  query getAllEntityUtilization(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $location: [String!]
  ) {
    getAllEntityUtilization(
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
          zone
          location
          isDeleted
          deletedAt
          histories {
            id
            createdAt
            entityId
            type
            description
            completedBy {
              ...UserFieldsAPS
            }
            entityStatus
            entityType
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
export const GET_ALL_ENTITY_PERIODIC_MAINTENANCE = gql`
  query getAllEntityPeriodicMaintenance(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $status: PeriodicMaintenanceStatus
    $location: [String!]
  ) {
    getAllEntityPeriodicMaintenance(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
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
          id
          entityId
          title
          measurement
          value
          startDate
          status
          completedAt
          createdAt
          entity {
            id
            machineNumber
            model
            zone
            location
          }
        }
      }
    }
  }
`;
export const GET_ALL_ENTITY_PM_TASK = gql`
  ${APS_USER_FRAGMENT}
  query getAllEntityPeriodicMaintenanceTask(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $complete: Boolean
    $location: [String!]
    $status: PeriodicMaintenanceStatus
    $assignedToId: Int
  ) {
    getAllEntityPeriodicMaintenanceTask(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      complete: $complete
      location: $location
      status: $status
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
          id
          periodicMaintenanceId
          name
          parentTaskId
          completedAt
          periodicMaintenance {
            status
            entity {
              id
              location
              machineNumber
              assignees {
                user {
                  ...UserFieldsAPS
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_ALL_ENTITY_PM_TASK_STATUS_COUNT = gql`
  query allEntityPMTaskStatusCount($assignedToId: Int) {
    allEntityPMTaskStatusCount(assignedToId: $assignedToId) {
      pending
      done
    }
  }
`;
export const GET_ALL_ENTITY_PM_STATUS_COUNT = gql`
  query allEntityPMStatusCount {
    allEntityPMStatusCount {
      missed
      pending
      done
    }
  }
`;
export const GET_ALL_ASSIGNED_ENTITY = gql`
  ${ENTITY_FRAGMENT}
  query getAllAssignedEntity(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $assignedToId: Int
    $status: EntityStatus
    $location: [String!]
    $isAssigned: Boolean
  ) {
    getAllAssignedEntity(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      assignedToId: $assignedToId
      status: $status
      location: $location
      isAssigned: $isAssigned
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
          ...EntityFields
        }
      }
    }
  }
`;

export const GET_ALL_ENTITY_USAGE_HISTORY = gql`
  query allEntityUsageHistory($from: Date!, $to: Date!) {
    allEntityUsageHistory(from: $from, to: $to) {
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
