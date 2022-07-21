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
    type
    zone
    location
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
    type
    department
    engine
    location
    currentMileage
    lastServiceMileage
    status
    measurement
    transportType
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

export const CHECKLIST_TEMPLATE_FRAGMENT = gql`
  fragment ChecklistTemplateFields on ChecklistTemplate {
    id
    type
    name
    items {
      id
      name
    }
    machinesDaily {
      id
      machineNumber
      location
    }
    machinesWeekly {
      id
      machineNumber
      location
    }
    transportationsDaily {
      id
      machineNumber
      location
    }
    transportationsWeekly {
      id
      machineNumber
      location
    }
  }
`;
