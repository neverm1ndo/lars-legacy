import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigsService } from '../configs.service';
import { UserService } from '../user.service';
import { tap, switchMap } from 'rxjs/operators';
import { faInfo, faFileSignature, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-binary-doc',
  templateUrl: './binary-doc.component.html',
  styleUrls: ['./binary-doc.component.scss']
})
export class BinaryDocComponent implements OnInit {

  binStats: { size: number; mime: string; lastm: Date };
  path: string;
  fa = {
    conf: faFileSignature,
    save: faSave,
    del: faTrash
  }

  constructor(
    private route: ActivatedRoute,
    public config: ConfigsService,
    public user: UserService,
    private router: Router
  ) { }

  downloadFile() {
    this.config.downloadFile(this.path);
  }

  deleteFile() {
    this.config.deleteFile(this.path);
    this.router.navigate(['/home/config-editor/empty'])
  }

  ngOnInit(): void {
    this.route.queryParams
    .pipe(tap(params => { this.path = params.path; return params}))
    .pipe(switchMap(params => this.config.getFileInfo(params.path)))
    .subscribe((stats) => {
      this.binStats = stats;
    });
  }

}
