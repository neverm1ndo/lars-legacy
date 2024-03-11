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
    model?: number;
    dimension?: number;
    interior?: number;
}

export type Position2 = {
    x: number;
    y: number;
}
  
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
  