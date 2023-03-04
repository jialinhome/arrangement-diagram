
import type { DrawNodeShapeConfig } from 'arrangement-diagram';
import type { IShape } from "@antv/g6";

export default function createFlowNode(cfg: DrawNodeShapeConfig):IShape {
  const { cfg: config, group, keyShapeWidth, keyShapeHeight, flow } = cfg;
  const {
    name = "",
    variableName,
    variableValue,
    variableUp,
    label,
    currency,
    status,
    rate,
  } = config;

  const { fillColor } = flow;

  const grey = "#CED4D9";
  const colors = {
    B: '#5B8FF9',
    R: '#F46649',
    Y: '#EEBC20',
    G: '#5BD8A6',
    DI: '#A7A7A7',
  };
  const rectConfig = {
    width: keyShapeWidth,
    height: keyShapeHeight,
    lineWidth: 1,
    fontSize: 12,
    fill: config.fillColor || fillColor,
    radius: 4,
    stroke: colors.B,
    opacity: 1,
  };

  const nodeOrigin = {
    x: 0,
    y: 0,
  };

  const textConfig = {
    textAlign: "left",
    textBaseline: "bottom",
  } as const;

  const rect = group.addShape("rect", {
    attrs: {
      x: nodeOrigin.x,
      y: nodeOrigin.y,
      ...rectConfig,
    },
  });

  const rectBBox = rect.getBBox();

  // label title
  group.addShape("text", {
    attrs: {
      ...textConfig,
      x: 12 + nodeOrigin.x,
      y: 20 + nodeOrigin.y,
      text: name.length > 28 ? name.substr(0, 28) + "..." : name,
      fontSize: 12,
      opacity: 0.85,
      fill:  "#000",
      cursor: "pointer",
    },
    name: "name-shape",
  });

  // price
  const price = group.addShape("text", {
    attrs: {
      ...textConfig,
      x: 12 + nodeOrigin.x,
      y: rectBBox.maxY - 12,
      text: label,
      fontSize: 16,
      fill: "#000",
      opacity: 0.85,
    },
  });

  // label currency
  group.addShape("text", {
    attrs: {
      ...textConfig,
      x: price.getBBox().maxX + 5,
      y: rectBBox.maxY - 12,
      text: currency,
      fontSize: 12,
      fill: "#000",
      opacity: 0.75,
    },
  });

  // percentage
  const percentText = group.addShape("text", {
    attrs: {
      ...textConfig,
      x: rectBBox.maxX - 8,
      y: rectBBox.maxY - 12,
      text: `${((variableValue || 0) * 100).toFixed(2)}%`,
      fontSize: 12,
      textAlign: "right",
      fill: colors[status as keyof typeof colors],
    },
  });

  // percentage triangle
  const symbol = variableUp ? "triangle" : "triangle-down";
  const triangle = group.addShape("marker", {
    attrs: {
      ...textConfig,
      x: percentText.getBBox().minX - 10,
      y: rectBBox.maxY - 12 - 6,
      symbol,
      r: 6,
      fill: colors[status as keyof typeof colors],
    },
  });

  // variable name
  group.addShape("text", {
    attrs: {
      ...textConfig,
      x: triangle.getBBox().minX,
      y: rectBBox.maxY - 12,
      text: variableName,
      fontSize: 12,
      textAlign: "right",
      fill: "#000",
      opacity: 0.45,
    },
  });

  // bottom line background
  const bottomBackRect = group.addShape("rect", {
    attrs: {
      x: nodeOrigin.x,
      y: rectBBox.maxY - 4,
      width: rectConfig.width,
      height: 4,
      radius: [0, 0, rectConfig.radius, rectConfig.radius],
      fill: "#E0DFE3",
    },
  });

  // bottom percent
  const bottomRect = group.addShape("rect", {
    attrs: {
      x: nodeOrigin.x,
      y: rectBBox.maxY - 4,
      width: rate * rectConfig.width,
      height: 4,
      radius: [0, 0, rectConfig.radius, rectConfig.radius],
      fill: colors[status as keyof typeof colors],
    },
  });
  return rect;
}
