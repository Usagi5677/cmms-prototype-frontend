export const stringToColor = (str: string) => {
  let hash = 2;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 7) - hash) + str.length;
  }
  return `hsl(${hash % 360}, 30%, 40%)`;
};

export const RoleTagStringToColor = (str: string) => {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 7) - hash) + str.length;
  }
  return `hsl(${hash % 360}, 30%, 40%, .3)`;
};

export const UserTagStringToColor = (str: string) => {
  let hash = 1;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 7) - hash) + str.length;
  }
  return `hsl(${hash % 360}, 30%, 40%, .3)`;
};

export const statusColors = (status: string) => {
  let color = "grey";
  let bgColor = "white";
  if (status === "Pending") {
    bgColor = "#e6fffb";
    color = "#08979c";
  } else if (status === "Open") {
    bgColor = "#e6f7ff";
    color = "#096dd9";
  } else if (status === "Closed") {
    bgColor = "#fff7e6";
    color = "#d46b08";
  } else if (status === "Solved") {
    bgColor = "#f6ffed";
    color = "#389e0d";
  } else if (status === "Reopened") {
    bgColor = "#f0f5ff";
    color = "#1d39c4";
  }
  return [color, bgColor];
};

export const usageColors = (label: string) => {
  let color = "grey";
  let bgColor = "white";
  if (label === "Working hour") {
    bgColor = "#e6fffb";
    color = "#08979c";
  } else if (label === "Idle hour") {
    bgColor = "#fff7e6";
    color = "#d46b08";
  } else if (label === "Breakdown hour") {
    bgColor = "#fad4d4";
    color = "#ff0000";
  }else if (label === "Total hour") {
    bgColor = "#adaa95";
    color = "#252000";
  }else if (label === "Working percentage") {
    bgColor = "#a3d9b9";
    color = "#008e3c";
  }else if (label === "Idle percentage") {
    bgColor = "#f5c89a";
    color = "#ff8000";
  }else if (label === "Breakdown percentage") {
    bgColor = "#f0b1a3";
    color = "#e02900";
  }
  return [color, bgColor];
};

export const getEqualValuesUnder140 = (colorCount: number): number[] => {
  const step = Math.round(140 / (colorCount + 1));
  let h:any = [];
  for (let i = 0; i <= 140; i += step) {
    h.push(i);
  }
  return h.reverse();
};
