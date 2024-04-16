export interface Shape {
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  angle: number;
  text?: string;
  points?: { x: number; y: number }[];
}

export enum ResizeDirection {
  TOP_LEFT = "topLeft",
  TOP_RIGHT = "topRight",
  BOTTOM_LEFT = "bottomLeft",
  BOTTOM_RIGHT = "bottomRight",
}

export enum ShapeType {
  TEXT = "text",
  RECT = "rect",
  CIRCLE = "circle",
  TRIANGLE = "triangle",
}
