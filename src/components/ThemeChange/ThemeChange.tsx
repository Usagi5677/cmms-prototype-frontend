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
import useLocalStorage from "use-local-storage";

const ThemeChange = () => {
  const [theme, setTheme] = useLocalStorage("theme", "#1aaa7a");
  const [color, setColor] = useState<AnyColorFormat>({
    hex: theme ? theme : "#1aaa7a",
  });

  let colors: string[];

  ConfigProvider.config({
    theme: {
      primaryColor: color?.hex,
    },
  });

  const onChange = (newColor: AnyColorFormat) => {
    setColor({ hex: newColor?.hex });
    setTheme(newColor?.hex);
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
              <Badge dot color={color.hex} status={"processing"} />
            </div>
          </div>

          <div className={classes["colorpicker-container"]}>
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
