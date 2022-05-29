import { gql } from "@apollo/client";
import { USER_FRAGMENT } from "./fragments";


export const NOTIFICATION_CREATED = gql`
  subscription notificationCreated($userId: Int!) {
    notificationCreated(userId: $userId) {
      id
      body
      createdAt
      readAt
      link
      userId
    }
  }
`;

