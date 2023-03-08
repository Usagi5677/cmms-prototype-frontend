import { VerticalAlignTopOutlined } from "@ant-design/icons";
import { memo, useEffect, useState } from "react";
import classes from "./PageTopButton.module.css";

const PageTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = document.getElementById("content");
    element?.addEventListener("scroll", () => {
      if (element?.scrollTop > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    });
  }, []);

  const scrollToTop = () => {
    const element = document.getElementById("content");
    element?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return visible ? (
    <button
      onClick={scrollToTop}
      className={classes["button"]}
      style={{
        display: visible ? "inline" : "none",
      }}
    >
      <VerticalAlignTopOutlined className={classes["icon"]} />
    </button>
  ) : (
    <button
      style={{
        display: "none",
      }}
      title="Go to top"
    >
      Top
    </button>
  );
};

export default memo(PageTopButton);
