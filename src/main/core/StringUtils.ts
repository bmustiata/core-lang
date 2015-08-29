/**
 * <p>Utilities functions for string manipulations.</p>
 */

/**
 * A function that formats a String, using {0}, {1}, etc as arguments for formatting.
 * @param format
 * @param args
 * @returns {string}
 */
export function format(format: string, ...args) : string {
    // we're not doing regexp for performance reasons.
    var result : string = "",
        parameterIndex : number,
        foundToken : boolean = false,
        lastTokenFound : number = 0, // identifies the number AFTER the last token was found.
        j : number;

    for (var i = 0; i < format.length; i++) {
        if (format[i] == "{") { // might be a token
            foundToken = false;

            j = i + 1;

            while (format[j] != '}' && format[j] >= '0' && format[j] <= '9' && j < format.length) {
                j++;
            }

            if (j < format.length && format[j] == '}' && j - i > 1) { // if it actually ends with a bracket, and there are numbers
                foundToken = true;
            } else {
                i = j - 1; // no tokens until here.
                continue;
            }

            // since i and j land on brackets, make sure we cut the parameter right.
            parameterIndex = parseInt( format.substring(i + 1, j) );

            if (parameterIndex < args.length) {
                result += format.substring(lastTokenFound , i) +  args[parameterIndex];
            }

            lastTokenFound = j + 1;
        }
    }

    result += format.substring(lastTokenFound, format.length);

    return result;
}
