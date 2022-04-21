import { Button } from "antd";
import { PAGE_LIMIT } from "../../../helpers/constants";
import classes from "./PaginationButtons.module.css";

const PaginationButtons = ({
  page,
  pageInfo,
  back,
  next,
}: {
  page: number;
  pageInfo: { hasNextPage: boolean; hasPreviousPage: boolean; count: number };
  back: () => void;
  next: () => void;
}) => {
  return (
    <>
      {(pageInfo.hasNextPage || pageInfo.hasPreviousPage) && (
        <div className={classes["button-wrapper"]}>
          <div>
            Page {page} of {Math.ceil(pageInfo.count / PAGE_LIMIT)}
          </div>
          <div style={{ display: "flex" }}>
            {pageInfo.hasPreviousPage && (
              <div style={{ marginRight: pageInfo.hasNextPage ? "1rem" : 0 }}>
                <Button
                  htmlType="button"
                  size="middle"
                  onClick={back}
                  className={classes["custom-btn-secondary"]}
                >
                  Back
                </Button>
              </div>
            )}
            {pageInfo.hasNextPage && (
              <div>
                <Button
                  htmlType="button"
                  size="middle"
                  onClick={next}
                  className={classes["custom-btn-secondary"]}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PaginationButtons;
