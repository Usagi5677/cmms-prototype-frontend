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
  ${USER_FRAGMENT}
  fragment MachineFields on Machine {
    id
    createdAt
    createdBy {
      ...UserFields
      email
    }
    machineNumber
    registeredDate
    model
    type
    zone
    location
    currentRunningHrs
    lastServiceHrs
    interServiceHrs
    status
    assignees {
      ...UserFields
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
  ${USER_FRAGMENT}
  fragment TransportationFields on Transportation {
    id
    createdAt
    createdBy {
      ...UserFields
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
    interServiceMileage
    status
    measurement
    transportType
    assignees {
      ...UserFields
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
