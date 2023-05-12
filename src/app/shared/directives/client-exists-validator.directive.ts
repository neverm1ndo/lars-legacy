import { AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, from, map } from 'rxjs';
import { join } from 'path';
import { Stats } from 'fs';
import { Injector } from '@angular/core';
import { ElectronService } from '@lars/core/services';

const injector = Injector.create({ providers: [{ provide: ElectronService, deps: []}]});
const _electron: ElectronService = injector.get(ElectronService);

export function fileExistsValidator(filename: string): AsyncValidatorFn {

  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    
    const filePath: string = join(control.value, filename);

    const statPromise: Promise<Stats | NodeJS.ErrnoException> = new Promise((resolve, _reject) => {
      _electron.fs.stat(filePath, (err: NodeJS.ErrnoException, stats: Stats) => {
        if (err) return resolve(err)
                        resolve(stats);
      });
    });

    return from(statPromise)
            .pipe(
              map((res) => {
                if (res instanceof Stats) return null;
                return {
                  fileExistance: {
                    exists: false,
                    value: filename,
                  },
                };
              }),
            );
  };
}
