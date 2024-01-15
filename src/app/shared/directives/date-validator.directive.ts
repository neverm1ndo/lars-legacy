import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value === "") return null;
    const date = Date.parse(control.value);
    return isNaN(date) ? { date: true, message: "Invalid date format" } : null;
  };
}
