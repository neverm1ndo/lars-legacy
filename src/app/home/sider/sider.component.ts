import { Component, OnInit } from '@angular/core';
import { faCog, faFileSignature, faMap, faSearch, faHome, faGavel, faUserSecret, faBoxOpen, faChartArea } from '@fortawesome/free-solid-svg-icons'

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
    gavel: faGavel,
    agent: faUserSecret,
    box: faBoxOpen,
    chart: faChartArea
  };

  constructor() {}

  ngOnInit(): void {
  }

}
