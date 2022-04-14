import { message } from "antd";

export function errorMessage(error: any, msg: string) {
  if (error.graphQLErrors[0]) {
    message.error(error.graphQLErrors[0].message);
    return;
  }
  message.error(msg ?? "An error occurred. Please try again.");
}
