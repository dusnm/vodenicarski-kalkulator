/**
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2021 Dusan Mitrovic <dusan@dusanmitrovic.xyz>
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version. The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend  The above is the entire license notice
 * for the JavaScript code in this page.
 * 
 * @summary Vekovna nerešena misterija, konačno ima rešenje.
 */

/**
 * Za slučaj da se neko pravi pametan i promeni vrednosti.
 *  
 * @param {number} coeficient1 
 * @param {nuimber} coeficient2 
 * @param {number} limit 
 * 
 * @returns {boolean}
 */
const areCoeficientsOutOfBounds = (coeficient1, coeficient2, limit) => {
    return coeficient1 < 0 ||
           coeficient2 < 0 ||
           coeficient1 > limit ||
           coeficient2 > limit;
};

/**
 * Proverava da li je količina u ispravnom obliku
 * 
 * @param {any} value Vrednost koja se proverava
 * 
 * @returns {string|number}
 */
const validateInput = value => {
   const ERROR_INPUT_NAN = 'Количина мора бити број.'; 
   const ERROR_INPUT_NEGATIVE = 'Количина мора бити већа од, или једнака нули.';

   if (Number.isNaN(value) || typeof value !== 'number') {
       return ERROR_INPUT_NAN;
   }

   if (value < 0) {
       return ERROR_INPUT_NEGATIVE;
   }

   return 0;
};

/**
 * Vraća sve vrednosti u početno stanje
 * 
 * @param {HTMLFormElement} form 
 * @param {HTMLElement} output 
 */
const resetState = (form, output) => {
    form.reset();

    output.classList.remove(...[
        'white-text',
        'green',
        'red',
        'darken-1',
    ]);
};

/**
 * Vraća heš mapu, index => ime
 * 
 * @returns {Object}
 */
const getIndexToNameMap = () => ({
    0: 'воденица',
    1: 'камен',
    2: 'литра',
    3: 'дан',
    4: 'драм',
});

/**
 * Način računanja iz jedinice u jedinicu
 * 
 * @param {number} value vrednost za konverziju
 * @param {number} from jedinica iz koje se računa
 * @param {number} to jedinica u koju se računa
 * @param {Array<number>} conversionCoeficients koeficijenti za konverziju
 * 
 * @returns {number}
 */
const calculate = (value, from, to, conversionCoeficients) => {
    if (from === to) {
        return value;
    }

    if (from < to) {
        const result =  conversionCoeficients
            .slice(from, to)
            .reduce((current, next) => current * next) * value;

        return parseFloat(result.toFixed(2));
    }

    if (from > to) {
        const result = conversionCoeficients
            .map(coeficient => 1 / coeficient)
            .slice(to, from)
            .reduce((current, next) => current * next) * value

        return parseFloat(result.toFixed(2));
    }
};

const main = () => {
    const form = document.querySelector('#form');
    const selectElements = document.querySelectorAll('select');
    M.FormSelect.init(selectElements, {});

    form.addEventListener('submit', event => {
        event.preventDefault();

        // Ako je verovati narodnim legendama, ovi koeficijenti su ispravni
        const conversionCoeficients = [
            // 1 vodenica = 7 kamenova
            7,
            // 1 kamen = 4 litre
            4,
            // 1 litra = 7 dana
            7,
            // 1 dan = 1/0.07 drama
            1/0.07,
        ];

        const output = document.querySelector('#output');

        const value = parseFloat(
            document.querySelector('#value').value
        );

        const from = parseInt(
            document
                .querySelector('#fromUnit')
                .selectedIndex
        );

        const to = parseInt(
            document
                .querySelector('#toUnit')
                .selectedIndex
        );

        if (areCoeficientsOutOfBounds(from, to, conversionCoeficients.length)) {
            // Praviš se pametan/na? Dalje nečeš moći!
            resetState(form, output);

            return;
        }

        const validationResult = validateInput(value);

        if (validationResult !== 0) {
            resetState(form, output);

            output.classList.add(...[
                'white-text',
                'red',
                'darken-1',
            ]);
            output.innerHTML = validationResult;

            return;
        }


        const calculationResult = calculate(value, from, to, conversionCoeficients);
        const indexToNameMap = getIndexToNameMap();

        resetState(form, output);

        output.classList.add(...[
            'white-text',
            'green',
            'darken-1',
        ]);
        output.innerHTML = `${value} ${indexToNameMap[from]} = ${calculationResult} ${indexToNameMap[to]}`;
    });

};

document.addEventListener('DOMContentLoaded', () => {
    main();
});