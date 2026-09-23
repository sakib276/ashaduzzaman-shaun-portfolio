/**
 * Portfolio view.
 *
 * Handles all DOM rendering operations.
 *
 * @class PortfolioView
 */
export class PortfolioView {

    /**
     * Renders profile information.
     *
     * @param {Object} profile Profile data.
     * @returns {void}
     */
    renderProfile(profile) {

        document.querySelector("#hero-name")
            .textContent = profile.name;

        document.querySelector("#hero-bio")
            .textContent = profile.bio;

        document.querySelector("#about-text")
            .textContent = profile.about;

        document.querySelector("#location")
            .textContent = profile.location;

        document.querySelector("#focus")
            .textContent = profile.focus;

        document.querySelector("#profile-image")
            .src = profile.image;

        document.querySelector("#experience-years")
            .textContent = profile.experienceYears;
    }


    /**
     * Renders experience information.
     *
     * @param {Array} experiences Experience list.
     * @returns {void}
     */
    renderExperience(experiences) {

        const container =
            document.querySelector(
                "#experience-container"
            );

        container.innerHTML = "";

        experiences.forEach((experience) => {

            const article =
                document.createElement("article");

            article.className = "experience-item";

            article.innerHTML = `
                <div class="experience-period">
                    ${experience.period}
                </div>

                <h3>
                    ${experience.position}
                </h3>

                <div class="experience-company">
                    ${experience.company}
                </div>

                <p class="experience-description">
                    ${experience.description}
                </p>
            `;

            container.appendChild(article);
        });
    }


    /**
     * Renders projects.
     *
     * @param {Array} projects Project list.
     * @returns {void}
     */
    renderProjects(projects) {

        const container =
            document.querySelector(
                "#projects-container"
            );

        container.innerHTML = "";

        projects.forEach((project, index) => {

            const article =
                document.createElement("article");

            article.className = "project-card";

            const technologies =
                project.technologies
                    .map(
                        (technology) =>
                            `<span>${technology}</span>`
                    )
                    .join("");

            article.innerHTML = `
                <div class="project-number">
                    0${index + 1}
                </div>

                <h3>
                    ${project.title}
                </h3>

                <p>
                    ${project.description}
                </p>

                <div class="project-tech">
                    ${technologies}
                </div>
            `;

            container.appendChild(article);
        });
    }


    /**
     * Renders education information.
     *
     * @param {Array} education Education list.
     * @returns {void}
     */
    renderEducation(education) {

        const container =
            document.querySelector(
                "#education-container"
            );

        container.innerHTML = "";

        education.forEach((item) => {

            const article =
                document.createElement("article");

            article.className = "education-item";

            article.innerHTML = `
                <div class="education-year">
                    ${item.year}
                </div>

                <h3>
                    ${item.degree}
                </h3>

                <div class="education-institution">
                    ${item.institution}
                </div>
            `;

            container.appendChild(article);
        });
    }


    /**
     * Renders contact information.
     *
     * @param {Object} contact Contact information.
     * @returns {void}
     */
    renderContact(contact) {

        const email =
            document.querySelector("#email");

        const contactEmail =
            document.querySelector("#contact-email");

        const emailSocial =
            document.querySelector(
                "#email-social-link"
            );

        const github =
            document.querySelector("#github-link");

        const linkedin =
            document.querySelector("#linkedin-link");


        email.textContent =
            contact.email;

        contactEmail.href =
            `mailto:${contact.email}`;

        emailSocial.href =
            `mailto:${contact.email}`;

        github.href =
            contact.github;

        linkedin.href =
            contact.linkedin;
    }


    /**
     * Renders current year in footer.
     *
     * @returns {void}
     */
    renderCurrentYear() {

        const year =
            new Date().getFullYear();

        document.querySelector(
            "#current-year"
        ).textContent = year;
    }
}