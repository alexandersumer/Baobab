export const grid = 8;
export const borderRadius = 10;
export const color = {
  N900: "#091E42",
  R50: "#FFEBE5",
  T50: "#E6FCFF",
  N30: "#EBECF0",
  P100: "#998DD9",
  B200: "#2684FF",
  KANBANBG: "#F5F5F5",
  KANBAN_LANE_NORMAL: toRGBA(234, 227, 227, 0.6),
  KANBAN_LANE_OVER: toRGBA(150, 133, 143, 1.0),
  KANBAN_LANE_FROM: toRGBA(150, 133, 143, 0.5),
  QUEUE_KANBAN: toRGBA(102, 171, 140, 1.0),
  QUEUE_NESTED: toRGBA(3, 117, 180, 1.0),
  QUEUE_ICON_BG: toRGBA(110, 196, 219, 0.15)
};
export const doingWidth = "535px";
export const queueWidth = "175px";

function toRGBA(r, g, b, a) {
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
}
