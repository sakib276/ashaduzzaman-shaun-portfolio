/**
 * Creates an HTML element.
 *
 * @param {string} tag HTML tag name.
 * @param {string} className CSS class name.
 * @returns {HTMLElement} Created element.
 */
export function createElement(
    tag,
    className
) {

    const element =
        document.createElement(tag);

    if (className) {
        element.className = className;
    }

    return element;
}


/**
 * Escapes HTML special characters.
 *
 * @param {string} value Input text.
 * @returns {string} Safe text.
 */
export function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


/**
 * Scrolls smoothly to a section.
 *
 * @param {string} selector Target selector.
 * @returns {void}
 */
export function scrollToSection(selector) {

    const element =
        document.querySelector(selector);

    if (!element) {
        return;
    }

    element.scrollIntoView({
        behavior: "smooth"
    });
}