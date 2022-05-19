import { Component, OnInit } from '@angular/core';
import { faUserSlash } from '@fortawesome/free-solid-svg-icons';

enum BanType {
  CHEATING,
  BUG_ABUSE,
  ADS,
  PAUSING,
  DRIVEBY,
  REJECTED_NICKNAME,
  INSULT,
}

interface BanRule {
  id: number;
  rule: string;
  ban_type: BanType;
  ip: string;
  serial_cn?: string;
  serial_as?: string;
  serial_ss?: string;
  user_id?: number;
  admin_id: number;
  banned_from: Date;
  banned_to: Date | null;
}

@Component({
  selector: 'app-banhammer',
  templateUrl: './banhammer.component.html',
  styleUrls: ['./banhammer.component.scss']
})
export class BanhammerComponent implements OnInit {

  constructor() { }

  public bans: BanRule[] = [];

  public searchTypes = [
    { id: 0, val: 'IP' },
    { id: 1, val: 'CN' },
    { id: 2, val: 'AS&SS' },
    { id: 3, val: 'Никнейм' },
    { id: 4, val: 'Время' },
  ];

  public currentSearchType: number = 0;

  fa = {
    ban: faUserSlash
  }

  ngOnInit(): void {
  }

}
