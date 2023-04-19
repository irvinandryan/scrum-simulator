import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getSessionUsername } from "../utils/Utils";

const SimConfigList = () => {
    const [simConfig, setSimConfig] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getSimConfig();
    }, []);

    const getSimConfig = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/simConfigs")
        const filteredSimConfig = response.data.filter(simConfig => simConfig.creator === getSessionUsername());
        setSimConfig(filteredSimConfig);
    }

    const deleteSimConfig = async (id) => {
        try {
            await axios.delete(process.env.REACT_APP_API + `/simConfigs/${id}`)
            getSimConfig();
        } catch (error) {
            console.log(error);
        }
    };

    window.onpopstate = () => {
        navigate(`/simconfigslist`);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        navigate(`/`);
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
                    <div className="columns if-full mt-5 mb-5">
                        <div className="column is-full">
                            <h1 className="title has-text-centered">Project List</h1>
                                <table className="table is-bordered is-striped has-background-info-light is-fullwidth mt-2">
                                    <thead>
                                        <tr style={{backgroundColor: `lightsteelblue`}}>
                                            <th>Team size</th>
                                            <th>Rate / hour</th>
                                            <th>Work hour / day</th>
                                            <th>Planned cost</th>
                                            <th>Days per sprint</th>
                                            <th>Num of sprint</th>
                                            <th>Release point</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr></tr>
                                        {simConfig.map((simConfig) => (
                                            <tr className="has-text-left" key={simConfig._id}>
                                                <td>{simConfig.scrumTeamSize}</td>
                                                <td>{simConfig.scrumTeamRate}</td>
                                                <td>{simConfig.scrumTeamHour}</td>
                                                <td>{simConfig.plannedCost}</td>
                                                <td>{simConfig.sprintLength}</td>
                                                <td>{simConfig.plannedSprint}</td>
                                                <td>{simConfig.productBacklog.reduce((prev,next) => prev + next.pbPoint,0)}</td>
                                                <td>
                                                    <Link
                                                        to={`simulation/${simConfig._id}`} 
                                                        className="button is-info is-small mr-1">
                                                        <strong>Select</strong>
                                                    </Link>
                                                    <button
                                                        onClick={() => deleteSimConfig(simConfig._id)}
                                                        className="button is-danger is-small">
                                                        <strong>Delete</strong>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            <div className="has-text-centered">
                                <Link to="create" className="button has-text-centered is-success">
                                    <strong>New simulation</strong>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimConfigList;