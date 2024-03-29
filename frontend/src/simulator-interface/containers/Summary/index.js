import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentSprintReview, getTotalWorkHourOfPb, isSimulationDone, getSessionUsername, getTotalSpending, getProjectStatus } from "../../../simulation-handler/Utils";
import { getScheduleStatus, getBudgetStatus, getCostPerformanceIndex, getReleaseDate, getSchedulePerformanceIndex } from "../../../simulation-handler/AgileEVM.js";

const Summary = () => {
    const { id } = useParams();
    const token = localStorage.getItem("authToken");
    const navigate = useNavigate();
    const [creator, setCreator] = useState("");
    const [scrumTeamSize, setScrumTeamSize] = useState("");
    const [scrumTeamRate, setScrumTeamRate] = useState("");
    const [scrumTeamHour, setScrumTeamHour] = useState("");
    const [plannedCost, setPlannedCost] = useState("");
    const [sprintLength, setSprintLength] = useState("");
    const [plannedSprint, setPlannedSprint] = useState("");
    const [startDate, setStartDate] = useState("");
    const [currentSprint, setCurrentSprint] = useState(0);
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
            responseLog: [String],
        },
    ]);

    useEffect(() => {
        getSimConfigById();
    }, []);

    const getSimConfigById = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API + `/simconfigs/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
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
            setCurrentSprint(getCurrentSprintReview(response.data.sprintBacklog)-1);
            setEventProbability(response.data.eventProbability);
        }
        catch (error) {
            console.log(error);
            navigate("/*")
        }
    }

    const handleNextSprint = async () => {
        try {
            if (isSimulationDone(productBacklog, sprintBacklog, plannedCost)) {
                navigate(`/simconfigslist`)
            } else {
                navigate(`/simconfigslist/simulation/${id}/sprintplanning`);
            }
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
                            Welcome {getSessionUsername()}
                        </h3>
                    </div>
                    <div className="navbar-end mr-2">
                        <div className="navbar-item">
                            <button
                                onClick={handleNextSprint}
                                className="button is-danger is-small">
                                <strong>Exit</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="hero-body">
                <div className="container mt-5 mb-5">
                <h2 className="subtitle has-text-centered"><strong>Summary</strong></h2>
                    <div className="columns mb-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth" style={{border: `groove`}}>
                                <thead>
                                    <tr style={{backgroundColor: `lightsteelblue`}}>
                                        <th className="has-text-centered" colSpan="5">Project metrics</th>
                                    </tr>
                                </thead>
                                <thead>
                                    <tr style={{backgroundColor: `lightsteelblue`}}>
                                        <th>Project cost</th>
                                        <th>CPI</th>
                                        <th>SPI</th>
                                        <th>Release date</th>
                                        <th>Project status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{parseFloat(getTotalSpending(sprintBacklog)).toFixed(2)}</td>
                                        <td>{parseFloat(getCostPerformanceIndex(productBacklog, sprintBacklog, plannedCost)).toFixed(3)} - {getBudgetStatus(productBacklog, sprintBacklog, plannedCost)}</td>
                                        <td>{parseFloat(getSchedulePerformanceIndex(productBacklog, sprintBacklog, plannedSprint, plannedCost)).toFixed(3)} - {getScheduleStatus(productBacklog, sprintBacklog, plannedSprint, plannedCost)}</td>
                                        <td>{getReleaseDate(productBacklog, sprintBacklog, plannedCost, startDate, sprintLength, plannedSprint)}</td>
                                        <td>{getProjectStatus(productBacklog, sprintBacklog, plannedCost)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="columns mb-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth" style={{border: `groove`}}>
                                <thead>
                                    <tr>
                                        <th colSpan="4" className="has-text-centered" style={{backgroundColor: `lightsteelblue`}}>Product backlog</th>
                                    </tr>
                                </thead>
                                <thead>
                                    <tr style={{backgroundColor: `lightsteelblue`}}>
                                        <th>Product backlog ID</th>
                                        <th>Story point</th>
                                        <th>Time spent</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productBacklog.map((productBacklog) => (
                                        <tr>
                                            <td>{productBacklog.pbId}</td>
                                            <td>{productBacklog.pbPoint}</td>
                                            <td>{getTotalWorkHourOfPb(productBacklog.pbId, sprintBacklog)}</td>
                                            <td>{productBacklog.isPbDone ? "Done" : "Not done"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                {/* <h2 className="subtitle has-text-centered"><strong>Sprint Backlog Summary</strong></h2> */}
                    <div className="columns mb-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            {sprintBacklog.map((sprint) => (
                                <table className="table is-bordered is-striped has-background-white-ter is-fullwidth" style={{border: `groove`}}>
                                    <thead>
                                        <tr>
                                            <th colSpan="5" className="has-text-centered" style={{backgroundColor: `lightsteelblue`}}>Sprint {sprint.sprintId+1}</th>
                                        </tr>
                                        <tr>
                                            <th colSpan="2" style={{backgroundColor: `lightgray`}}>Cost</th>
                                            <th colSpan="3" style={{backgroundColor: `lightgray`}}>Time spent</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan="2">{parseFloat(sprint.sprintCost).toFixed(2)}</td>
                                            <td colSpan="3">{sprint.sprintTimeSpent}</td>
                                        </tr>
                                    </tbody>
                                    <thead>
                                        <tr>
                                            <th colSpan="2" style={{backgroundColor: `lightgray`}}>Release backlog ID</th>
                                            <th colSpan="3" style={{backgroundColor: `lightgray`}}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sprint.releaseBacklog.length === 0 ? (
                                            <tr>
                                                <td colSpan="2">-</td>
                                                <td colSpan="3">-</td>
                                                </tr>
                                        ) : (
                                            sprint.releaseBacklog.map((releaseBacklog) => (
                                                <tr>
                                                    <td colSpan="2">{releaseBacklog.rbId}</td>
                                                    <td colSpan="3">{releaseBacklog.isRbDone ? "Done" : "Not done"}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    <thead>
                                        <tr style={{backgroundColor: `lightgray`}}>
                                            <th>Sprint backlog ID</th>
                                            <th>Related product backlog</th>
                                            <th>Time needed</th>
                                            <th>Time spent</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sprint.sprintBacklogItem.length === 0 ? (
                                            <tr>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                                <td>-</td>
                                            </tr>
                                        ) : (
                                            sprint.sprintBacklogItem.map((sprintBacklogItem) => (
                                                <tr>
                                                    <td>{sprintBacklogItem.sbId}</td>
                                                    <td>{sprintBacklogItem.relatedPbId}</td>
                                                    <td>{sprintBacklogItem.sbPlannedHour}</td>
                                                    <td>{sprintBacklogItem.sbActualHour}</td>
                                                    <td>{sprintBacklogItem.isSbDone ? "Done" : "Not done"}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    <thead>
                                        <tr>
                                            <th colSpan="5" style={{backgroundColor: `lightgray`}}>Event log</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sprint.eventLog.length === 0 ? (
                                            <tr>
                                                <td className="has-text-centered" colSpan={5}>No event</td>
                                            </tr>
                                        ) : (
                                            sprint.eventLog.map((event, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td colSpan={5}>{event}</td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                    <thead>
                                        <tr>
                                            <th colSpan="5" style={{backgroundColor: `lightgray`}}>Action log</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sprint.responseLog.length === 0 ? (
                                            <tr>
                                                <td className="has-text-centered" colSpan={5}>No action</td>
                                            </tr>
                                        ) : (
                                            sprint.responseLog.map((response, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td colSpan={5}>{response}</td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            ))}
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-one-half has-text-centered">
                            <button type="submit" className="button is-fullwidth is-info" onClick={() => handleNextSprint()}>
                                <strong>Close</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Summary;