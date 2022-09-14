import { Badge, ConfigProvider, Popover, Switch } from "antd";
import { FaCog, FaRegMoon, FaSun } from "react-icons/fa";
import classes from "./ThemeChange.module.css";
import { AnyColorFormat, Colorpicker } from "antd-colorpicker";
import { useState } from "react";
import { useLocalStorage } from "../../helpers/useLocalStorage";

const ThemeChange = () => {
  const [theme, setTheme] = useLocalStorage("theme", "#1aaa7a");
  const [color, setColor] = useState<AnyColorFormat>({
    hex: theme ? theme : "#1aaa7a",
  });
  const [mode, setMode] = useLocalStorage("themeMode", "light");

  const switchMode = async () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    document.documentElement.setAttribute("data-theme", newMode);
  };

  ConfigProvider.config({
    theme: {
      primaryColor: color?.hex,
    },
  });

  const onChange = (newColor: AnyColorFormat) => {
    setColor({ hex: newColor?.hex });
    setTheme(newColor?.hex);
  };
  return (
    <Popover
      placement="bottomRight"
      trigger={["click"]}
      content={
        <div className={classes["theme-menu"]}>
          <div className={classes["title-wrapper"]}>
            <div className={classes["flex"]}>
              <div className={classes["title"]}>Change Theme</div>
              <div id={"colorcircle"}>
                <Badge dot color={color.hex} status={"processing"} />
              </div>
            </div>
            
            <Switch
              checkedChildren={<FaRegMoon size={14} style={{ marginTop: 4 }} />}
              unCheckedChildren={
                <FaSun size={14} style={{ marginTop: 4, color:"black" }} />
              }
              defaultChecked={mode === "dark" ? true : false}
              onChange={switchMode}
            />
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
            color: "var(--white)",
            fontSize: 18,
            marginTop: 6,
            marginRight: 10,
          }}
        />
      </div>
    </Popover>
  );
};

export default ThemeChange;
