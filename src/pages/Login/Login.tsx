// Updated Login Container Component
import React, { useState, useEffect } from "react";
import { Button, Form, Input, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useMutation, gql } from "@apollo/client";
import { apolloClient } from "../../api/client";

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const Login = ({ login }: any) => {
  const [loginForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Log environment variables on component mount
  useEffect(() => {
    console.log("API URL:", process.env.REACT_APP_API_URL);
    console.log("WebSocket URL:", process.env.REACT_APP_WEBSOCKET_URL);
  }, []);

  const [loginMutation] = useMutation(LOGIN_MUTATION, {
    client: apolloClient,
    onCompleted: (data) => {
      console.log("Login successful, response data:", data);
      setLoading(false);
      message.success("Login successful!");
      login(data.login.token);
    },
    onError: (error) => {
      setLoading(false);
      message.error("Invalid credentials. Please try again.");
      console.error("Login error:", error);

      // Detailed error logging
      console.log("Error name:", error.name);
      console.log("Error message:", error.message);
      console.log("Network error:", error.networkError);
      console.log("GraphQL errors:", error.graphQLErrors);

      // Check response structure if available
      if (error.networkError && "response" in error.networkError) {
        console.log("Response:", error.networkError.response);
      }
    },
  });

  const onFinish = (values: any) => {
    console.log("Attempting login with:", {
      email: values.email,
      password: "********",
    });
    console.log("Using API URL:", process.env.REACT_APP_API_URL);

    setLoading(true);
    loginMutation({
      variables: {
        email: values.email,
        password: values.password,
      },
    }).catch((error) => {
      // This catch block handles any errors not caught by onError
      console.log("Uncaught error during login:", error);
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card title="CMMS Login" style={{ width: 400 }}>
        <Form
          form={loginForm}
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
