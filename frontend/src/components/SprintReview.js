import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentSprint, getTotalWorkHourOfPb, isSimulationDone } from "../utils/Utils";

const SprintExecution = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const handleNextSprint = async () => {
        try {
            if (isSimulationDone(productBacklog, sprintBacklog, plannedCost)) {
                // navigate(`/simulation/${id}/report`);
                navigate(`/`)
            } else {
                navigate(`/simulation/${id}/sprintplanning`);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="hero is-fullheight">
            <nav className="navbar is-fixed-top has-background-dark is-dark is-transparent" aria-label="main navigation">
                <div id="navbar-info" className="navbar-menu">
                    <div className="navbar-start ml-2">
                        <h3 className="navbar-item">
                            Team Size: {scrumTeamSize}
                        </h3>
                        <h3 className="navbar-item">
                            Rate / Hour: {scrumTeamRate}
                        </h3>
                        <h3 className="navbar-item">
                            Work Hour / Day: {scrumTeamHour}
                        </h3>
                        <h3 className="navbar-item">
                            Planned Cost: {plannedCost}
                        </h3>
                        <h3 className="navbar-item">
                            Num of Sprint: {plannedSprint}
                        </h3>
                        <h3 className="navbar-item">
                            Days per Sprint: {sprintLength}
                        </h3>
                        <h3 className="navbar-item">
                            Start Date: {startDate.split('T')[0]}
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
                                <strong>Exit Simulation</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="hero-body">
                <div className="container mt-5">
                <h2 className="subtitle has-text-centered"><strong>Sprint Review {getCurrentSprint(sprintBacklog)+1}</strong></h2>
                    <div className="columns mt-5 mb-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Release Backlog ID</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[getCurrentSprint(sprintBacklog)].releaseBacklog.map((releaseBacklog) => (
                                        <tr>
                                            <td>{releaseBacklog.rbId}</td>
                                            <td>{releaseBacklog.isRbDone ? "Done" : "Not Done"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="column is-two-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Sprint Backlog ID</th>
                                        <th>Hour Needed</th>
                                        <th>Related Product Backlog</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    {sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem.map((sprintBacklogItem) => (
                                        <tr>
                                            <td>{sprintBacklogItem.sbId}</td>
                                            <td>{sprintBacklogItem.sbHour}</td>
                                            <td>{sprintBacklogItem.relatedPbId}</td>
                                            <td>{sprintBacklogItem.isSbDone ? "Done" : "Not Done"}</td>
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
                                        <th>Product Backlog ID</th>
                                        <th>Story Point</th>
                                        <th>Status</th>
                                        <th>Time Spent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productBacklog.map((productBacklog) => (
                                        <tr>
                                            <td>{productBacklog.pbId}</td>
                                            <td>{productBacklog.pbPoint}</td>
                                            <td>{productBacklog.isPbDone ? "Done" : "Not Done"}</td>
                                            <td>{getTotalWorkHourOfPb(productBacklog.pbId, sprintBacklog)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* <div className="column is-two-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth">
                                <thead>
                                    <tr>
                                        <th>Sprint Backlog ID</th>
                                        <th>Hour Needed</th>
                                        <th>Related Product Backlog</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[getCurrentSprint(sprintBacklog)].sprintBacklogItem.map((sprintBacklogItem) => (
                                        <tr>
                                            <td>{sprintBacklogItem.sbId}</td>
                                            <td>{sprintBacklogItem.sbHour}</td>
                                            <td>{sprintBacklogItem.relatedPbId}</td>
                                            <td>{sprintBacklogItem.isSbDone ? "Done" : "Not Done"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div> */}
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
        </div>
    );
}

export default SprintExecution;