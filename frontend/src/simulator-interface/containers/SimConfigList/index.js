import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { NavBarHome } from "../../components/NavBar";

const SimConfigList = () => {
    const token = localStorage.getItem("authToken");
    const [simConfig, setSimConfig] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getSimConfig();
    }, []);

    const getSimConfig = async () => {
        try {
            const response = await axios.get(process.env.REACT_APP_API + `/simconfigs`, {headers: {"Authorization": `Bearer ${token}`}})
            setSimConfig(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteSimConfig = async (id) => {
        try {
            await axios.delete(process.env.REACT_APP_API + `/simconfigs/${id}`, {headers: {"Authorization": `Bearer ${token}`}})
            getSimConfig();
        } catch (error) {
            console.log(error);
        }
    };

    window.onpopstate = () => {
        navigate(`/simconfigslist`);
    };

    return (
        <div className="hero is-fullheight">
            <NavBarHome
                navigate={navigate}
            />
            <div className="hero-body">
                <div className="container">
                    <div className="columns if-full mt-5 mb-5">
                        <div className="column is-full">
                            <h1 className="title has-text-centered">Project List</h1>
                                <table className="table is-bordered is-striped has-background-info-light is-fullwidth mt-2">
                                    <thead>
                                        {simConfig.length === 0 ? (
                                            <tr style={{backgroundColor: `lightsteelblue`}}>
                                                <th>Team size</th>
                                                <th>Rate/hour</th>
                                                <th>Work hours/day</th>
                                                <th>Planned cost</th>
                                                <th>Days/sprint</th>
                                                <th>Planned sprint</th>
                                                <th>Release point</th>
                                            </tr>
                                        ) : (
                                            <tr style={{backgroundColor: `lightsteelblue`}}>
                                                <th>Team size</th>
                                                <th>Rate/hour</th>
                                                <th>Work hours/day</th>
                                                <th>Planned cost</th>
                                                <th>Days/sprint</th>
                                                <th>Planned sprint</th>
                                                <th>Release point</th>
                                                <th></th>
                                            </tr>
                                        )}
                                    </thead>
                                    <tbody>
                                        <tr></tr>
                                        {simConfig.length === 0 ? (
                                            <tr>
                                                <td className="has-text-centered" colSpan="7">No simulation available</td>
                                            </tr>
                                        ) : (
                                            simConfig.map((simConfig) => (
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
                                            ))
                                        )}
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