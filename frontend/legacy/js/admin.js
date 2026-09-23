/**
 * Handles profile form submission.
 *
 * @param {SubmitEvent} event Form submit event.
 * @returns {void}
 */
function handleProfileSubmit(event) {

    event.preventDefault();

    alert(
        "Profile will be saved to the database later."
    );
}


/**
 * Handles project form submission.
 *
 * @param {SubmitEvent} event Form submit event.
 * @returns {void}
 */
function handleProjectSubmit(event) {

    event.preventDefault();

    alert(
        "Project will be saved to the database later."
    );
}


/**
 * Handles experience form submission.
 *
 * @param {SubmitEvent} event Form submit event.
 * @returns {void}
 */
function handleExperienceSubmit(event) {

    event.preventDefault();

    alert(
        "Experience will be saved to the database later."
    );
}


document
    .querySelector("#profile-form")
    .addEventListener(
        "submit",
        handleProfileSubmit
    );

document
    .querySelector("#project-form")
    .addEventListener(
        "submit",
        handleProjectSubmit
    );

document
    .querySelector("#experience-form")
    .addEventListener(
        "submit",
        handleExperienceSubmit
    );