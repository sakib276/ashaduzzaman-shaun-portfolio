/**
 * Base URL for backend API.
 *
 * @constant
 */
const API_BASE_URL =
    "http://localhost:3000/api";


/**
 * Sends GET request to API.
 *
 * @param {string} endpoint API endpoint.
 * @returns {Promise<Object>} API response.
 */
export async function get(endpoint) {

    const response =
        await fetch(
            `${API_BASE_URL}${endpoint}`
        );

    if (!response.ok) {

        throw new Error(
            `Request failed: ${response.status}`
        );
    }

    return response.json();
}


/**
 * Sends POST request to API.
 *
 * @param {string} endpoint API endpoint.
 * @param {Object} data Request data.
 * @returns {Promise<Object>} API response.
 */
export async function post(endpoint, data) {

    const response =
        await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(data)
            }
        );

    if (!response.ok) {

        throw new Error(
            `Request failed: ${response.status}`
        );
    }

    return response.json();
}