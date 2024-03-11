import { Injectable } from '@angular/core';
import { MapObject, RectangleVertices, Viewport } from '../entities';

@Injectable()
export class Flat2dmapService {

  constructor() { }

  /* istambul ignore next */
  /** Jarvis algorithm https://ru.algorithmica.org/cs/convex-hulls/jarvis/
  * @param {Array<MapObject>} objects map objects array typeof Array<MapObject>
  * @returns {RectangleVertices} object with vertices of the rectangle
  */
  jarvis(objects: MapObject[]): RectangleVertices {
    function getLeft(objs: MapObject[]) {
        objs.sort((a, b) => { if (a.posX && b.posX) return a.posX - b.posX });
        if (objs[0].posX) {
          return objs[0];
        } else {
          return objs[1];
        }
    };
    
    function getTop(objs: MapObject[]) {
      objs.sort((a, b) => { if (a.posY && b.posY) return a.posY - +b.posY });
      return objs[objs.length - 1];
    };
    
    function getRight(objs: MapObject[]) {
      objs.sort((a, b) => { if (a.posX && b.posX) return a.posX - +b.posX });
      return objs[objs.length - 1];
    };
    
    function getBottom(objs: MapObject[]) {
      objs.sort((a, b) => { if (a.posY && b.posY) return a.posY - +b.posY });
      if (+objs[0].posX) {
        return objs[0];
      } else {
        return objs[1];
      }
    };
  
    return {
      left: getLeft(objects),
      top: getTop(objects),
      right: getRight(objects),
      bottom: getBottom(objects)
    };
  }

  removeDoubles(objects: MapObject[], maxDistance: number): MapObject[] {
    for(let i = 0; i < objects.length; i++) {
      const object: MapObject = objects[i];
      if (!object) break;
      if (object.name == 'meta' || object.name == 'texture') continue;
      for (let j = i; j < objects.length - i; j++) {
        const next: MapObject = objects[j];
        if (this.getDistanceBetweenObjects(object, next) < maxDistance) objects.splice(j, 1);
      }
    }
    return objects;
  }

  getDistanceBetweenObjects(a: MapObject, b: MapObject): number {
    return Math.sqrt(Math.pow(b.posX - a.posX, 2) + Math.pow(b.posY - a.posY, 2) + Math.pow(b.posZ - a.posZ, 2));
  }

  toFloat32Array(objects: MapObject[]): Float32Array {
    const arr = [];
    for (const object of objects) {
      arr.push(Object.values(object).slice(2, 8));
    }

    return new Float32Array(arr);
  }

  getAverage(objects: MapObject[], key: keyof Omit<MapObject, 'id' | 'name' | 'dimension' | 'model' | 'interior'>): number {
    let count = 0;
    const res = objects.reduce((acc, obj) => {
      if (obj[key]) {
        count++;
        return acc + obj[key];
      } else {
        return acc;
      }
    }, 0);
    return Number((res/count).toFixed(4));
  }
  
  /**
  * Ease-In animation
  */
  easeIn(currentProgress: number, start: number, distance: number, steps: number, power: number): number {
    currentProgress /= steps/2;
    if (currentProgress < 1) return (distance/2)*(Math.pow(currentProgress, power)) + start;
    currentProgress -= 2;
    return distance/2*(Math.pow(currentProgress,power)+2) + start;
  }

  getEase(currentProgress: number, start: number, distance: number, steps: number, power: number) {
    currentProgress /= steps/2;
    if (currentProgress < 1) {
      return (distance/2)*(Math.pow(currentProgress, power)) + start;
    }
    currentProgress -= 2;
    return distance/2*(Math.pow(currentProgress, 3)+ 2) + start;
  }

  getIngameCoords([x, y]: number[], { x: viewportX, y: viewportY }: Viewport): number[] {
    return [
      
    ]
  }

  async loadResourceImages(sources: { src: string, name: string }[]): Promise<Record<string, CanvasImageSource>> {
    try {
      const resources = {};
      for (let source of sources) {
        const image = new Image();
        image.src = source.src;

        await new Promise<void>((resolve) => {
          image.onload = () => resolve();
        });

        resources[source.name] = image;
      }

      return resources;
    } catch(err) {
      console.error(err);
    }
  }
}
