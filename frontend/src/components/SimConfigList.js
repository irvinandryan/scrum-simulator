import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SimConfigList = () => {
    const [simConfig, setSimConfig] = useState([]);

    useEffect(() => {
        getSimConfig();
    }, []);

    const getSimConfig = async () => {
        const response = await axios.get(process.env.REACT_APP_API + "/simConfigs")
        setSimConfig(response.data);
    }
    
    const deleteSimConfig = async (id) => {
        try {
            await axios.delete(process.env.REACT_APP_API + `/simConfigs/${id}`)
            getSimConfig();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="columns if-full mt-5">
            <div className="column is-full">
                <h1 className="title has-text-centered">Project List</h1>
                    <table className="table is-striped has-background-white-ter is-fullwidth mt-2">
                        <thead>
                            <tr>
                                <th>Team size</th>
                                <th>Rate / hour</th>
                                <th>Work hour / day</th>
                                <th>Planned cost</th>
                                <th>Days per sprint</th>
                                <th>Planned sprint</th>
                                <th>Release point</th>
                            </tr>
                        </thead>
                        <tbody>
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
    );
};

export default SimConfigList;