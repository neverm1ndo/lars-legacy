import { Component, OnInit, HostListener } from '@angular/core';
import { faFolder, faSearch, faSearchPlus, faUpload } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  help: boolean = true;
   license: boolean;
   innerHeight: number;
   version: string = '1.0';

   fa = {
     dir: faFolder,
     search: faSearch,
     searchp: faSearchPlus,
     up: faUpload
   }

   @HostListener('window:resize', ['$event'])
     onResize() {
       this.innerHeight = window.innerHeight;
     }

  constructor() { }

  ngOnInit(): void {
    this.innerHeight = window.innerHeight;
  }

}
