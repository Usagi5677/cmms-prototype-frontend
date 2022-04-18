import { gql } from "@apollo/client";
import { MACHINE_FRAGMENT } from "./fragments";

export const ME_QUERY = gql`
  query {
    me {
      id
      rcno
      fullName
      email
      userId
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
    $createdByUserId: String
  ) {
    getAllMachine(
      after: $after
      before: $before
      first: $first
      last: $last
      search: $search
      createdByUserId: $createdByUserId
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
