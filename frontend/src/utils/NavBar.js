import React, { useState } from "react";
import { getCurrentSprint, getRemainingCost } from "./Utils.js"
import { getScheduleStatus, getBudgetStatus, getCostPerformanceIndex, getReleaseDate, getSchedulePerformanceIndex, addWorkingDays, getEstimateAtCompletion, getReleasePointCompleted, getActualCost, getEstimateToCompleteion } from "./AgileEVM.js"
import { Help } from "./Help.js";

export const NavBar = ({ sprintBacklog, scrumTeamSize, scrumTeamRate, scrumTeamHour, sprintLength, plannedSprint, plannedCost, startDate, navigate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const active = isModalOpen ? "is-active" : "";
    const handleClickModal = () => {
        setIsModalOpen(!isModalOpen);
    };  
    return (
        <nav className="navbar is-fixed-top has-background-dark is-dark is-transparent" aria-label="main navigation">
            <div id="navbar-info" className="navbar-menu">
                <div className="navbar-start">
                    {sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize  === scrumTeamSize ? (
                        <h3 className="navbar-item">
                            Team size: {sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize}/{scrumTeamSize}
                        </h3>
                        ) : (
                        <h3 className="navbar-item has-text-white has-background-danger-dark">
                            Team size: {sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize}/{scrumTeamSize}
                        </h3>
                    )}
                    <h3 className="navbar-item">
                        Rate/hour: {scrumTeamRate}
                    </h3>
                    <h3 className="navbar-item">
                        Work hour/day: {scrumTeamHour}
                    </h3>
                    <h3 className="navbar-item">
                        Days per sprint: {sprintLength}
                    </h3>
                    <h3 className="navbar-item">
                        Num of sprint: {plannedSprint}
                    </h3>
                    <h3 className="navbar-item">
                        Planned cost: {plannedCost}
                    </h3>
                    <h3 className="navbar-item">
                        Spending: {parseFloat(getActualCost(sprintBacklog)).toFixed(2)}
                    </h3>
                    <h3 className="navbar-item">
                        Start date: {startDate.split('T')[0]}
                    </h3>
                </div>
                <div className="navbar-end mr-2">
                    <div className="navbar-item">
                        <button
                            onClick={() => navigate(`editsimconfig`)}
                            className="button has-background-grey-lighter is-small">
                            <strong>Edit</strong>
                        </button>
                        <button
                            onClick={() => handleClickModal()}
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
            <Help active={active} handleClickModal={handleClickModal} />
        </nav>
    )
}

export const NavBarReview = ({ sprintBacklog, scrumTeamSize, scrumTeamRate, scrumTeamHour, sprintLength, plannedSprint, plannedCost, startDate, navigate, currentSprint }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const active = isModalOpen ? "is-active" : "";
    const handleClickModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    return (
        <nav className="navbar is-fixed-top has-background-dark is-dark is-transparent" aria-label="main navigation">
            <div id="navbar-info" className="navbar-menu">
                <div className="navbar-start">
                    {sprintBacklog[currentSprint].currentTeamSize  === scrumTeamSize ? (
                        <h3 className="navbar-item">
                            Team size: {sprintBacklog[currentSprint].currentTeamSize}/{scrumTeamSize}
                        </h3>
                        ) : (
                        <h3 className="navbar-item has-text-white has-background-danger-dark">
                            Team size: {sprintBacklog[currentSprint].currentTeamSize}/{scrumTeamSize}
                        </h3>
                    )}
                    <h3 className="navbar-item">
                        Rate/hour: {scrumTeamRate}
                    </h3>
                    <h3 className="navbar-item">
                        Work hour/day: {scrumTeamHour}
                    </h3>
                    <h3 className="navbar-item">
                        Days per sprint: {sprintLength}
                    </h3>
                    <h3 className="navbar-item">
                        Num of sprint: {plannedSprint}
                    </h3>
                    <h3 className="navbar-item">
                        Planned cost: {plannedCost}
                    </h3>
                    <h3 className="navbar-item">
                        Spending: {parseFloat(getActualCost(sprintBacklog)).toFixed(2)}
                    </h3>
                    <h3 className="navbar-item">
                        Start date: {startDate.split('T')[0]}
                    </h3>
                </div>
                <div className="navbar-end mr-2">
                    <div className="navbar-item">
                        <button
                            onClick={() => navigate(`editsimconfig`)}
                            className="button has-background-grey-lighter is-small">
                            <strong>Edit</strong>
                        </button>
                        <button
                            onClick={() => handleClickModal()}
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
            <Help active={active} handleClickModal={handleClickModal} />
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
                            <h3 className="navbar-item has-text-white">
                                CPI: {parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(3)} - {getBudgetStatus(productBacklog, sprintBacklog, plannedCost)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark">
                                CPI: {parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(3)} - {getBudgetStatus(productBacklog, sprintBacklog, plannedCost)}
                            </h3>
                        )}
                        {/* {parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item">
                                Predicted cost: {parseFloat(getEstimateAtCompletion(productBacklog, sprintBacklog, plannedCost)).toFixed(2)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark">
                                Predicted cost: {parseFloat(getEstimateAtCompletion(productBacklog, sprintBacklog, plannedCost)).toFixed(2)}
                            </h3>
                        )} */}
                        {parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item">
                                Cost to complete: {parseFloat(getEstimateToCompleteion(productBacklog, sprintBacklog, plannedCost)).toFixed(2)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark">
                                Cost to complete: {parseFloat(getEstimateToCompleteion(productBacklog, sprintBacklog, plannedCost)).toFixed(2)}
                            </h3>
                        )}
                        {parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item">
                                Remaining cash : {parseFloat(getRemainingCost(plannedCost, sprintBacklog)).toFixed(2)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark">
                                Remaining cash : {parseFloat(getRemainingCost(plannedCost, sprintBacklog)).toFixed(2)}
                            </h3>
                        )}
                        {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item">
                                SPI: {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3)} - {getScheduleStatus(productBacklog, sprintBacklog, plannedSprint, plannedCost)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark">
                                SPI: {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3)} - {getScheduleStatus(productBacklog, sprintBacklog, plannedSprint, plannedCost)}
                            </h3>
                        )}
                        {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item">
                                Predicted release: {getReleaseDate(productBacklog, sprintBacklog, plannedCost, startDate, sprintLength, plannedSprint)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark">
                                Predicted release: {getReleaseDate(productBacklog, sprintBacklog, plannedCost, startDate, sprintLength, plannedSprint)}
                            </h3>
                        )}
                        {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item">
                                Planned release: {addWorkingDays(startDate, plannedSprint * sprintLength)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark">
                                Planned release: {addWorkingDays(startDate, plannedSprint * sprintLength)}
                            </h3>
                        )}
                    </div>
                    ) : (
                    <div className="navbar-brand m-auto">
                        <h3 className="navbar-item has-text-white">
                            CPI: -
                        </h3>
                        {/* <h3 className="navbar-item has-text-white">
                            Predicted cost: -
                        </h3> */}
                        <h3 className="navbar-item has-text-white">
                            Cost to complete: -
                        </h3>
                        <h3 className="navbar-item has-text-white">
                            Remaining cash : {parseFloat(getRemainingCost(plannedCost, sprintBacklog)).toFixed(2)}
                        </h3>
                        <h3 className="navbar-item has-text-white">
                            SPI: -
                        </h3>
                        {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item">
                                Predicted release: {getReleaseDate(productBacklog, sprintBacklog, plannedCost, startDate, sprintLength, plannedSprint)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark">
                                Predicted release: {getReleaseDate(productBacklog, sprintBacklog, plannedCost, startDate, sprintLength, plannedSprint)}
                            </h3>
                        )}
                        {parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3) >= 1 ? (
                            <h3 className="navbar-item">
                                Planned release: {addWorkingDays(startDate, plannedSprint * sprintLength)}
                            </h3>
                        ) : (
                            <h3 className="navbar-item has-text-white has-background-danger-dark">
                                Planned release: {addWorkingDays(startDate, plannedSprint * sprintLength)}
                            </h3>
                        )}
                    </div>
                    )
                }       
            </div>
        </nav>
    )
}
