import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isSimulationDone, getCurrentSprint, getSessionUsername } from "../utils/Utils";

const SelectSimConfig = () => {
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

    useEffect(() => {
        getSimConfigById();
    }, []);

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
            navigate("/*");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate(`/`);
    };

    // if issprintdone is false but releasebacklog is not empty then navigate to sprintexecution
    const handleContinue = () => {
        if (isSimulationDone(productBacklog, sprintBacklog, plannedCost)) {
            alert("This simulation has been completed.");
            navigate(`/simconfigslist/simulation/${id}/sprintreview`);
        } else {
            if (sprintBacklog[getCurrentSprint(sprintBacklog)].isSprintDone === true) {
                navigate(`/simconfigslist/simulation/${id}/sprintreview`);
            } else {
                // if current sprint is not done but releasebacklog is not empty navigate to sprintexecution
                if (sprintBacklog[getCurrentSprint(sprintBacklog)].releaseBacklog.length > 0) {
                    navigate(`/simconfigslist/simulation/${id}/sprintexecution`);
                } else {
                    navigate(`/simconfigslist/simulation/${id}/sprintplanning`);
                }
            }
        }
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
                                onClick={handleLogout}
                                className="button is-danger is-small">
                                <strong>Logout</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            <div className="hero-body">
                <div className="container">
                {/* <h2 className="subtitle has-text-centered">Selected</h2> */}
                    <div className="columns mt-5 has-background-white-ter">
                        <div className="column is-one-half has-text-centered">
                            <div className="column is-one-half has-text-centered">
                                <h2 className="subtitle">Team size: {scrumTeamSize}</h2>
                                <h2 className="subtitle">Rate / hour: {scrumTeamRate}</h2>
                                <h2 className="subtitle">Work hour / day: {scrumTeamHour}</h2>
                                <h2 className="subtitle">Planned cost: {plannedCost}</h2>
                                <h2 className="subtitle">Sprint length: {sprintLength}</h2>
                                <h2 className="subtitle">Days per sprint: {plannedSprint}</h2>
                                <h2 className="subtitle">Start date: {startDate.split('T')[0]}</h2>
                            </div>
                        </div>
                        <div className="column is-one-half">
                            <table className="table is-striped has-background-white-ter is-fullwidth mt-2">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Story point</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productBacklog.map((pb) => (
                                        <tr>
                                            <td>{pb.pbId}</td>
                                            <td>{pb.pbPoint}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-one-half has-text-centered">
                            <Link to={`/simconfigslist`}  className="button is-danger is-fullwidth">
                                <strong>Cancel</strong>
                            </Link>
                        </div>
                        <div className="column is-one-half has-text-centered">
                            <button className="button is-info is-fullwidth" onClick={handleContinue}>
                                <strong>Continue</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectSimConfig;