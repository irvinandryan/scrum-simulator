import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentSprintReview, getTotalWorkHourOfPb, isSimulationDone, getRemainingCost } from "../utils/Utils";
import { getScheduleStatus, getBudgetStatus, getCostPerformanceIndex, getReleaseDate, getSchedulePerformanceIndex } from "../utils/AgileEVM.js";


const SprintReview = () => {
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
                // navigate(`/simulation/${id}/report`);
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
                        {/* <div className="navbar-item">
                            <button
                                onClick={() => navigate(`editsimconfig`)}
                                className="button has-background-grey-lighter is-small">
                                <strong>Edit</strong>
                            </button>
                        </div> */}
                        <div className="navbar-item">
                            <button
                                onClick={() => navigate(`/simconfigslist`)}
                                className="button is-danger is-small">
                                <strong>Exit simulation</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="hero-body">
                <div className="container mt-5">
                <h2 className="subtitle has-text-centered"><strong>Sprint Review {currentSprint+1}</strong></h2>
                    <div className="columns mt-5 mb-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Release backlog ID</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[currentSprint].releaseBacklog.map((releaseBacklog) => (
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
                                    {sprintBacklog[currentSprint].sprintBacklogItem.map((sprintBacklogItem) => (
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
                <h2 className="subtitle has-text-centered"><strong>Product Backlog Summary</strong></h2>
                    <div className="columns mt-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Product backlog ID</th>
                                        <th>Story point</th>
                                        <th>Status</th>
                                        <th>Time spent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productBacklog.map((productBacklog) => (
                                        <tr>
                                            <td>{productBacklog.pbId}</td>
                                            <td>{productBacklog.pbPoint}</td>
                                            <td>{productBacklog.isPbDone ? "Done" : "Not done"}</td>
                                            <td>{getTotalWorkHourOfPb(productBacklog.pbId, sprintBacklog)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-one-half has-text-centered">
                            <button type="submit" className="button is-fullwidth is-info" onClick={() => handleNextSprint()}>
                                <strong>Next</strong>
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
                            Remaining cash: {(getRemainingCost(plannedCost, sprintBacklog)).toFixed(2)}
                        </h3>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default SprintReview;