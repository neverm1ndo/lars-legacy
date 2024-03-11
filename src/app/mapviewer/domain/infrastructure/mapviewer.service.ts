import { Injectable } from '@angular/core';
import { Group, MathUtils } from 'three';
import { allowedMapElements } from '../configs';
import { MapObject } from '../entities';
import { UserService } from '@lars/user/user.service';

@Injectable()
export class MapViewerService {

  constructor(
    private readonly user: UserService
  ) { }

  public mapGroupToXML(mapGroup: Group): XMLDocument {
    const xmlNamespaceURI: string = 'http://www.w3.org/1999/xhtml';
    const resultXML: XMLDocument = document.implementation.createDocument(xmlNamespaceURI, 'map', null);

    const map: Element = resultXML.querySelector('map');
          map.setAttribute('edf:definitions', 'editor_main');
    
    for (let object of mapGroup.children) {
      const objectElement: Element = resultXML.createElementNS(xmlNamespaceURI, object.userData.type);

      delete object.userData.type;
      delete object.userData.initial;
      
      for (let attribute in object.userData) {
        objectElement.setAttribute(attribute, object.userData[attribute]);
      }
      
      let { x: posX, y: posY, z: posZ } = object.position;
      let { x: rotX, y: rotY, z: rotZ } = object.rotation;

      [rotX, rotY, rotZ] = [rotX, rotY, rotZ].map((rad: number) => MathUtils.radToDeg(rad));

      const objectPositioning = { posX, posY, posZ, rotX, rotY, rotZ };
      
      for (let attribute in objectPositioning) {
        objectElement.setAttribute(attribute, objectPositioning[attribute]);
      }

      map.appendChild(objectElement);
    }

    const date = new Date().toISOString();
    const { username: author } = this.user.loggedInUser$.value; 
    const postComment: Comment = resultXML.createComment(`\n\tLARS gta-liberty.ru\n\tLast edited by ${author}\n\t${date}\n`);
    
    resultXML.append(postComment);

    return resultXML;
  }

  public mapToObject(xml: string): MapObject[] {
    const parser: DOMParser = new DOMParser();
    const xmlfyRegex: RegExp = new RegExp(' (edf:)(.*")');
    const objects: MapObject[] = [];

    try {

      const map = parser.parseFromString(xml.replace(xmlfyRegex, ''), 'application/xml');
      
      const parseerror: Element = map.getElementsByTagName('parsererror')
                                     .item(0);
      
      if (parseerror) {
        const errormsgElement: Element = parseerror.children.item(1);
        throw new Error(`NOT_XML: ${errormsgElement.textContent}`);
      }
  
      const mapElement: Element = map.getElementsByTagName('map')
                                     .item(0);
      
      if (!mapElement) throw new Error('MAP_TAG_IS_MISSING: map tag is not exists in this document');
      
      const mapChildElements: HTMLCollection = mapElement.children;
      
      for (let i = 0; i < mapChildElements.length; i++) {
        const element: Element = mapChildElements[i];
  
        const { attributes, tagName } = element;
  
        if (!this.isMapObjectTagAllowed(tagName)) {
          console.warn(`NOT_ALLOWED_MAP_TAG: ${tagName} skip.`);
          continue;
        }
  
        let obj = { name: tagName };
        for (let i = 0; i < attributes.length; i++) {
  
          const attribute: Attr = attributes[i];
  
          const { name, value } = attribute;
  
          const float = parseFloat(value);
          obj[name] = !isNaN(float) ? float : value;
        }
  
        objects.push(obj);
      }
      return objects;
    } catch (err) {
      console.error(err);
      return err;
    }
  }

  private isMapObjectTagAllowed(tagName: string): boolean {
    for (let allowed of allowedMapElements) {
      if (allowed === tagName) return true;
    }
    return false;
  }
}
