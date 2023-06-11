import React, { useState } from "react";
import { getCurrentSprint, getRemainingCost, getSessionUsername } from "../../simulation-handler/Utils.js"
import { getScheduleStatus, getBudgetStatus, getCostPerformanceIndex, getReleaseDate, getSchedulePerformanceIndex, addWorkingDays, getReleasePointCompleted, getActualCost, getEstimateToCompleteion } from "../../simulation-handler/AgileEVM.js"
import { Help } from "./Help.js";
import { Tooltip } from "react-tooltip";

export const NavBar = ({ sprintBacklog, scrumTeamSize, scrumTeamRate, scrumTeamHour, sprintLength, plannedSprint, plannedCost, startDate, navigate }) => {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const activeHelp = isHelpOpen ? "is-active" : "";
    const handleClickModalHelp = () => {
        setIsHelpOpen(!isHelpOpen);
    };
    return (
        <nav className="navbar is-fixed-top has-background-dark is-dark is-transparent" aria-label="main navigation">
            <div id="navbar-info" className="navbar-menu">
                <div className="navbar-start">
                    {sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize  === scrumTeamSize || scrumTeamSize === "" ? (
                        <h3 className="navbar-item"
                            data-tooltip-id="team-size-tooltip"
                            data-tooltip-content="The size of your development team">
                            Team size: {sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize}/{scrumTeamSize}
                        </h3>
                        ) : (
                        <h3 className="navbar-item has-text-white has-background-danger-dark"
                            data-tooltip-id="team-size-tooltip"
                            data-tooltip-content="The size of your development team">
                            Team size: {sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize}/{scrumTeamSize}
                        </h3>
                    )}
                    <h3 className="navbar-item"
                        data-tooltip-id="rate-hour-tooltip"
                        data-tooltip-content="The salary/hour for each of your team member">
                        Rate/hour: {scrumTeamRate}
                    </h3>
                    <h3 className="navbar-item"
                        data-tooltip-id="team-hour-tooltip"
                        data-tooltip-content="The maximum work hours/day for each of your team member">
                        Work hours/day: {scrumTeamHour}
                    </h3>
                    <h3 className="navbar-item"
                        data-tooltip-id="days-sprint-tooltip"
                        data-tooltip-content="Number of days in a sprint">
                        Days/sprint: {sprintLength}
                    </h3>
                    <h3 className="navbar-item"
                        data-tooltip-id="sprint-length-tooltip"
                        data-tooltip-content="Number of sprint in this project">
                        Planned sprint: {plannedSprint}
                    </h3>
                    <h3 className="navbar-item"
                        data-tooltip-id="planned-cost-tooltip"
                        data-tooltip-content="Your project budget">
                        Planned cost: {plannedCost}
                    </h3>
                    <h3 className="navbar-item"
                        data-tooltip-id="spending-tooltip"
                        data-tooltip-content="Cash that has been spent so far">
                        Spending: {parseFloat(getActualCost(sprintBacklog)).toFixed(2)}
                    </h3>
                    <h3 className="navbar-item"
                        data-tooltip-id="start-date-tooltip"
                        data-tooltip-content="Project start date">
                        Start date: {startDate.split('T')[0]}
                    </h3>
                </div>
                <div className="navbar-end mr-2">
                    <div className="navbar-item">
                        <button
                            onClick={() => handleClickModalHelp()}
                            className="button is-info is-small ml-2 mr-2">
                            <strong>Help</strong>
                        </button>
                        <button
                            onClick={() => navigate(`/simconfigslist`)}
                            className="button is-danger is-small">
                            <strong>Exit</strong>
                        </button>
                    </div>
                </div>
            </div>
            <Help active={activeHelp} handleClickModal={handleClickModalHelp} />
            <Tooltip id="team-size-tooltip" />
            <Tooltip id="rate-hour-tooltip" />
            <Tooltip id="team-hour-tooltip" />
            <Tooltip id="days-sprint-tooltip" />
            <Tooltip id="sprint-length-tooltip" />
            <Tooltip id="planned-cost-tooltip" />
            <Tooltip id="spending-tooltip" />
            <Tooltip id="start-date-tooltip" />
        </nav>
    )
}

