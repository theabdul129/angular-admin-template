import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordStrengthValidator(commonWords: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const hasSpecial = /[\W_]+/.test(value);
    const isValidLength = value.length > 7;
    const containsCommonWord = commonWords.some(word => value.toLowerCase().includes(word.toLowerCase()));

    const passwordIsValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && isValidLength && !containsCommonWord;

    return !passwordIsValid ? { passwordStrength: true } : null;
  };
}
