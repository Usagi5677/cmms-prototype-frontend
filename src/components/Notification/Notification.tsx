import { useState, useEffect, useContext } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import moment from "moment";
import { LoadingOutlined } from "@ant-design/icons";
//import { onMessageListener } from "../../firebase";
import { Spin, Dropdown, Badge, Button } from "antd";
import { errorMessage } from "../../helpers/gql";
import { NOTIFICATIONS } from "../../api/queries";
import { FaBell } from "react-icons/fa";
import { NOTIFICATION_CREATED } from "../../api/subscriptions";
import classes from "./Notification.module.css";
import {
  READ_ALL_NOTIFICATIONS,
  READ_ONE_NOTIFICATION,
} from "../../api/mutations";
import { useNavigate } from "react-router";
import Notification from "../../models/Notification";
import UserContext from "../../contexts/UserContext";

const Notifications = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [subscribed, setSubscribed] = useState(false);

  const [readNotification] = useMutation(READ_ONE_NOTIFICATION, {
    onError: (error) => {
      errorMessage(error, "Unexpected error while reading notification.");
    },
    refetchQueries: ["notifications"],
  });

  const [readAllNotification] = useMutation(READ_ALL_NOTIFICATIONS, {
    onError: (error) => {
      errorMessage(error, "Unexpected error while reading all notification.");
    },
    refetchQueries: ["notifications"],
  });

  const [getAllNotificationOfUser, { data, loading, subscribeToMore }] =
    useLazyQuery(NOTIFICATIONS, {
      onCompleted: () => {
        subscribe();
      },
      onError: (err) => {
        errorMessage(err, "Error loading request.");
      },
    });

  useEffect(() => {
    getAllNotificationOfUser();
  }, [getAllNotificationOfUser]);

  const subscribe = () => {
    // Ensure subscription is done once and not every render
    if (subscribed) return;
    subscribeToMore({
      document: NOTIFICATION_CREATED,
      variables: { userId: user?.id },
      updateQuery: (prev, { subscriptionData }) => {
        const notification = subscriptionData.data.notificationCreated;
        // If already on the page of the notification link, mark notification
        // as read.
        if (notification.link === window.location.pathname) {
          readNotification({
            variables: { notificationId: notification.id },
          });
        }
        const updated = [notification, ...prev.notifications];
        return { notifications: updated };
      },
    });
    setSubscribed(true);
  };

  const renderLog = (notification: Notification) => {
    return (
      <>
        <div>
          <Badge
            status={notification.readAt ? "default" : "processing"}
            style={{ whiteSpace: "normal" }}
            text={notification.body}
          />
        </div>
        <div
          style={{
            fontStyle: "italic",
            fontSize: ".8em",
            opacity: 0.8,
          }}
        >
          {moment(notification.createdAt).fromNow()}
        </div>
      </>
    );
  };

  return (
    <Dropdown
      placement="bottomRight"
      trigger={["click"]}
      overlay={
        loading && data?.notifications.length === 0 ? (
          <Spin
            style={{ textAlign: "center", padding: "20px 100px" }}
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin={true} />}
          />
        ) : (
          <div className={classes["notification-menu"]}>
            {data?.notifications.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px 100px",
                  fontStyle: "italic",
                }}
              >
                You have no notifications!
              </div>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    onClick={() => {
                      readAllNotification();
                    }}
                    type="link"
                  >
                    Clear All
                  </Button>
                </div>
                {data?.notifications.map((notification: Notification) => (
                  <div
                    className={classes["notification-menu-item"]}
                    style={{ padding: "7px 15px" }}
                    key={notification.id}
                  >
                    <div
                      onClick={() => {
                        readNotification({
                          variables: { notificationId: notification.id },
                        });
                        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                        notification.link ? navigate(notification.link) : null;
                      }}
                    >
                      {renderLog(notification)}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )
      }
    >
      <div style={{ position: "relative" }}>
        <Badge
          size="small"
          count={data?.notifications.length}
          style={{ marginTop: 6 }}
        >
          <FaBell
            style={{
              cursor: "pointer",
              color: "white",
              fontSize: 18,
              marginTop: 6,
            }}
          />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default Notifications;