export const NavBarReview = ({ sprintBacklog, scrumTeamSize, scrumTeamRate, scrumTeamHour, sprintLength, plannedSprint, plannedCost, startDate, navigate, currentSprint }) => {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const activeHelp = isHelpOpen ? "is-active" : "";
    const handleClickModalHelp = () => {
        setIsHelpOpen(!isHelpOpen);
    };
    return (
        <nav className="navbar is-fixed-top has-background-dark is-dark is-transparent" aria-label="main navigation">
            <div id="navbar-info" className="navbar-menu">
                <div className="navbar-start">
                    {sprintBacklog[currentSprint].currentTeamSize  === scrumTeamSize || scrumTeamSize === "" ? (
                        <h3 className="navbar-item"
                            data-tooltip-id="team-size-tooltip"
                            data-tooltip-content="The size of your development team">
                            Team size: {sprintBacklog[currentSprint].currentTeamSize}/{scrumTeamSize}
                        </h3>
                        ) : (
                        <h3 className="navbar-item has-text-white has-background-danger-dark"
                            data-tooltip-id="team-size-tooltip"
                            data-tooltip-content="The size of your development team">
                            Team size: {sprintBacklog[currentSprint].currentTeamSize}/{scrumTeamSize}
                        </h3>
                    )}
                    <h3 className="navbar-item"
                        data-tooltip-id="rate-hour-tooltip"
                        data-tooltip-content="The salary/hour for each of your team member">
                        Rate/hour: {scrumTeamRate}
                    </h3>
                    <h3 className="navbar-item"
                        data-tooltip-id="team-hour-tooltip"
                        data-tooltip-content="The maximum work hours/day for each of your team member">
                        Work hours/day: {scrumTeamHour}
                    </h3>
                    <h3 className="navbar-item"
                        data-tooltip-id="days-sprint-tooltip"
                        data-tooltip-content="Number of days in a sprint">
                        Days/sprint: {sprintLength}
                    </h3>
                    <h3 className="navbar-item"
                        data-tooltip-id="sprint-length-tooltip"
                        data-tooltip-content="Number of sprint in this project">
                        Planned sprint: {plannedSprint}
                    </h3>
                    <h3 className="navbar-item"
                        data-tooltip-id="planned-cost-tooltip"
                        data-tooltip-content="Your project budget">
                        Planned cost: {plannedCost}
                    </h3>
                    <h3 className="navbar-item"
                        data-tooltip-id="spending-tooltip"
                        data-tooltip-content="Cash that has been spent so far">
                        Spending: {parseFloat(getActualCost(sprintBacklog)).toFixed(2)}
                    </h3>
                    <h3 className="navbar-item"
                        data-tooltip-id="start-date-tooltip"
                        data-tooltip-content="Project start date">
                        Start date: {startDate.split('T')[0]}
                    </h3>
                </div>
                <div className="navbar-end mr-2">
                    <div className="navbar-item">
                        <button
                            onClick={() => handleClickModalHelp()}
                            className="button is-info is-small ml-2 mr-2">
                            <strong>Help</strong>
                        </button>
                        <button
                            onClick={() => navigate(`/simconfigslist`)}
                            className="button is-danger is-small">
                            <strong>Exit</strong>
                        </button>
                    </div>
                </div>
            </div>
            <Help active={activeHelp} handleClickModal={handleClickModalHelp} />
            <Tooltip id="team-size-tooltip" />
            <Tooltip id="rate-hour-tooltip" />
            <Tooltip id="team-hour-tooltip" />
            <Tooltip id="days-sprint-tooltip" />
            <Tooltip id="sprint-length-tooltip" />
            <Tooltip id="planned-cost-tooltip" />
            <Tooltip id="spending-tooltip" />
            <Tooltip id="start-date-tooltip" />
        </nav>
    )
}

