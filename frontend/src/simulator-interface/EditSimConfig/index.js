import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentSprint } from "../../utils/Utils";

const EditSimConfig = () => {
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
    const [eventProbability, setEventProbability] = useState("");

    const [sprintBacklog, setSprintBacklog] = useState([
        {
            sprintId: String,
            releaseBacklog: [
                {
                    rbId: String,
                    isRbDone: false,
                },
            ],
            sprintBacklogItem: [
                {
                    sbId: String,
                    sbPlannedHour: Number,
                    sbActualHour: Number,
                    relatedPbId: String,
                    isSbDone: false,
                },
            ],
        },
    ]);

    useEffect(() => {
        getSimConfigById();
    }
    , []);

    const getSimConfigById = async () => {
        const response = await axios.get(process.env.REACT_APP_API + `/simconfigs/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
        setCreator(response.data.creator);
        setScrumTeamSize(response.data.scrumTeamSize);
        setScrumTeamRate(response.data.scrumTeamRate);
        setScrumTeamHour(response.data.scrumTeamHour);
        setPlannedCost(response.data.plannedCost);
        setSprintLength(response.data.sprintLength);
        setPlannedSprint(response.data.plannedSprint);
        setEventProbability(response.data.eventProbability);
        setSprintBacklog(response.data.sprintBacklog);
    }

    const updateSimConfig = async (e) => {
        e.preventDefault();
        if (plannedSprint <= getCurrentSprint(sprintBacklog)) {
            alert("Cannot update planned sprint to a value less than or equal to current sprint");
            return;
        }
        setSprintBacklog(handlePlannedSprintChange(plannedSprint, sprintBacklog));
        try {
            await axios.patch(process.env.REACT_APP_API + `/simconfigs/${id}`, {
                creator,
                scrumTeamSize,
                scrumTeamRate,
                scrumTeamHour,
                plannedCost,
                sprintLength,
                plannedSprint,
                eventProbability,
                sprintBacklog
            }, { headers: { "Authorization": `Bearer ${token}` } });
            const url = window.location.pathname;
            navigate(url.substring(0, url.lastIndexOf('/')));
            
        } catch (error) {
            console.log(error);
        }
    }

    const handlePlannedSprintChange = (plannedSprint, sprintBacklog) => {
        if (plannedSprint > sprintBacklog.length) {
            for (let i = sprintBacklog.length; i < plannedSprint; i++) {
                let newSprintBacklog = {
                    sprintId: i.toString(),
                    releaseBacklog: [],
                    sprintBacklogItem: [],
                    sprintCost: 0,
                    currentTeamSize: scrumTeamSize,
                    sprintTimeSpent: 0,
                    isSprintDone: false,
                    eventLog: [],
                };
                sprintBacklog.push(newSprintBacklog);
            }
        } else {
            if (plannedSprint < sprintBacklog.length) {
                const n = sprintBacklog.length - plannedSprint;
                return sprintBacklog.splice(sprintBacklog.length - n, n);
            } else {
                return sprintBacklog;
            }
        }
    };

    const handleCancel = () => {
        const url = window.location.pathname;
        navigate(url.substring(0, url.lastIndexOf('/')));
    };

    window.onpopstate = function(event) {
        const url = window.location.pathname;
        navigate(url.substring(0, url.lastIndexOf('/')));
    };

    return (
        <div className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-full mt-5 has-background-white-ter">
                        <div className="column has-text-centered">
                            <form onSubmit={updateSimConfig}>
                                {/* <div className="form-group mt-2">
                                    <label className="label has-text-centered">Team size</label>
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
                                </div> */}
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Rate per hour</label>
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
                                    <label className="label has-text-centered">Work hours per day</label>
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
                                {/* <div className="form-group mt-2">
                                    <label className="label has-text-centered">Planned cost</label>
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
                                </div> */}
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Days per sprint</label>
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
                                    <label className="label has-text-centered">Planned sprint</label>
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
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Event probability</label>
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        max="1"
                                        style={{width: "35%"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small"
                                        placeholder="Planned Sprint"
                                        value={eventProbability}
                                        onChange={(e) => {setEventProbability(e.target.value)}}
                                        required
                                    />
                                </div>
                                <button className="button is-danger mt-5 ml-2" type="button" onClick={handleCancel}><strong>Cancel</strong></button>
                                <button className="button is-success mt-5 ml-2" type="submit"><strong>Save</strong></button>
                            </form>
                        </div>
                    </div>            
                </div>
            </div>
        </div>
    );
}

export default EditSimConfig;