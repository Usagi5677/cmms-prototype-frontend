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
      entityAssignment {
        entity {
          type {
            entityType
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
    $typeId: Int
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
      typeId: $typeId
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
