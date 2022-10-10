import { gql } from "@apollo/client";

export const PAGE_INFO = gql`
  fragment PageInfoField on PageInfo {
    endCursor
    hasNextPage
    hasPreviousPage
    startCursor
    count
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserFields on User {
    id
    rcno
    fullName
    roles
  }
`;

export const APS_USER_FRAGMENT = gql`
  fragment UserFieldsAPS on User {
    id
    userId
    fullName
    rcno
  }
`;
export const SUB_ENTITY_FRAGMENT = gql`
  ${APS_USER_FRAGMENT}
  fragment SubEntityFields on Entity {
    id
    createdAt
    createdBy {
      ...UserFieldsAPS
      email
    }
    machineNumber
    registeredDate
    model
    type {
      id
      name
      entityType
    }
    division {
      id
      name
    }
    engine
    location {
      id
      name
      zone {
        id
        name
      }
    }
    currentRunning
    lastService
    status
    measurement
    brand
    deletedAt
    assignees {
      user {
        ...UserFieldsAPS
      }
      type
    }
    parentEntityId
  }
`;

export const ENTITY_FRAGMENT = gql`
  ${APS_USER_FRAGMENT}
  ${SUB_ENTITY_FRAGMENT}
  fragment EntityFields on Entity {
    id
    createdAt
    createdBy {
      ...UserFieldsAPS
      email
    }
    machineNumber
    registeredDate
    model
    type {
      id
      name
      entityType
    }
    division {
      id
      name
    }
    engine
    location {
      id
      name
      zone {
        id
        name
      }
    }
    currentRunning
    lastService
    status
    measurement
    brand
    deletedAt
    assignees {
      user {
        ...UserFieldsAPS
      }
      type
    }
    sparePRs {
      id
      createdAt
      name
      requestedDate
      sparePRDetails {
        id
        description
      }
    }
    repairs {
      id
      name
    }
    breakdowns {
      id
      type
      estimatedDateOfRepair
      completedAt
      createdBy {
        ...UserFieldsAPS
      }
      details {
        id
        description
        repairs {
          id
          name
        }
      }
      repairs {
        id
        name
        breakdownDetail {
          id
        }
      }
    }
    subEntities {
      ...SubEntityFields
    }
    parentEntityId
  }
`;

export const CHECKLIST_TEMPLATE_FRAGMENT = gql`
  fragment ChecklistTemplateFields on ChecklistTemplate {
    id
    type
    name
    items {
      id
      name
    }
    entitiesDaily {
      id
      machineNumber
      location {
        id
        name
      }
      type {
        entityType
      }
    }
    entitiesWeekly {
      id
      machineNumber
      location {
        id
        name
      }
      type {
        entityType
      }
    }
  }
`;
