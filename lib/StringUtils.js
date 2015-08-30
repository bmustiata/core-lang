/**
 * <p>Utilities functions for string manipulations.</p>
 */
/**
 * A function that formats a String, using {0}, {1}, etc as arguments for formatting.
 * @param format
 * @param args
 * @returns {string}
 */
function format(format) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    // we're not doing regexp for performance reasons.
    var result = "", parameterIndex, foundToken = false, lastTokenFound = 0, j;
    for (var i = 0; i < format.length; i++) {
        if (format[i] == "{") {
            foundToken = false;
            j = i + 1;
            while (format[j] != '}' && format[j] >= '0' && format[j] <= '9' && j < format.length) {
                j++;
            }
            if (j < format.length && format[j] == '}' && j - i > 1) {
                foundToken = true;
            }
            else {
                i = j - 1; // no tokens until here.
                continue;
            }
            // since i and j land on brackets, make sure we cut the parameter right.
            parameterIndex = parseInt(format.substring(i + 1, j));
            if (parameterIndex < args.length) {
                result += format.substring(lastTokenFound, i) + args[parameterIndex];
            }
            lastTokenFound = j + 1;
        }
    }
    result += format.substring(lastTokenFound, format.length);
    return result;
}
exports.format = format;
//# sourceMappingURL=StringUtils.js.map