export const EVMBar = ({ productBacklog, sprintBacklog, plannedCost, plannedSprint, startDate, sprintLength }) => {
    return (
        <nav className="navbar is-fixed-bottom has-background-dark is-dark is-transparent" aria-label="main navigation">
            <div id="navbar-info" className="navbar-menu">
                {parseFloat(getReleasePointCompleted(productBacklog)) !== 0 ? (
                    <div className="navbar-brand m-auto">
                        {parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item has-text-white"
                                data-tooltip-id="cpi-tooltip"
                                data-tooltip-content="CPI calculate the financial effectiveness of your project">
                                CPI: {parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(3)} - {getBudgetStatus(productBacklog, sprintBacklog, plannedCost)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark"
                                data-tooltip-id="cpi-tooltip"
                                data-tooltip-content="CPI calculate the financial effectiveness of your project based on AgileEVM">
                                CPI: {parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(3)} - {getBudgetStatus(productBacklog, sprintBacklog, plannedCost)}
                            </h3>
                        )}
                        {parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item"
                                data-tooltip-id="cost-complete-tooltip"
                                data-tooltip-content="The budget needed to complete your project based on AgileEVM">
                                Cost to complete: {parseFloat(getEstimateToCompleteion(productBacklog, sprintBacklog, plannedCost)).toFixed(2)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark"
                                data-tooltip-id="cost-complete-tooltip"
                                data-tooltip-content="The budget needed to complete your project based on AgileEVM">
                                Cost to complete: {parseFloat(getEstimateToCompleteion(productBacklog, sprintBacklog, plannedCost)).toFixed(2)}
                            </h3>
                        )}
                        {parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item"
                                data-tooltip-id="remaining-cash-tooltip"
                                data-tooltip-content="Cash that has not been spent">
                                Remaining cash : {parseFloat(getRemainingCost(plannedCost, sprintBacklog)).toFixed(2)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark"
                                data-tooltip-id="remaining-cash-tooltip"
                                data-tooltip-content="Cash that has not been spent">
                                Remaining cash : {parseFloat(getRemainingCost(plannedCost, sprintBacklog)).toFixed(2)}
                            </h3>
                        )}
                        {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item"
                                data-tooltip-id="spi-tooltip"
                                data-tooltip-content="SPI calculate the schedule effectiveness of your project based on AgileEVM">
                                SPI: {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3)} - {getScheduleStatus(productBacklog, sprintBacklog, plannedSprint, plannedCost)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark"
                                data-tooltip-id="spi-tooltip"
                                data-tooltip-content="SPI calculate the schedule effectiveness of your project based on AgileEVM">
                                SPI: {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3)} - {getScheduleStatus(productBacklog, sprintBacklog, plannedSprint, plannedCost)}
                            </h3>
                        )}
                        {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item"
                                data-tooltip-id="release-date-tooltip"
                                data-tooltip-content="Predicted release date based on AgileEVM">
                                Predicted release: {getReleaseDate(productBacklog, sprintBacklog, plannedCost, startDate, sprintLength, plannedSprint)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark"
                                data-tooltip-id="release-date-tooltip"
                                data-tooltip-content="Predicted release date based on AgileEVM">
                                Predicted release: {getReleaseDate(productBacklog, sprintBacklog, plannedCost, startDate, sprintLength, plannedSprint)}
                            </h3>
                        )}
                        {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item"
                                data-tooltip-id="planned-release-tooltip"
                                data-tooltip-content="Planned release date based on project plan">
                                Planned release: {addWorkingDays(startDate, plannedSprint * sprintLength)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark"
                                data-tooltip-id="planned-release-tooltip"
                                data-tooltip-content="Planned release date based on project plan">
                                Planned release: {addWorkingDays(startDate, plannedSprint * sprintLength)}
                            </h3>
                        )}
                    </div>
                    ) : (
                    <div className="navbar-brand m-auto">
                        <h3 className="navbar-item has-text-white"
                            data-tooltip-id="cpi-tooltip"
                            data-tooltip-content="CPI calculate the financial effectiveness of your project">
                            CPI: -
                        </h3>
                        <h3 className="navbar-item has-text-white"
                            data-tooltip-id="cost-complete-tooltip"
                            data-tooltip-content="The budget needed to complete your project based on AgileEVM">
                            Cost to complete: -
                        </h3>
                        <h3 className="navbar-item has-text-white"
                            data-tooltip-id="remaining-cash-tooltip"
                            data-tooltip-content="Cash that has not been spent">
                            Remaining cash : {parseFloat(getRemainingCost(plannedCost, sprintBacklog)).toFixed(2)}
                        </h3>
                        <h3 className="navbar-item has-text-white"
                            data-tooltip-id="spi-tooltip"
                            data-tooltip-content="SPI calculate the schedule effectiveness of your project based on AgileEVM">
                            SPI: -
                        </h3>
                        {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item"
                                data-tooltip-id="release-date-tooltip"
                                data-tooltip-content="Predicted release date based on AgileEVM">
                                Predicted release: {getReleaseDate(productBacklog, sprintBacklog, plannedCost, startDate, sprintLength, plannedSprint)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark"
                                data-tooltip-id="release-date-tooltip"
                                data-tooltip-content="Predicted release date based on AgileEVM">
                                Predicted release: {getReleaseDate(productBacklog, sprintBacklog, plannedCost, startDate, sprintLength, plannedSprint)}
                            </h3>
                        )}
                        {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item"
                                data-tooltip-id="planned-release-tooltip"
                                data-tooltip-content="Planned release date based on project plan">
                                Planned release: {addWorkingDays(startDate, plannedSprint * sprintLength)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark"
                                data-tooltip-id="planned-release-tooltip"
                                data-tooltip-content="Planned release date based on project plan">
                                Planned release: {addWorkingDays(startDate, plannedSprint * sprintLength)}
                            </h3>
                        )}
                    </div>
                    )
                }       
            </div>
            <Tooltip id="cpi-tooltip" />
            <Tooltip id="cost-complete-tooltip" />
            <Tooltip id="remaining-cash-tooltip" />
            <Tooltip id="spi-tooltip" />
            <Tooltip id="release-date-tooltip" />
            <Tooltip id="planned-release-tooltip" />
        </nav>
    )
}

export const NavBarHome = ({ navigate }) => {
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const activeHelp = isHelpOpen ? "is-active" : "";
    const handleClickModalHelp = () => {
        setIsHelpOpen(!isHelpOpen);
    };
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate(`/`);
    };
    return (    
        <nav className="navbar is-fixed-top has-background-dark is-dark is-transparent" aria-label="main navigation">
            <div id="navbar-info" className="navbar-menu">
                <div className="navbar-start ml-2">
                    <h3 className="navbar-item">
                        Welcome {getSessionUsername()}
                    </h3>
                </div>
                <div className="navbar-end mr-2">
                    <div className="navbar-item">
                        <button
                            onClick={() => handleClickModalHelp()}
                            className="button is-info is-small ml-2 mr-2">
                            <strong>Help</strong>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="button is-danger is-small">
                            <strong>Logout</strong>
                        </button>
                    </div>
                </div>
            </div>
            <Help active={activeHelp} handleClickModal={handleClickModalHelp} />
        </nav>
    )
}