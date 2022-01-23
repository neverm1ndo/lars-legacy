import { Workgroup } from '../enums';
export interface IDBUser {
  name: string,
  avatar: string,
  id: number,
  group: Workgroup,
}
