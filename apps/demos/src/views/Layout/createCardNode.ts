import type { DrawNodeShapeConfig } from "arrangement-diagram";
import type { IShape } from "@antv/g6";

export default function createCardNode(cfg: DrawNodeShapeConfig): IShape {
  const { cfg: config, group, keyShapeWidth, keyShapeHeight, flow } = cfg;
  /* 最外面的矩形 */
  const keyShape = group.addShape("rect", {
    attrs: {
      x: 0,
      y: 0,
      width: keyShapeWidth,
      height: keyShapeHeight,
      fill: config.fillColor || flow.fillColor,
      stroke: config.strokeColor || flow.strokeColor,
      radius: 2,
      cursor: "pointer",
    },
    name: "rect-shape",
    draggable: true,
  });

  /* name */
  group.addShape("text", {
    attrs: {
      text: config.name,
      x: 19,
      y: 19,
      fontSize: 14,
      fontWeight: 700,
      textAlign: "left",
      textBaseline: "middle",
      fill: "#ffffff",
      cursor: "pointer",
    },
    name: "name-text-shape",
    draggable: true,
  });

  /* 描述 */
  group.addShape("text", {
    attrs: {
      text: config.keyInfo,
      x: 19,
      y: 45,
      fontSize: 14,
      textAlign: "left",
      textBaseline: "middle",
      fill: "#ffffff",
      cursor: "pointer",
    },
    name: "bottom-text-shape",
  });

  return keyShape;
}
