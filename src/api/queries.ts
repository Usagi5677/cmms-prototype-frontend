import { gql } from "@apollo/client";
import {
  APS_USER_FRAGMENT,
  CHECKLIST_TEMPLATE_FRAGMENT,
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
      location {
        id
        name
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
          location {
            id
            name
          }
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
            user {
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
              user {
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
                user {
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
                  user {
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

export const GET_ALL_ENTITY_STATUS_COUNT = gql`
  query allEntityStatusCount($isAssigned: Boolean, $entityType: String) {
    allEntityStatusCount(isAssigned: $isAssigned, entityType: $entityType) {
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
  ) {
    locations(
      after: $after
      before: $before
      first: $first
      last: $last
      name: $name
      zoneId: $zoneId
      showOnlyUnzoned: $showOnlyUnzoned
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
    $status: [String!]
    $locationIds: [Int!]
    $department: [String!]
    $typeIds: [Int!]
    $zoneIds: [Int!]
    $brand: [String!]
    $engine: [String!]
    $measurement: [String!]
    $isAssigned: Boolean
    $assignedToId: Int
    $lteCurrentRunning: String
    $gteCurrentRunning: String
    $lteLastService: String
    $gteLastService: String
    $isIncompleteChecklistTask: Boolean
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
      department: $department
      typeIds: $typeIds
      zoneIds: $zoneIds
      brand: $brand
      engine: $engine
      measurement: $measurement
      isAssigned: $isAssigned
      assignedToId: $assignedToId
      lteCurrentRunning: $lteCurrentRunning
      gteCurrentRunning: $gteCurrentRunning
      lteLastService: $lteLastService
      gteLastService: $gteLastService
      isIncompleteChecklistTask: $isIncompleteChecklistTask
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
        zone
        location {
          id
          name
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
    $locationIds: [Int!]
  ) {
    getAllEntityUtilization(
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
          machineNumber
          model
          zone
          location {
            id
            name
          }
          type {
            entityType
          }
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
            location {
              id
              name
            }
            type {
              entityType
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
              location {
                id
                name
              }
              machineNumber
              type {
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
