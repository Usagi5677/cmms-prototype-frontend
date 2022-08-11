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

export const MACHINE_FRAGMENT = gql`
  ${APS_USER_FRAGMENT}
  fragment MachineFields on Machine {
    id
    createdAt
    createdBy {
      ...UserFieldsAPS
      email
    }
    machineNumber
    registeredDate
    model
    zone
    location
    status
    currentRunning
    lastService
    measurement
    isDeleted
    deletedAt
    assignees {
      user {
        ...UserFieldsAPS
      }
    }
    sparePRs {
      requestedDate
      title
      description
      status
    }
    breakdowns {
      title
      description
      status
    }
  }
`;

export const TRANSPORTATION_FRAGMENT = gql`
  ${APS_USER_FRAGMENT}
  fragment TransportationFields on Transportation {
    id
    createdAt
    createdBy {
      ...UserFieldsAPS
      email
    }
    machineNumber
    registeredDate
    model
    department
    engine
    location
    currentMileage
    lastServiceMileage
    status
    measurement
    transportType
    brand
    isDeleted
    deletedAt
    assignees {
      user {
        ...UserFieldsAPS
      }
    }
    sparePRs {
      requestedDate
      title
      description
      status
    }
    breakdowns {
      title
      description
      status
    }
  }
`;

export const ENTITY_FRAGMENT = gql`
  ${APS_USER_FRAGMENT}
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
    department
    engine
    zone
    location
    currentRunning
    lastService
    currentMileage
    lastServiceMileage
    status
    measurement
    brand
    isDeleted
    deletedAt
    assignees {
      user {
        ...UserFieldsAPS
      }
      type
    }
    sparePRs {
      requestedDate
      title
      description
      status
    }
    breakdowns {
      title
      description
      status
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
      location
      type {
        entityType
      }
    }
    entitiesWeekly {
      id
      machineNumber
      location
      type {
        entityType
      }
    }
  }
`;
