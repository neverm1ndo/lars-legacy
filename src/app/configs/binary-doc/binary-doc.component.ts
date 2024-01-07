import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConfigsService } from '@lars/configs/configs.service';
import { UserService } from '@lars/user/user.service';
import { faFileSignature, faSave, faTrash,  } from '@fortawesome/free-solid-svg-icons';
import { Workgroup } from '@lars/enums';
import { BehaviorSubject, Observable, map, merge, switchMap, of } from 'rxjs';
import { basename } from 'path';

interface BinaryDocStats {
  size: number;
  path: string;
  name: string;
  mime: string;
  lastm: Date;
}

@Component({
  selector: 'app-binary-doc',
  templateUrl: './binary-doc.component.html',
  styleUrls: ['./binary-doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BinaryDocComponent implements OnInit {

  public $stat: Observable<BinaryDocStats> = this._route.queryParams
                                                .pipe(
                                                  switchMap(({ path }: Params) => merge(
                                                          this._config.getFileInfo(path)
                                                                      .pipe(
                                                                        map((info) => ({ ...info, path, name: basename(path) }))
                                                                      ),
                                                          of(null)
                                                        ))
                                                );
  
  public fa = {
    conf: faFileSignature,
    save: faSave,
    del: faTrash
  }

  get userMainGroup(): Workgroup {
    return this._user.loggedInUser$.value.main_group;
  }

  get downloadProgress(): BehaviorSubject<number> {
    return this._config.dprogress$;
  }

  constructor(
    private _route: ActivatedRoute,
    private _config: ConfigsService,
    private _user: UserService,
    private _router: Router
  ) { }

  downloadFile(path: string) {
    this._config.downloadFile(path);
  }

  deleteFile(path: string) {
    this._config.deleteFile(path)
                .then(() => {
                  this._router.navigate(['/home/config-editor/empty'])
                });
  }

  ngOnInit(): void {
    this._config.stats$.next(null);
  }

}
