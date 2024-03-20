/**
 * @fileoverview This file houses functions that can be used for
 * validation of form fields.
 *
 * Note that these functions should return a string error message
 * when they fail, and `undefined` when they pass.
 */

const SUCCESS = undefined;

export const hasLengthAtLeast = (value, values, minimumLength , selectedLanguage ) => {
    if (!value || value.length < minimumLength) {
        return selectedLanguage == 'en' ? `Must contain at least ${minimumLength} character(s).` : `Doit contenir au moins ${minimumLength} caractère(s).`;
    }
    return SUCCESS;
};

export const hasLengthAtMost = (value, values, maximumLength , selectedLanguage) => {
    if (value && value.length > maximumLength) {
        return selectedLanguage == 'en' ? `Must not exceed ${maximumLength} character(s).` : `Ne doit pas dépasser ${maximumLength} caractère(s).`;
    }
    return SUCCESS;
};

export const hasLengthExactly = (value, values, length , selectedLanguage ) => {
    if (value && value.length !== length) {
        return selectedLanguage == 'en' ?  `Must contain exactly ${length} character(s).` : `Doit contenir exactement ${length} caractère(s).`;
    }
    return SUCCESS;
};

/**
 * isRequired is provided here for convenience but it is inherently ambiguous and therefore we don't recommend using it.
 * Consider using more specific validators such as `hasLengthAtLeast` or `mustBeChecked`.
 */
export const isRequired = (value , selectedLanguage ) => {
    const FAILURE = selectedLanguage == 'en' ? 'Is required.' : 'Est requis.' ;

    // The field must have a value (no null or undefined) and
    // if it's a boolean, it must be `true`.
    if (!value) return FAILURE;

    // If it is a number or string, it must have at least one character of input (after trim).
    const stringValue = String(value).trim();
    const measureResult = hasLengthAtLeast(stringValue, null, 1);

    if (measureResult) return FAILURE;
    return SUCCESS;
};

export const mustBeChecked = (value , selectedLanguage )  => {
    if (!value) return  selectedLanguage == 'en' ? 'Must be checked.' : 'Doit être vérifié.';

    return SUCCESS;
};

export const validatePassword = (value , selectedLanguage ) => {
    const count = {
        lower: 0,
        upper: 0,
        digit: 0,
        special: 0
    };
    if (typeof value !== 'undefined') {
        for (const char of value) {
            if (/[a-z]/.test(char)) count.lower++;
            else if (/[A-Z]/.test(char)) count.upper++;
            else if (/\d/.test(char)) count.digit++;
            else if (/\S/.test(char)) count.special++;
        }
    }

    if (Object.values(count).filter(Boolean).length < 3) {
        return selectedLanguage == 'en' ? 'A password must contain at least 3 of the following: lowercase, uppercase, digits, special characters.' : 'Un mot de passe doit contenir au moins 3 des éléments suivants : minuscules, majuscules, chiffres, caractères spéciaux.';
    }

    return SUCCESS;
};

export const validateConfirmPassword = (
    value,
    values,
    passwordKey = 'password' ,
    selectedLanguage
) => {
    console.log(values);
    return value === values[passwordKey] ? SUCCESS  : selectedLanguage == 'en' ? 'Passwords must match.' : 'Les mots de passe doivent correspondre.';
};

/***
 * Adding new validators
 */

export const validateEmail = ( value, selectedLanguage ) => {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return regex.test(value)
        ? SUCCESS
        :  selectedLanguage == 'en' ? 'Please enter a valid email address (Ex: johndoe@domain.com).' : 'Veuillez saisir une adresse e-mail valide (Ex : johndoe@domain.com).' ;
};

export const validateNewConfirmPassword = (
    value,
    values,
    passwordKey = 'new_password',
    selectedLanguage
) => {
    return value === values[passwordKey] ? SUCCESS : selectedLanguage == 'en' ? 'Passwords must match.' : 'Les mots de passe doivent correspondre.';
};
