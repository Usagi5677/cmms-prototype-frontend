import { Button, Result } from "antd";
import { useNavigate } from "react-router";
import classes from "./NotFound.module.css";
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className={classes["container"]} id={"notFound"}>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          
          extra={
            <Button
              className="primaryButton"
              onClick={() => navigate(-1)}
              type="primary"
            >
              Back Home
            </Button>
          }
        />
      </div>
  );
};

export default NotFound;
