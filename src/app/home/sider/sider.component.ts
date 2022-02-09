import { Component, OnInit } from '@angular/core';
import { faCog, faFileSignature, faMap, faSearch, faHome, faUserSecret, faBoxOpen, faChartArea, faUserSlash } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.scss']
})
export class SiderComponent implements OnInit {

  fa = {
    cog: faCog,
    redactor: faFileSignature,
    map: faMap,
    search: faSearch,
    home: faHome,
    agent: faUserSecret,
    box: faBoxOpen,
    chart: faChartArea,
    ban: faUserSlash
  };

  constructor() {}

  ngOnInit(): void {
  }

}
