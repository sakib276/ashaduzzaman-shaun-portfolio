import { PortfolioModel }
    from "./models/portfolioModel.js";

import { PortfolioView }
    from "./views/portfolioView.js";

import { PortfolioController }
    from "./controllers/portfolioController.js";


/**
 * Application initialization.
 */
function initializeApplication() {

    const model =
        new PortfolioModel();

    const view =
        new PortfolioView();

    const controller =
        new PortfolioController(
            model,
            view
        );

    controller.init();
}


initializeApplication();