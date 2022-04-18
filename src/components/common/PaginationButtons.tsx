import { Button } from "antd";
import { PAGE_LIMIT } from "../../helpers/constants";

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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
            alignItems: "center",
          }}
        >
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
                  style={{
                    width: "100%",
                    color: "var(--primary)",
                    borderRadius: 20,
                  }}
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
                  style={{
                    width: "100%",
                    color: "var(--primary)",
                    borderRadius: 20,
                  }}
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
