export interface Viewport {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

export interface MapObject {
  name: string;
  id?: string | number;
  posX?: number;
  posY?: number;
  posZ?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  alpha?: number;
  scale?: number;
  model?: number;
  collisions?: boolean;
  doublesided?: boolean;
  dimension?: number;
  interior?: number;
  color?: number;
  txd?: string;
  texture?: string;
  selected?: boolean;
}

export type Position2 = {
  x: number;
  y: number;
};

export interface RectangleVertices {
  left: MapObject;
  top: MapObject;
  right: MapObject;
  bottom: MapObject;
}

export enum ViewerColntrolMode {
  NONE,
  DRAG,
  MOVE,
  ROTATE
}

export type NumericMapObjectAttributeName = keyof Omit<
  MapObject,
  | 'id'
  | 'name'
  | 'dimension'
  | 'model'
  | 'interior'
  | 'color'
  | 'txd'
  | 'texture'
  | 'collisions'
  | 'doublesided'
  | 'selected'
>;
