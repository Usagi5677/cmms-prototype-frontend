import { gql } from "@apollo/client";
import {
  APS_USER_FRAGMENT,
  CHECKLIST_TEMPLATE_FRAGMENT,
  ENTITY_FRAGMENT,
  SUB_ENTITY_FRAGMENT,
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
      entityAssignment {
        entity {
          type {
            entityType
          }
        }
        type
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
    $locationIds: [Int!]
    $divisionIds: [Int!]
  ) {
    getAllUsers(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      locationIds: $locationIds
      divisionIds: $divisionIds
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
  query getUsersWithPermission($permissions: [String!]!, $search: String) {
    getUsersWithPermission(permissions: $permissions, search: $search) {
      ...UserFieldsAPS
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
export const ALL_PERIODIC_MAINTENANCE = gql`
  ${APS_USER_FRAGMENT}
  query periodicMaintenances(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $type: String
    $from: Date
    $to: Date
    $entityId: Int
  ) {
    periodicMaintenances(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      type: $type
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
          createdAt
          entityId
          name
          from
          to
          measurement
          value
          currentMeterReading
          recur
          type
          status
          verifiedAt
          verifiedBy {
            ...UserFieldsAPS
          }
          notificationReminder {
            id
            type
            measurement
            previousValue
            value
            periodicMaintenanceId
            originId
          }
          comments {
            createdAt
            id
            type
            description
            createdBy {
              ...UserFieldsAPS
            }
          }
          tasks {
            id
            periodicMaintenanceId
            parentTaskId
            name
            completedBy {
              ...UserFieldsAPS
            }
            remarks {
              createdAt
              id
              type
              description
              createdBy {
                ...UserFieldsAPS
              }
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
              remarks {
                createdAt
                id
                type
                description
                createdBy {
                  ...UserFieldsAPS
                }
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
                remarks {
                  createdAt
                  id
                  type
                  description
                  createdBy {
                    ...UserFieldsAPS
                  }
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

export const ALL_PERIODIC_MAINTENANCE_LIST = gql`
  ${APS_USER_FRAGMENT}
  ${ENTITY_FRAGMENT}
  query getAllPMWithPagination(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $type: String
    $from: Date
    $to: Date
    $entityId: Int
    $type2Ids: [Int!]
    $measurement: [String!]
    $locationIds: [Int!]
    $zoneIds: [Int!]
    $divisionIds: [Int!]
    $gteInterService: String
    $lteInterService: String
    $pmStatus: [String!]
  ) {
    getAllPMWithPagination(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      type: $type
      from: $from
      to: $to
      entityId: $entityId
      type2Ids: $type2Ids
      measurement: $measurement
      locationIds: $locationIds
      zoneIds: $zoneIds
      divisionIds: $divisionIds
      gteInterService: $gteInterService
      lteInterService: $lteInterService
      pmStatus: $pmStatus
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
          createdAt
          entityId
          name
          from
          to
          measurement
          value
          currentMeterReading
          recur
          status
          type
          verifiedAt
          verifiedBy {
            ...UserFieldsAPS
          }
          entity {
            ...EntityFields
          }
        }
      }
    }
  }
`;

export const ALL_PERIODIC_MAINTENANCE_STATUS_COUNT = gql`
  query allPMStatusCount(
    $search: String
    $type: String
    $from: Date
    $to: Date
    $entityId: Int
    $type2Ids: [Int!]
    $measurement: [String!]
    $locationIds: [Int!]
    $zoneIds: [Int!]
    $divisionIds: [Int!]
    $gteInterService: String
    $lteInterService: String
    $pmStatus: [String!]
  ) {
    allPMStatusCount(
      search: $search
      type: $type
      from: $from
      to: $to
      entityId: $entityId
      type2Ids: $type2Ids
      measurement: $measurement
      locationIds: $locationIds
      zoneIds: $zoneIds
      divisionIds: $divisionIds
      gteInterService: $gteInterService
      lteInterService: $lteInterService
      pmStatus: $pmStatus
    ) {
      completed
      ongoing
      upcoming
      overdue
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
      dailyUsageHours
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

export const GET_ALL_ENTITY_STATUS_COUNT = gql`
  query allEntityStatusCount(
    $search: String
    $createdByUserId: String
    $entityType: [String!]
    $status: [String!]
    $locationIds: [Int!]
    $divisionIds: [Int!]
    $typeIds: [Int!]
    $zoneIds: [Int!]
    $brand: [String!]
    $measurement: [String!]
    $isAssigned: Boolean
    $assignedToId: Int
    $lteInterService: String
    $gteInterService: String
    $isIncompleteChecklistTask: Boolean
  ) {
    allEntityStatusCount(
      search: $search
      createdByUserId: $createdByUserId
      entityType: $entityType
      status: $status
      locationIds: $locationIds
      divisionIds: $divisionIds
      typeIds: $typeIds
      zoneIds: $zoneIds
      brand: $brand
      measurement: $measurement
      isAssigned: $isAssigned
      assignedToId: $assignedToId
      lteInterService: $lteInterService
      gteInterService: $gteInterService
      isIncompleteChecklistTask: $isIncompleteChecklistTask
    ) {
      working
      critical
      breakdown
      dispose
    }
  }
`;

export const GET_ALL_PERMISSIONS = gql`
  query permissions {
    permissions {
      name
      type
      description
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

export const PERIODIC_MAINTENANCE_SUMMARIES = gql`
  query periodicMaintenanceSummary($entityId: Int!, $from: Date!, $to: Date!) {
    periodicMaintenanceSummary(entityId: $entityId, from: $from, to: $to) {
      id
      from
      to
      type
      currentMeterReading
      hasRemarks
      hasObservations
      hasVerify
      taskCompletion
    }
  }
`;

export const ALL_PERIODIC_MAINTENANCE_SUMMARIES = gql`
  query allPeriodicMaintenanceSummary(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $type: String
    $from: Date
    $to: Date
    $entityId: Int
    $type2Ids: [Int!]
    $measurement: [String!]
    $locationIds: [Int!]
    $zoneIds: [Int!]
    $divisionIds: [Int!]
    $gteInterService: String
    $lteInterService: String
    $pmStatus: [String!]
  ) {
    allPeriodicMaintenanceSummary(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      type: $type
      from: $from
      to: $to
      entityId: $entityId
      type2Ids: $type2Ids
      measurement: $measurement
      locationIds: $locationIds
      zoneIds: $zoneIds
      divisionIds: $divisionIds
      gteInterService: $gteInterService
      lteInterService: $lteInterService
      pmStatus: $pmStatus
    ) {
      id
      from
      to
      type
      entityId
      currentMeterReading
      hasRemarks
      hasObservations
      hasVerify
      taskCompletion
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
      dailyUsageHours
      currentMeterReading
      itemCompletion
      hasIssues
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

export const SEARCH_DIVISION = gql`
  query searchDivision($query: String!, $limit: Int) {
    searchDivision(query: $query, limit: $limit) {
      id
      name
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

export const HULL_TYPES = gql`
  query hullTypes(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $name: String
  ) {
    hullTypes(
      after: $after
      before: $before
      first: $first
      last: $last
      name: $name
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
        }
      }
    }
  }
`;

export const API_KEYS = gql`
  query apiKeys(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
  ) {
    apiKeys(
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
          apiKeyStart
          calls
          active
          expiresAt
          permissions {
            permission
          }
        }
      }
    }
  }
`;

export const LOCATIONS = gql`
  query locations(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $name: String
    $zoneId: Int
    $showOnlyUnzoned: Boolean
    $withSkipFriday: Boolean
  ) {
    locations(
      after: $after
      before: $before
      first: $first
      last: $last
      name: $name
      zoneId: $zoneId
      showOnlyUnzoned: $showOnlyUnzoned
      withSkipFriday: $withSkipFriday
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
          zone {
            id
            name
          }
          skipFriday
        }
      }
    }
  }
`;

export const ZONES = gql`
  query zones(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $name: String
  ) {
    zones(
      after: $after
      before: $before
      first: $first
      last: $last
      name: $name
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
        }
      }
    }
  }
