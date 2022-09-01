import { useLazyQuery } from "@apollo/client";
import { GET_USERS_WITH_PERMISSION } from "../api/queries";
import { errorMessage } from "./gql";
import { useEffect } from "react";

export function GetUsersWithPermission(permissions: string[]) {
  const [getUsersWithPermission, { data: userData }] = useLazyQuery(
    GET_USERS_WITH_PERMISSION,
    {
      onError: (err) => {
        errorMessage(err, "Error loading user list.");
      },
      fetchPolicy: "network-only",
      nextFetchPolicy: "cache-first",
      notifyOnNetworkStatusChange: true,
    }
  );

  // Fetch users when component mount
  useEffect(() => {
    getUsersWithPermission({
      variables: { permissions },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getUsersWithPermission]);

  return userData?.getUsersWithPermission;
}
