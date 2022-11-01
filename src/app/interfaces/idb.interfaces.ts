import { Workgroup } from '@lars/enums';
export interface IDBUser {
  id: number;
  username: string;
  avatar: string;
  main_group: Workgroup;
  secondary_group: Workgroup;
}
