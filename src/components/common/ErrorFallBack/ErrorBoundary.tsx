import { Button, Result } from "antd";
import { Component } from "react";
import classes from "./ErrorBoundary.module.css";

class ErrorBoundary extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
    };
  }
  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
    };
  }
  

  render() {
    if (this.state.hasError) {
      return (
        <div className={classes["container"]} id={"notFound"}>
          <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
            extra={
              <Button
                className="primaryButton"
                onClick={()=>{window.location.href = '/'}}
                type="primary"
              >
                Back Home
              </Button>
            }
          />
        </div>
      );
    }
    return this.props.children
  }
}

export default ErrorBoundary;
