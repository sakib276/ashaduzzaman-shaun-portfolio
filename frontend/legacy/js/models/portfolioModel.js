/**
 * Portfolio data model.
 *
 * @class PortfolioModel
 */
export class PortfolioModel {

    /**
     * Creates the portfolio model.
     */
    constructor() {

        this.data = {

            profile: {

                name: "John Doe",

                bio:
                    "Passionate developer with experience " +
                    "building scalable web applications and " +
                    "crafting intuitive user experiences.",

                about:
                    "I am a passionate professional interested " +
                    "in technology, business, innovation and " +
                    "creating meaningful digital experiences.",

                location: "Denmark",

                focus: "Development & Design",

                image:
                    "assets/images/profile.png",

                experienceYears: "8+"

            },


            experience: [

                {
                    position: "Software Developer",

                    company: "ABC Company",

                    period: "2024 - Present",

                    description:
                        "Developing modern web applications " +
                        "and working with cross-functional teams."
                },

                {
                    position: "Junior Developer",

                    company: "XYZ Solutions",

                    period: "2022 - 2024",

                    description:
                        "Built responsive web interfaces " +
                        "and maintained existing applications."
                }

            ],


            projects: [

                {
                    title: "Portfolio CMS",

                    description:
                        "A dynamic portfolio management " +
                        "system for managing personal information.",

                    technologies: [
                        "HTML",
                        "CSS",
                        "JavaScript",
                        "Node.js"
                    ]
                },

                {
                    title: "LEFTOVER-LINK",

                    description:
                        "An entrepreneurial project focused " +
                        "on reducing food waste.",

                    technologies: [
                        "Research",
                        "Business",
                        "Management"
                    ]
                }

            ],


            education: [

                {
                    degree:
                        "Bachelor of Science",

                    institution:
                        "University Name",

                    year:
                        "2026"
                }

            ],


            contact: {

                email:
                    "john@example.com",

                github:
                    "#",

                linkedin:
                    "#"
            }
        };
    }


    /**
     * Returns portfolio data.
     *
     * @returns {Object} Portfolio information.
     */
    getData() {

        return this.data;
    }
}