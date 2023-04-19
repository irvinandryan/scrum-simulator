import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isSimulationDone, getCurrentSprint, getSessionUsername } from "../../utils/Utils";

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
            sprintTimeSpent: Number,
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

    const handleContinue = () => {
        if (isSimulationDone(productBacklog, sprintBacklog, plannedCost)) {
            alert("This simulation has been completed.");
            navigate(`/simconfigslist/simulation/${id}/summary`);
        } else {
            if (sprintBacklog[getCurrentSprint(sprintBacklog)].isSprintDone === true) {
                navigate(`/simconfigslist/simulation/${id}/sprintreview`);
            } else {
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
                <div className="container mt-5 mb-5">
                {/* <h2 className="subtitle has-text-centered"><strong>Project Information</strong></h2> */}
                    <div className="columns mt-5 mb-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth" style={{border: `groove`}}>
                                <thead>
                                    <tr>
                                        <th colSpan="8" className="has-text-centered" style={{backgroundColor: `lightsteelblue`}}>Project information</th>
                                    </tr>
                                    <tr style={{backgroundColor: `lightgray`}}>
                                        <th>Team size</th>
                                        <th>Rate / hour</th>
                                        <th>Work hour / day</th>
                                        <th>Planned cost</th>
                                        <th>Days per sprint</th>
                                        <th>Num of sprint</th>
                                        <th>Release point</th>
                                        <th>Start date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{scrumTeamSize}</td>
                                        <td>{scrumTeamRate}</td>
                                        <td>{scrumTeamHour}</td>
                                        <td>{plannedCost}</td>
                                        <td>{sprintLength}</td>
                                        <td>{plannedSprint}</td>
                                        <td>{productBacklog.reduce((prev,next) => prev + next.pbPoint,0)}</td>
                                        <td>{startDate.split('T')[0]}</td>
                                    </tr>
                                </tbody>
                                <thead>
                                    <tr>
                                        <th colSpan="4" style={{backgroundColor: `lightgray`}}>Product backlog ID</th>
                                        <th colSpan="4" style={{backgroundColor: `lightgray`}}>Story point</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productBacklog.map((pb) => (
                                        <tr>
                                            <td colSpan="4">{pb.pbId}</td>
                                            <td colSpan="4">{pb.pbPoint}</td>
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