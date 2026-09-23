/**
 * Portfolio controller.
 *
 * Connects the model and view.
 *
 * @class PortfolioController
 */
export class PortfolioController {

    /**
     * Creates portfolio controller.
     *
     * @param {PortfolioModel} model Portfolio model.
     * @param {PortfolioView} view Portfolio view.
     */
    constructor(model, view) {

        this.model = model;

        this.view = view;
    }


    /**
     * Initializes portfolio application.
     *
     * @returns {void}
     */
    init() {

        const data =
            this.model.getData();

        this.view.renderProfile(
            data.profile
        );

        this.view.renderExperience(
            data.experience
        );

        this.view.renderProjects(
            data.projects
        );

        this.view.renderEducation(
            data.education
        );

        this.view.renderContact(
            data.contact
        );

        this.view.renderCurrentYear();
    }
}