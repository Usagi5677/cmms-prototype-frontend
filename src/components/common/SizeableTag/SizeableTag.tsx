import { HSLToRGB } from "../../../helpers/style";
import classes from "./SizeableTag.module.css";

const SizeableTag = ({
  name = "",
  height = 20,
  fontSize = 14,
  nameColor,
  customColor,
  fontColor = "black",
  bgColor = "white",
  borderColor = "#ccc",
  fontWeight,
  title = "",
  defaultColor,
  oppositeMargin = false,
  clickable = false,
}: {
  name: string;
  height?: number;
  fontSize?: number;
  customColor?: number[];
  nameColor?: boolean;
  fontColor?: string;
  bgColor?: string;
  borderColor?: string;
  fontWeight?: number;
  title?: string;
  defaultColor?: boolean;
  oppositeMargin?: boolean;
  clickable?: boolean,
}) => {
  let rs,
    gs,
    bs,
    rt,
    gt,
    bt = 0;
  //if default color, antd color
  if (defaultColor) {
    if (name === "Working") {
      fontColor = "var(--ant-tag-cyan-color)";
      bgColor = "var(--ant-tag-cyan-bg)";
      borderColor = "var(--ant-tag-cyan-border)";
    } else if (name === "Breakdown") {
      fontColor = "var(--ant-tag-red-color)";
      bgColor = "var(--ant-menu-not-horizontal-menu-item-selected)";
      borderColor = "var(--ant-tag-red-border)";
    } else if (name === "Critical") {
      fontColor = "var(--ant-tag-orange-color)";
      bgColor = "var(--ant-tag-orange-bg)";
      borderColor = "var(--ant-tag-orange-border)";
    } else if (name === "Dispose") {
      fontColor = "white";
      bgColor = "rgb(139, 0, 0)";
      borderColor = "rgb(139, 0, 0)";
    }
    <div
      className={classes["container"]}
      style={{
        backgroundColor: bgColor,
        color: fontColor,
        borderColor,
        fontSize,
        marginLeft: oppositeMargin ? 0 : 6,
        marginRight: oppositeMargin ? 6 : 0,
        cursor: clickable ? "pointer" : "initial"
      }}
      title={`${title}`}
    >
      {name}
    </div>;
  }
  //color based on the name
  if (nameColor) {
    let hash = 2;
    for (var i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 7) - hash) + name.length;
    }
    rt = `hsl(${hash % 360}, 20%, 80%)`;
    rs = `hsl(${hash % 360}, 100%, 25%)`;
    const hex = `hsl(${hash % 360}, 100%, 40%)`;
    //if overwriting the color based on name
    if (customColor?.length === 3) {
      const [r, g, b] = customColor;
      rs = r * 0.7;
      gs = g * 0.7;
      bs = b * 0.7;
      rt = r + 0.6 * (255 - r);
      gt = g + 0.6 * (255 - g);
      bt = b + 0.6 * (255 - b);
      return (
        <div
          className={classes["container"]}
          style={{
            backgroundColor: `rgb(${rt},${gt},${bt})`,
            color: `rgb(${rs},${gs},${bs})`,
            borderColor: `rgb(${rs},${gs},${bs})`,
            fontSize,
            height,
            marginLeft: oppositeMargin ? 0 : 6,
            marginRight: oppositeMargin ? 6 : 0,
            cursor: clickable ? "pointer" : "initial"
          }}
          title={`${title}`}
        >
          {name}
        </div>
      );
    }

    return (
      <div
        className={classes["container"]}
        style={{
          backgroundColor: rt,
          color: rs,
          borderColor: rs,
          fontSize,
          height,
          fontWeight,
          marginLeft: oppositeMargin ? 0 : 6,
          marginRight: oppositeMargin ? 6 : 0,
          cursor: clickable ? "pointer" : "initial"
        }}
        title={`${title}`}
      >
        {name}
      </div>
    );
  }

  return (
    <div
      className={classes["container"]}
      style={{
        backgroundColor: bgColor,
        color: fontColor,
        borderColor,
        fontSize,
        marginLeft: oppositeMargin ? 0 : 6,
        marginRight: oppositeMargin ? 6 : 0,
      }}
      title={`${title}`}
    >
      {name}
    </div>
  );
};

export default SizeableTag;
