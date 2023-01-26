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
    machineNumber
    registeredDate
    model
    engine
    currentRunning
    lastService
    status
    measurement
    lastServiceUpdateAt
    brand {
      id
      name
    }
    deletedAt
    note
    dimension
    registryNumber
    transit
    createdBy {
      ...UserFieldsAPS
      email
    }
    type {
      id
      name
      entityType
      interServiceColor {
        id
        measurement
        greaterThan
        lessThan
        brand {
          id
          name
        }
        type {
          id
          name
        }
      }
    }
    division {
      id
      name
    }
    location {
      id
      name
      zone {
        id
        name
      }
    }
    assignees {
      user {
        ...UserFieldsAPS
      }
      type
    }
    hullType {
      id
      name
    }
    repairs {
      id
      name
    }
    parentEntityId
    parentEntity {
      machineNumber
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
    transit
    type {
      id
      name
      entityType
      interServiceColor {
        id
        measurement
        greaterThan
        lessThan
        brand {
          id
          name
        }
        type {
          id
          name
        }
      }
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
    interService
    status
    measurement
    lastServiceUpdateAt
    brand {
      id
      name
    }
    deletedAt
    note
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
    parentEntityId
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
    hullType {
      id
      name
    }
    dimension
    registryNumber
  }
`;

export const ENTITY_FRAGMENT_WITH_PM = gql`
 ${APS_USER_FRAGMENT}
  fragment EntityFieldsWithPM on Entity {
    id
    createdAt
    machineNumber
    registeredDate
    model
    type {
      id
      name
      entityType
      interServiceColor {
        id
        measurement
        greaterThan
        lessThan
        brand {
          id
          name
        }
        type {
          id
          name
        }
      }
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
    interService
    status
    measurement
    lastServiceUpdateAt
    periodicMaintenances {
      id
      name
      status
      currentMeterReading
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
