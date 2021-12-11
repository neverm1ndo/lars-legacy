import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function mapCorrectorValueValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return +control.value !== NaN ? {corrector: { value: control.value }} : null;
  };
}
