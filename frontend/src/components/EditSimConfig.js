import React, { useState, useEffect } from "react";
import axios from "axios";
import { Router, useNavigate, useParams } from "react-router-dom";

const EditSimConfig = () => {
    const [scrumTeamSize, setScrumTeamSize] = useState("");
    const [scrumTeamRate, setScrumTeamRate] = useState("");
    const [scrumTeamHour, setScrumTeamHour] = useState("");
    const [plannedCost, setPlannedCost] = useState("");
    const [sprintLength, setSprintLength] = useState("");
    const [plannedSprint, setPlannedSprint] = useState("");

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        getSimConfigById();
    }
    , []);

    const getSimConfigById = async () => {
        const response = await axios.get(process.env.REACT_APP_API + `/simConfigs/${id}`);
        setScrumTeamSize(response.data.scrumTeamSize);
        setScrumTeamRate(response.data.scrumTeamRate);
        setScrumTeamHour(response.data.scrumTeamHour);
        setPlannedCost(response.data.plannedCost);
        setSprintLength(response.data.sprintLength);
        setPlannedSprint(response.data.plannedSprint);
    }

    const updateSimConfig = async (e) => {
        e.preventDefault();
        try {
            await axios.patch(process.env.REACT_APP_API + `/simConfigs/${id}`, {
                scrumTeamSize,
                scrumTeamRate,
                scrumTeamHour,
                plannedCost,
                sprintLength,
                plannedSprint
            });
            navigate(-1);
            
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-full mt-5 has-background-white-ter">
                        <div className="column has-text-centered">
                            <form onSubmit={updateSimConfig}>
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Scrum Team Size</label>
                                    <input
                                        type="number"
                                        min="1" 
                                        style={{width: "35%"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small"
                                        placeholder="Scrum Team Size"
                                        value={scrumTeamSize}
                                        onChange={(e) => setScrumTeamSize(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Rate per Hour</label>
                                    <input
                                        type="number"
                                        min="0"
                                        style={{width: "35%"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small"
                                        placeholder="Rate per Hour"
                                        value={scrumTeamRate}
                                        onChange={(e) => setScrumTeamRate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Work Hours per Day</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="24"
                                        style={{width: "35%"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small"
                                        placeholder="Work Hours per Day"
                                        value={scrumTeamHour}
                                        onChange={(e) => setScrumTeamHour(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Planned Cost</label>
                                    <input
                                        type="number"
                                        min="0"
                                        style={{width: "35%"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small"
                                        placeholder="Planned Cost"
                                        value={plannedCost}
                                        onChange={(e) => setPlannedCost(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Days per Sprint</label>
                                    <input
                                        type="number"
                                        min="1"
                                        style={{width: "35%"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small"
                                        placeholder="Days per Sprint"
                                        value={sprintLength}
                                        onChange={(e) => setSprintLength(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Planned Sprint</label>
                                    <input
                                        type="number"
                                        min="1"
                                        style={{width: "35%"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small"
                                        placeholder="Planned Sprint"
                                        value={plannedSprint}
                                        onChange={(e) => {setPlannedSprint(e.target.value)}}
                                        required
                                    />
                                </div>
                                <button className="button is-success mt-5 ml-2"><strong>Save</strong></button>
                            </form>
                        </div>
                    </div>            
                </div>
            </div>
        </div>
    );
}

export default EditSimConfig;