import { Badge, ConfigProvider, Dropdown } from "antd";
import { FaCog } from "react-icons/fa";
import classes from "./ThemeChange.module.css";
import {
  AnyColorFormat,
  Colorpicker,
  ColorPickerValue,
} from "antd-colorpicker";
import { useState } from "react";
import { generate, presetDarkPalettes } from "@ant-design/colors";

const ThemeChange = () => {
  const [color, setColor] = useState<AnyColorFormat>({
    hex: "#1aaa7a",
  });

  let colors: string[];
  

  ConfigProvider.config({
    theme: {
      primaryColor: color?.hex,
    },
  });

  const onChange = (newColor: AnyColorFormat) => {
    setColor({ hex: newColor?.hex });
    colors = generate(newColor?.hex, {
      theme: "dark",
      backgroundColor: "#141414",
    });
    //console.log(colors);
    //console.log(presetDarkPalettes);
  };
  return (
    <Dropdown
      placement="bottomRight"
      trigger={["click"]}
      overlay={
        <div className={classes["notification-menu"]}>
          <div className={classes["flex"]}>
            <div className={classes["title"]}>Change theme</div>
            <div id={"colorcircle"}>
              <Badge dot color={color.hex} size={"small"} />
            </div>
          </div>

          <div className={classes["colorpicker"]}>
            <Colorpicker value={color} onChange={onChange} />
          </div>
        </div>
      }
    >
      <div style={{ position: "relative" }}>
        <FaCog
          style={{
            cursor: "pointer",
            color: "white",
            fontSize: 18,
            marginTop: 6,
            marginRight: 10,
          }}
        />
      </div>
    </Dropdown>
  );
};

export default ThemeChange;
