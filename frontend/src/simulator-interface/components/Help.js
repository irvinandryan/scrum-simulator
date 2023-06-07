import React from "react";

export const Help = ({active, handleClickModal}) => {
    return (
        <div className="help">
            <div className={`modal ${active}`}>
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head has-background-grey-lighter has-text-centered">
                        <p class="modal-card-title has-text-black"><strong>Help</strong></p>
                        <button onClick={handleClickModal} class="delete" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body has-text-dark">
                        <h1 class="modal-card-title">How to start</h1>
                        <ol className="is-size-6 ml-6 has-text-justified">
                            <li>To start a simulation, create a new one using <strong>New simulation</strong> button (you can select any available simulation in your project list too).</li>
                            <li>Create a product backlog by adding product backlog items using <strong>Add product backlog</strong> button.</li>
                            <li>Determine the story point of each product backlog items by filling the <strong>Story point</strong> field.</li>
                            <li>Determine the number of people in your scrum team by filling the <strong>Team size</strong> field.</li>
                            <li>Determine the cost per hour of each person in your team by filling the <strong>Rate/hour</strong> field.</li>
                            <li>Determine the number of work hours per day of each person in your team by filling the <strong>Work hours/day</strong> field.</li>
                            <li>Determine the planned cost of your project by filling the <strong>Planned cost</strong> field.</li>
                            <li>Determine the number of days in a sprint by filling the <strong>Days/sprint</strong> field.</li>
                            <li>Determine the number of sprints in your project by filling the <strong>Planned sprint</strong> field.</li>
                            <li>Choose a start date of your project by clicking <strong>Pick a start date</strong>.</li>
                            <li>Determine the probability of simulation event by filling the <strong>Event probability</strong> field with any value between 0 and 1.</li>
                        </ol>
                        <br />
                        <h1 class="modal-card-title">Planning a Sprint</h1>
                        <ol className="is-size-6 ml-6 has-text-justified">
                            <li>Create a release backlog by choosing one or more product backlog items in the <strong>Select release backlog</strong> dropdown.</li>
                            <li>Add one or more sprint backlog items using the <strong>Add sprint backlog</strong> button.</li>
                            <li>Assign each sprint backlog item to a product backlog item listed in the <strong>Related product backlog</strong> dropdown.</li>
                            <li>Estimate the time needed to finish each sprint backlog items by filling the <strong>Hour needed</strong> field.</li>
                            <li>Check the <strong>Total hour</strong> and <strong>Total cost</strong>, make sure they don't exceed the capability of the scrum team and the remaining cash. Scrum team capability is determined by the maximum work hours allowed calculated using the following formula:</li>
                            <p><strong>Maximum work hours</strong> = <strong>Team size</strong> x <strong>Work hours/day</strong> x <strong>Days/sprint</strong></p>
                        </ol>
                        <br />
                        <h1 class="modal-card-title">Responding to an event</h1>
                        <ol className="is-size-6 ml-6 has-text-justified">
                            <li>Click the <strong>Edit</strong> button.</li>
                            <li>Update any of the following variables you find necessary:</li>
                            <ul className="ml-5" style={{listStyleType:"disc"}}>
                                <li><strong>Team size</strong></li>
                                <li><strong>Rate/hour</strong></li>
                                <li><strong>Work hours/day</strong></li>
                                <li><strong>Days/sprint</strong></li>
                                <li><strong>Planned sprint</strong></li>
                                <li><strong>Planned cost</strong></li>
                            </ul>
                        </ol>
                        <br />
                        <h1 class="modal-card-title">Glossary</h1>
                        <ul className="is-size-6 ml-6 has-text-justified" style={{listStyleType:"disc"}}>
                            <li><strong>CPI</strong>: Cost Performance Index</li>
                            <li><strong>Cost to complete</strong>: Cost needed to complete your project based on AgileEVM</li>
                            <li><strong>Days/sprint</strong>: Number of days in a sprint</li>
                            <li><strong>Planned cost</strong>: Planned project cost</li>
                            <li><strong>Planned release</strong>: Calculated project finish date based on <strong>Start date</strong> + (<strong>Days/sprint</strong> x <strong>Planned sprint</strong>) days, excluding Saturday and Sunday</li>
                            <li><strong>Planned sprint</strong>: Number of planned sprint</li>
                            <li><strong>Predicted release</strong>: Project finish date based on AgileEVM</li>
                            <li><strong>Rate/hour</strong>: Cost per hour of each person in your team</li>
                            <li><strong>Remaining cash</strong>: Remaining cash that can be used to complete your project</li>
                            <li><strong>SPI</strong>: Schedule Performance Index</li>
                            <li><strong>Spending</strong>: Total expenditure to date</li>
                            <li><strong>Start date</strong>: Project start date</li>
                            <li><strong>Team size</strong>: Number of people in your team</li>
                            <li><strong>Work hours/day</strong>: Maximum work hour of each person in your team</li>      
                        </ul>
                    </section>
                    <footer class="modal-card-foot has-background-grey-lighter buttons is-centered">
                        <button onClick={handleClickModal} class="button is-fullwidth has-background-dark has-text-white"><strong>Close</strong></button>
                    </footer>
                </div>
            </div>
        </div>
    )
}