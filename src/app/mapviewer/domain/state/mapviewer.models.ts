import { ITreeNode } from '@lars/interfaces';
import { MapObject } from '../entities';

export interface MapViewerFileTreeProp {
  fileTree: ITreeNode;
}

export interface MapObjectsProp {
  mapObjects: MapObject[];
}