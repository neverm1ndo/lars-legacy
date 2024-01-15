import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function mapCorrectorValueValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return Number.isNaN(+control.value)
      ? { corrector: { value: control.value } }
      : null;
  };
}
