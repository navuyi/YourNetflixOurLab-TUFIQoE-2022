/**
 * Removes whitespaces from given string
 * @param text
 * @returns {string}
 */
export const remove_whitespaces = (text : string) : string => {
    return text.replaceAll(/\s/g,'')
}