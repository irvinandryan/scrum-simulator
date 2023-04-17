import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getCurrentSprint, getMaxScrumTeamWorkHour, getTotalSpending, getTotalSpendingThisSprint, getRemainingCost } from "../utils/Utils";
import { getScheduleStatus, getBudgetStatus, getCostPerformanceIndex, getReleaseDate, getSchedulePerformanceIndex } from "../utils/AgileEVM.js";

const SprintExecution = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [creator, setCreator] = useState("");
    const [scrumTeamSize, setScrumTeamSize] = useState("");
    const [scrumTeamRate, setScrumTeamRate] = useState("");
    const [scrumTeamHour, setScrumTeamHour] = useState("");
    const [plannedCost, setPlannedCost] = useState("");
    const [sprintLength, setSprintLength] = useState("");
    const [plannedSprint, setPlannedSprint] = useState("");
    const [startDate, setStartDate] = useState("");

    const [productBacklog, setProductBacklog] = useState([
        {
            pbId: String,
            pbPoint: Number,
            isPbDone: false,
        },
    ]);

    const [sprintBacklogItem, setSprintBacklogItem] = useState([
        {
            sbId: String,
            sbHour: Number,
            relatedPbId: String,
            isSbDone: false,
        },
    ]);

    const [releaseBacklog, setReleaseBacklog] = useState([
        {
            rbId: String,
            isRbDone: false,
        },
    ]);

    const [sprintBacklog, setSprintBacklog] = useState([
        {
            sprintId: String,
            releaseBacklog: [releaseBacklog],
            sprintBacklogItem: [sprintBacklogItem],
            sprintCost: Number,
            isSprintDone: false,
        },
    ]);

    useEffect(() => {
        getSimConfigById();
    }, []);

    const getSimConfigById = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API + `/simConfigs/${id}`);
            setCreator(response.data.creator);
            setScrumTeamSize(response.data.scrumTeamSize);
            setScrumTeamRate(response.data.scrumTeamRate);
            setScrumTeamHour(response.data.scrumTeamHour);
            setPlannedCost(response.data.plannedCost);
            setSprintLength(response.data.sprintLength);
            setPlannedSprint(response.data.plannedSprint);
            setStartDate(response.data.startDate);
            setProductBacklog(response.data.productBacklog);
            setSprintBacklog(response.data.sprintBacklog);
        }
        catch (error) {
            console.log(error);
            navigate("/*")
        }
    }

    const markItemDone = () => {
        let remainingCost = plannedCost - getTotalSpending(sprintBacklog);
        let maxScrumTeamWorkHour = getMaxScrumTeamWorkHour(scrumTeamSize, scrumTeamHour, sprintLength);
        for (let i = 0; i < sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem.length; i++) {
            if ((sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].isSbDone === false) 
                && (maxScrumTeamWorkHour >= sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].sbHour)
                && (remainingCost >= (sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].sbHour * scrumTeamRate))) {
                sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].isSbDone = true;
                maxScrumTeamWorkHour -= sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].sbHour;
                setSprintBacklog(sprintBacklog);
                sprintBacklog[getCurrentSprint(sprintBacklog)].sprintCost = getTotalSpendingThisSprint(sprintBacklog, scrumTeamRate);
                setSprintBacklog(sprintBacklog);
            }
        }
        for (let i = 0; i < productBacklog.length; i++) {
            let isProductBacklogDone = true;
            let isExist = false;
            for (let j = 0; j < sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem.length; j++) {
                if (productBacklog[i].pbId === sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[j].relatedPbId) {
                    isExist = true;
                    if (sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[j].isSbDone === false) {
                        isProductBacklogDone = false;
                        break;
                    }
                }
            }
            if (isProductBacklogDone === true && isExist === true) {
                for (let k = 0; k < sprintBacklog[getCurrentSprint(sprintBacklog)].releaseBacklog.length; k++) {
                    if (sprintBacklog[getCurrentSprint(sprintBacklog)].releaseBacklog[k].rbId === productBacklog[i].pbId) {
                        productBacklog[i].isPbDone = true;
                        setProductBacklog(productBacklog);
                        sprintBacklog[getCurrentSprint(sprintBacklog)].releaseBacklog[k].isRbDone = true;
                        setSprintBacklog(sprintBacklog);
                        break;
                    }
                }
            }
        }
        sprintBacklog[getCurrentSprint(sprintBacklog)].isSprintDone = true;
        setSprintBacklog(sprintBacklog);
    }

    const handleSprintExecution = async () => {
        markItemDone();
        try {
            await axios.patch(process.env.REACT_APP_API + `/simConfigs/${id}`, {
                scrumTeamSize,
                scrumTeamRate,
                scrumTeamHour,
                plannedCost,
                sprintLength,
                plannedSprint,
                startDate,
                productBacklog,
                sprintBacklog,
                releaseBacklog,
            });
            navigate(`/simconfigslist/simulation/${id}/sprintreview`);
        } catch (error) {
            console.log(error);
        }

    };

    window.onpopstate = () => {
        navigate(`/simconfigslist`);
    };

    return (
        <div className="hero is-fullheight">
            <nav className="navbar is-fixed-top has-background-dark is-dark is-transparent" aria-label="main navigation">
                <div id="navbar-info" className="navbar-menu">
                    <div className="navbar-start ml-2">
                        <h3 className="navbar-item">
                            Team size: {scrumTeamSize}
                        </h3>
                        <h3 className="navbar-item">
                            Rate / hour: {scrumTeamRate}
                        </h3>
                        <h3 className="navbar-item">
                            Work hour / day: {scrumTeamHour}
                        </h3>
                        <h3 className="navbar-item">
                            Planned cost: {plannedCost}
                        </h3>
                        <h3 className="navbar-item">
                            Num of sprint: {plannedSprint}
                        </h3>
                        <h3 className="navbar-item">
                            Days per sprint: {sprintLength}
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
                        </div>
                        <div className="navbar-item">
                            <button
                                onClick={() => navigate("/")}
                                className="button is-danger is-small">
                                <strong>Exit simulation</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="hero-body">
                <div className="container mt-5">
                <h2 className="subtitle has-text-centered"><strong>Sprint {getCurrentSprint(sprintBacklog)+1}</strong></h2>
                    <div className="columns mt-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Release backlog ID</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[getCurrentSprint(sprintBacklog)].releaseBacklog.map((releaseBacklog) => (
                                        <tr>
                                            <td>{releaseBacklog.rbId}</td>
                                            <td>{releaseBacklog.isRbDone ? "Done" : "Not done"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="column is-two-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Sprint backlog ID</th>
                                        <th>Hour needed</th>
                                        <th>Related product backlog</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem.map((sprintBacklogItem) => (
                                        <tr>
                                            <td>{sprintBacklogItem.sbId}</td>
                                            <td>{sprintBacklogItem.sbHour}</td>
                                            <td>{sprintBacklogItem.relatedPbId}</td>
                                            <td>{sprintBacklogItem.isSbDone ? "Done" : "Not done"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-one-half has-text-centered">
                            <button type="submit" className="button is-fullwidth is-info" onClick={() => handleSprintExecution()}>
                                <strong>Execute</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <nav className="navbar is-fixed-bottom has-background-dark is-dark is-transparent" aria-label="main navigation">
                <div id="navbar-info" className="navbar-menu">
                    <div className="navbar-brand m-auto">
                        <h3 className="navbar-item">
                            CPI: {parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(3)} - {getBudgetStatus(productBacklog, sprintBacklog, plannedCost)}
                        </h3>
                        <h3 className="navbar-item">
                            SPI: {(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3)} - {getScheduleStatus(productBacklog, sprintBacklog, plannedSprint, plannedCost)}
                        </h3>
                        <h3 className="navbar-item">
                            Release date: {getReleaseDate(productBacklog, sprintBacklog, plannedCost, startDate, sprintLength)}
                        </h3>
                        <h3 className="navbar-item">
                            Remaining cash: {getRemainingCost(plannedCost, sprintBacklog)}
                        </h3>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default SprintExecution;