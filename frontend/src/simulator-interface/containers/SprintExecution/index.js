import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentSprint, getMaxScrumTeamWorkHour, getTotalSpendingThisSprint, getRemainingCost, getRandomBoolean, getTotalWorkHourOfSprint, getTotalPlannedSpendingThisSprint, getTotalPlannedWorkHourOfSprint, getCurrentSprintReview } from "../../../simulation-handler/Utils";
import { doEventSprintReview } from "../../../simulation-handler/EventHandler";
import { NavBar, EVMBar } from "../../components/NavBar";
import { getSimConfigByIdAPI, updateSimConfigAPI } from "../../../simulator-api/SimulatorApi";

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
    const [eventProbability, setEventProbability] = useState("");

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
            sbPlannedHour: Number,
            sbActualHour: Number,
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
            currentTeamSize: Number,
            sprintTimeSpent: Number,
            isSprintDone: false,
            eventLog: [String],
        },
    ]);

    useEffect(() => {
        getSimConfigById();
    }, []);

    const getSimConfigById = async () => {
        getSimConfigByIdAPI(id, setCreator, setScrumTeamSize, setScrumTeamRate, setScrumTeamHour, setPlannedCost, setSprintLength, setPlannedSprint, setProductBacklog, setSprintBacklog, setStartDate, setEventProbability, navigate);
    }

    const markItemDone = () => {
        let maxScrumTeamWorkHour = getMaxScrumTeamWorkHour(sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize, scrumTeamHour, sprintLength);
        for (let i = 0; i < sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem.length; i++) {
            if ((sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].isSbDone === false)) {
                    if ((maxScrumTeamWorkHour >= sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].sbPlannedHour)) {
                        sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].isSbDone = true;
                        sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].sbActualHour = sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].sbPlannedHour;
                    }
                    if ((maxScrumTeamWorkHour < sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].sbPlannedHour)) {
                        sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].sbActualHour = maxScrumTeamWorkHour;
                    }
                    maxScrumTeamWorkHour -= sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem[i].sbActualHour;
            }
        }
        sprintBacklog[getCurrentSprint(sprintBacklog)].sprintCost = getTotalSpendingThisSprint(sprintBacklog, scrumTeamRate);
        sprintBacklog[getCurrentSprint(sprintBacklog)].sprintTimeSpent =  getTotalWorkHourOfSprint(sprintBacklog);
        setSprintBacklog(sprintBacklog);
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
    };

    const handleSprintExecution = async () => {
        let sum = 0;
        sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem.forEach((item) => {
            sum += parseInt(item.sbPlannedHour);
        });
        if (sum > (sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize * scrumTeamHour * sprintLength)) {
            alert("Warning! Total planned work hours of sprint backlog items is greater than maximum work hours of scrum team");
            return;
        }
        if (parseFloat(getRemainingCost(plannedCost, sprintBacklog)) < parseFloat(getTotalPlannedSpendingThisSprint(sprintBacklog, scrumTeamRate))) {
            alert("Warning! Total spending cannot be greater than remaining cash");
            return;
        }
        markItemDone();
        doEventSprintReview(sprintBacklog, productBacklog, plannedCost, setSprintBacklog, setProductBacklog, eventProbability);
        updateSimConfigAPI(id, scrumTeamSize, scrumTeamRate, scrumTeamHour, plannedCost, sprintLength, plannedSprint, productBacklog, sprintBacklog, startDate, releaseBacklog, eventProbability, navigate);
        navigate(`/simconfigslist/simulation/${id}/sprintreview`);
    };

    window.onpopstate = () => {
        navigate(`/simconfigslist`);
    };

    return (
        <div className="hero is-fullheight">
            <EVMBar
                productBacklog={productBacklog}
                sprintBacklog={sprintBacklog}
                plannedCost={plannedCost}
                plannedSprint={plannedSprint}
                startDate={startDate}
                sprintLength={sprintLength}
            />
            <NavBar
                sprintBacklog={sprintBacklog}
                scrumTeamSize={scrumTeamSize}
                scrumTeamRate={scrumTeamRate}
                scrumTeamHour={scrumTeamHour}
                plannedCost={plannedCost}
                sprintLength={sprintLength}
                plannedSprint={plannedSprint}
                startDate={startDate}
                navigate={navigate}
            />
            <div className="hero-body">
                <div className="container mt-5 mb-5">
                <h2 className="subtitle has-text-centered"><strong>Sprint Execution</strong></h2>
                <div className="columns mb-5 is-full has-background-white-ter">
                    <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth" style={{border: `groove`}}>
                                <thead>
                                    <tr style={{backgroundColor: `lightsteelblue`}}>
                                        <th className="has-text-centered">Sprint {getCurrentSprint(sprintBacklog) + 1} event</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[getCurrentSprint(sprintBacklog)].eventLog.length === 0 ? (
                                        <tr>
                                            <td className="has-text-centered">No event</td>
                                        </tr>
                                    ) : (
                                        sprintBacklog[getCurrentSprint(sprintBacklog)].eventLog.map((event, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{event}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="columns mb-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth" style={{border: `groove`}}>
                                <thead>
                                    <tr>
                                        <th colSpan="4" className="has-text-centered" style={{backgroundColor: `lightsteelblue`}}>Sprint {getCurrentSprint(sprintBacklog)+1} backlog</th>
                                    </tr>
                                    <tr>
                                        <th colSpan="2" style={{backgroundColor: `lightgray`}}>Planned sprint cost</th>
                                        <th colSpan="2" style={{backgroundColor: `lightgray`}}>Time needed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={2}>{parseFloat(getTotalPlannedSpendingThisSprint(sprintBacklog, scrumTeamRate)).toFixed(2)}</td>
                                        <td colSpan={2}>{parseFloat(getTotalPlannedWorkHourOfSprint(sprintBacklog))}</td>
                                    </tr>
                                </tbody>
                                <thead>
                                    <tr>
                                        <th colSpan="2" style={{backgroundColor: `lightgray`}}>Release backlog ID</th>
                                        <th colSpan="2" style={{backgroundColor: `lightgray`}}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[getCurrentSprint(sprintBacklog)].releaseBacklog.map((releaseBacklog) => (
                                        <tr>
                                            <td colSpan="2">{releaseBacklog.rbId}</td>
                                            <td colSpan="2">{releaseBacklog.isRbDone ? "Done" : "Not done"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <thead>
                                    <tr style={{backgroundColor: `lightgray`}}>
                                        <th>Sprint backlog ID</th>
                                        <th>Related product backlog</th>
                                        <th>Time needed</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem.map((sprintBacklogItem) => (
                                        <tr>
                                            <td>{sprintBacklogItem.sbId}</td>
                                            <td>{sprintBacklogItem.relatedPbId}</td>
                                            <td>{sprintBacklogItem.sbPlannedHour}</td>
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
        </div>
    );
}

export default SprintExecution;