`;

export const DIVISIONS = gql`
  ${APS_USER_FRAGMENT}
  query divisions(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $name: String
  ) {
    divisions(
      after: $after
      before: $before
      first: $first
      last: $last
      name: $name
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
          assignees {
            user {
              ...UserFieldsAPS
            }
          }
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
    $entityType: [String!]
    $status: [String!]
    $locationIds: [Int!]
    $divisionIds: [Int!]
    $typeIds: [Int!]
    $zoneIds: [Int!]
    $brand: [String!]
    $measurement: [String!]
    $isAssigned: Boolean
    $assignedToId: Int
    $lteInterService: String
    $gteInterService: String
    $isIncompleteChecklistTask: Boolean
    $entityIds: [Int!]
    $divisionExist: Boolean
    $locationExist: Boolean
  ) {
    getAllEntity(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      createdByUserId: $createdByUserId
      entityType: $entityType
      status: $status
      locationIds: $locationIds
      divisionIds: $divisionIds
      typeIds: $typeIds
      zoneIds: $zoneIds
      brand: $brand
      measurement: $measurement
      isAssigned: $isAssigned
      assignedToId: $assignedToId
      lteInterService: $lteInterService
      gteInterService: $gteInterService
      isIncompleteChecklistTask: $isIncompleteChecklistTask
      entityIds: $entityIds
      divisionExist: $divisionExist
      locationExist: $locationExist
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
export const ALL_TEMPLATE_OF_ORIGIN_PM = gql`
  query getAllTemplatesOfOriginPM($id: Int!) {
    getAllTemplatesOfOriginPM(id: $id) {
      id
      originId
      entityId
      entity {
        id
        machineNumber
        type {
          entityType
        }
        location {
          id
          name
          zone {
            name
          }
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

export const SPARE_PRS = gql`
  ${APS_USER_FRAGMENT}
  query sparePRs(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $entityId: Int
  ) {
    sparePRs(
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
          name
          requestedDate
          createdAt
          completedAt
          createdBy {
            ...UserFieldsAPS
          }
          sparePRDetails {
            id
            description
            createdBy {
              ...UserFieldsAPS
            }
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
    $complete: Boolean
    $approve: Boolean
  ) {
    getAllRepairRequestOfEntity(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      entityId: $entityId
      complete: $complete
      approve: $approve
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

export const BREAKDOWNS = gql`
  ${APS_USER_FRAGMENT}
  query breakdowns(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $entityId: Int
  ) {
    breakdowns(
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
          type
          createdAt
          estimatedDateOfRepair
          completedAt
          createdBy {
            ...UserFieldsAPS
          }
          comments {
            id
            type
            description
            createdBy {
              ...UserFieldsAPS
            }
          }
          details {
            id
            description
            createdBy {
              ...UserFieldsAPS
            }
            repairs {
              id
            }
            comments {
              id
              type
              description
              createdBy {
                ...UserFieldsAPS
              }
            }
          }
          repairs {
            id
            name
            createdBy {
              ...UserFieldsAPS
            }
            breakdownDetail {
              id
              description
            }
            comments {
              id
              type
              description
              createdBy {
                ...UserFieldsAPS
              }
            }
          }
        }
      }
    }
  }
`;

export const REPAIRS = gql`
  ${APS_USER_FRAGMENT}
  query repairs(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $entityId: Int
  ) {
    repairs(
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
          name
          createdAt
          createdBy {
            ...UserFieldsAPS
          }
          breakdown {
            id
            type
            createdBy {
              ...UserFieldsAPS
            }
            details {
              id
              description
            }
          }
          comments {
            id
            type
            description
            createdBy {
              ...UserFieldsAPS
            }
          }
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
    $locationIds: [Int!]
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
      locationIds: $locationIds
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
          location {
            id
            name
          }
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
    $from: Date
    $to: Date
  ) {
    entityAttachments(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      entityId: $entityId
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
          entityId
          createdAt
          mimeType
          originalName
          description
          mode
          createdAt
          favourite
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
      na
    }
  }
`;

export const GET_LATEST_FAVOURITE_ATTACHMENT = gql`
  query getLatestFavouriteAttachment($entityId: Int!) {
    getLatestFavouriteAttachment(entityId: $entityId) {
      id
      createdAt
      mimeType
      originalName
      description
      mode
    }
  }
`;

export const GET_ALL_ENTITY_PERIODIC_MAINTENANCE = gql`
  ${APS_USER_FRAGMENT}
  query getAllEntityPeriodicMaintenance(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $locationIds: [Int!]
  ) {
    getAllEntityPeriodicMaintenance(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      locationIds: $locationIds
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
          createdAt
          entityId
          name
          from
          to
          measurement
          value
          previousMeterReading
          currentMeterReading
          type
          verifiedAt
          verifiedBy {
            ...UserFieldsAPS
          }
          notificationReminder {
            id
            type
            measurement
            previousValue
            value
            periodicMaintenanceId
            originId
          }
          comments {
            createdAt
            id
            type
            description
            createdBy {
              ...UserFieldsAPS
            }
          }
          tasks {
            id
            periodicMaintenanceId
            parentTaskId
            name
            completedBy {
              ...UserFieldsAPS
            }
            remarks {
              createdAt
              id
              type
              description
              createdBy {
                ...UserFieldsAPS
              }
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
              remarks {
                createdAt
                id
                type
                description
                createdBy {
                  ...UserFieldsAPS
                }
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
                remarks {
                  createdAt
                  id
                  type
                  description
                  createdBy {
                    ...UserFieldsAPS
                  }
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
export const GET_ALL_ENTITY_PM_TASK = gql`
  ${APS_USER_FRAGMENT}
  query getAllEntityPeriodicMaintenanceTask(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $search: String
    $complete: Boolean
    $locationIds: [Int!]
    $zoneIds: [Int!]
    $assignedToId: Int
  ) {
    getAllEntityPeriodicMaintenanceTask(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      complete: $complete
      locationIds: $locationIds
      zoneIds: $zoneIds
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
            entity {
              id
              location {
                id
                name
              }
              machineNumber
              type {
                name
                entityType
              }
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
  query allEntityPMTaskStatusCount(
    $search: String
    $locationIds: [Int!]
    $zoneIds: [Int!]
    $assignedToId: Int
  ) {
    allEntityPMTaskStatusCount(
      search: $search
      locationIds: $locationIds
      zoneIds: $zoneIds
      assignedToId: $assignedToId
    ) {
      ongoing
      complete
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
    $status: [String!]
    $locationIds: [Int!]
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
      locationIds: $locationIds
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
  query allEntityUsageHistory(
    $from: Date!
    $to: Date!
    $search: String
    $locationIds: [Int!]
    $zoneIds: [Int!]
    $typeIds: [Int!]
    $measurement: [String!]
  ) {
    allEntityUsageHistory(
      from: $from
      to: $to
      search: $search
      locationIds: $locationIds
      zoneIds: $zoneIds
      typeIds: $typeIds
      measurement: $measurement
    ) {
      workingHour
      idleHour
      breakdownHour
      na
      total
      id
      totalHour
      workingPercentage
      idlePercentage
      breakdownPercentage
      machineNumber
    }
  }
`;

export const GET_ALL_GROUPED_ENTITY_USAGE = gql`
  query getAllGroupedEntityUsage(
    $from: Date!
    $to: Date!
    $search: String
    $locationIds: [Int!]
    $zoneIds: [Int!]
    $typeIds: [Int!]
    $measurement: [String!]
    $entityTypes: [String!]
  ) {
    getAllGroupedEntityUsage(
      from: $from
      to: $to
      search: $search
      locationIds: $locationIds
      zoneIds: $zoneIds
      typeIds: $typeIds
      measurement: $measurement
      entityTypes: $entityTypes
    ) {
      typeId
      name
      workingHour
      idleHour
      breakdownHour
      na
      total
      count
    }
  }
`;

export const GET_ALL_GROUPED_LOCATION_INCOMPLETE_TASKS = gql`
  query getAllGroupedLocationIncompleteTasks(
    $from: Date!
    $to: Date!
    $search: String
    $divisionIds: [Int!]
    $locationIds: [Int!]
    $zoneIds: [Int!]
    $typeIds: [Int!]
    $measurement: [String!]
    $entityType: [String!]
  ) {
    getAllGroupedLocationIncompleteTasks(
      from: $from
      to: $to
      search: $search
      divisionIds: $divisionIds
      locationIds: $locationIds
      zoneIds: $zoneIds
      typeIds: $typeIds
      measurement: $measurement
      entityType: $entityType
    ) {
      locationId
      name
      completeTask
      incompleteTask
      count
      total
    }
  }
`;

export const GET_ALL_GROUPED_TYPE_REPAIR_STATS = gql`
  query getAllGroupedTypeRepairStats(
    $from: Date!
    $to: Date!
    $search: String
    $divisionIds: [Int!]
    $locationIds: [Int!]
    $zoneIds: [Int!]
    $typeIds: [Int!]
    $measurement: [String!]
    $entityType: [String!]
  ) {
    getAllGroupedTypeRepairStats(
      from: $from
      to: $to
      search: $search
      divisionIds: $divisionIds
      locationIds: $locationIds
      zoneIds: $zoneIds
      typeIds: $typeIds
      measurement: $measurement
      entityType: $entityType
    ) {
      typeId
      name
      averageTimeOfRepair
      mean
      count
      total
    }
  }
`;

export const ALL_ENTITY_WITHOUT_PAGINATION = gql`
  ${ENTITY_FRAGMENT}
  query getAllEntityWithoutPagination(
    $search: String
    $locationIds: [Int!]
    $typeIds: [Int!]
    $zoneIds: [Int!]
  ) {
    getAllEntityWithoutPagination(
      search: $search
      locationIds: $locationIds
      typeIds: $typeIds
      zoneIds: $zoneIds
    ) {
      ...EntityFields
    }
  }
`;

export const GET_BREAKDOWN_COUNT_OF_ALL = gql`
  query allEntityBreakdownCount {
    allEntityBreakdownCount {
      machine
      vehicle
      vessel
    }
  }
`;

export const GET_ALL_CHECKLIST_AND_PM_SUMMARY = gql`
  query getAllEntityChecklistAndPMSummary {
    getAllEntityChecklistAndPMSummary {
      pm
      checklist
      machineTaskComplete
      vehicleTaskComplete
      vesselTaskComplete
      machineChecklistComplete
      vehicleChecklistComplete
      vesselChecklistComplete
    }
  }
`;

export const GET_ALL_PM_SUMMARY = gql`
  query getAllEntityPMSummary {
    getAllEntityPMSummary {
      pm
      checklist
    }
  }
`;

export const INCOMPLETE_CHECKLIST_PAST_TWO = gql`
  query incompleteChecklistsPastTwoDays {
    incompleteChecklistsPastTwoDays
  }
`;

export const INCOMPLETE_CHECKLISTS = gql`
  query incompleteChecklists($input: IncompleteChecklistInput!) {
    incompleteChecklists(input: $input) {
      id
      type
      from
      to
      currentMeterReading
      workingHour
      dailyUsageHours
      items {
        id
        completedAt
      }
      comments {
        id
        type
      }
      entity {
        id
        type {
          id
          name
          entityType
        }
        location {
          id
          name
        }
        machineNumber
      }
    }
  }
`;

export const INCOMPLETE_CHECKLIST_SUMMARY = gql`
  query incompleteChecklistSummary($input: IncompleteChecklistSummaryInput!) {
    incompleteChecklistSummary(input: $input) {
      date
      count
    }
  }
`;

export const CHECKLISTS_WITH_ISSUE_PAST_TWO = gql`
  query checklistsWithIssuePastTwoDays {
    checklistsWithIssuePastTwoDays
  }
`;

export const CHECKLISTS_WITH_ISSUE = gql`
  query checklistsWithIssue($input: IncompleteChecklistInput!) {
    checklistsWithIssue(input: $input) {
      id
      type
      from
      to
      currentMeterReading
      workingHour
      dailyUsageHours
      items {
        id
        completedAt
      }
      comments {
        id
        type
      }
      entity {
        id
        type {
          id
          name
          entityType
        }
        location {
          id
          name
        }
        machineNumber
      }
    }
  }
`;

export const CHECKLIST_WITH_ISSUE_SUMMARY = gql`
  query checklistWithIssueSummary($input: IncompleteChecklistSummaryInput!) {
    checklistWithIssueSummary(input: $input) {
      date
      count
    }
  }
`;

export const ASSIGNMENTS = gql`
  query assignments(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $entityIds: [Int!]!
    $userIds: [Int!]!
    $current: Boolean!
    $type: String
  ) {
    assignments(
      after: $after
      before: $before
      first: $first
      last: $last
      entityIds: $entityIds
      userIds: $userIds
      current: $current
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
          type
          createdAt
          removedAt
          user {
            id
            rcno
            fullName
          }
          entity {
            id
            machineNumber
            location {
              id
              name
            }
          }
        }
      }
    }
  }
`;

export const DIVISION_ASSIGNMENTS = gql`
  query divisionAssignments(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $userIds: [Int!]!
    $current: Boolean!
    $divisionIds: [Int!]
  ) {
    divisionAssignments(
      after: $after
      before: $before
      first: $first
      last: $last
      userIds: $userIds
      current: $current
      divisionIds: $divisionIds
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
          createdAt
          removedAt
          user {
            id
            rcno
            fullName
          }
          division {
            id
            name
          }
        }
      }
    }
  }
`;

export const LOCATION_ASSIGNMENTS = gql`
  query locationAssignments(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $userIds: [Int!]!
    $current: Boolean!
    $locationIds: [Int!]
  ) {
    locationAssignments(
      after: $after
      before: $before
      first: $first
      last: $last
      userIds: $userIds
      current: $current
      locationIds: $locationIds
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
          createdAt
          removedAt
          user {
            id
            rcno
            fullName
          }
          location {
            id
            name
          }
        }
      }
    }
  }
`;

export const CHECK_COPY_PM_EXIST = gql`
  query checkCopyPMExist($id: Int!) {
    checkCopyPMExist(id: $id)
  }
`;
