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

export const getEqualValuesUnder140 = (colorCount: number): number[] => {
  const step = Math.round(140 / (colorCount + 1));
  let h:any = [];
  for (let i = 0; i <= 140; i += step) {
    h.push(i);
  }
  return h.reverse();
};
