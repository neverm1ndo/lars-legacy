import { Component, OnInit } from '@angular/core';
import { faCog, faClipboardList, faMap, faSearch } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.scss']
})
export class SiderComponent implements OnInit {

  fa = {
    cog: faCog,
    redactor: faClipboardList,
    map: faMap,
    search: faSearch
  };

  constructor() {}

  ngOnInit(): void {
  }

}
