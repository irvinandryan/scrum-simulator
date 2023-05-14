import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getCurrentSprint } from "../../utils/Utils";
import { getEstimateAtCompletion, getActualCost } from "../../utils/AgileEVM";

export const EditSim = ({active, handleClickModal}) => {
    const { id } = useParams();
    const token = localStorage.getItem("authToken");
    const [creator, setCreator] = useState("");
    const [scrumTeamSize, setScrumTeamSize] = useState("");
    const [scrumTeamRate, setScrumTeamRate] = useState("");
    const [scrumTeamHour, setScrumTeamHour] = useState("");
    const [plannedCost, setPlannedCost] = useState("");
    const [sprintLength, setSprintLength] = useState("");
    const [plannedSprint, setPlannedSprint] = useState("");
    const [eventProbability, setEventProbability] = useState("");
    const [predictedCost, setPredictedCost] = useState("");
    const [actualCost, setActualCost] = useState("");

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
        setPredictedCost(getEstimateAtCompletion(response.data.productBacklog, response.data.sprintBacklog, response.data.plannedCost));
        setActualCost(getActualCost(response.data.sprintBacklog));
    }

    const updateSimConfig = async (e) => {
        e.preventDefault();
        if (plannedSprint <= getCurrentSprint(sprintBacklog)) {
            alert("Cannot update planned sprint to a value less than the current sprint");
            return;
        }
        if (plannedCost <= actualCost && isFinite(actualCost)) {
            alert("Cannot update planned cost to a value less than or equal to total spending");
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
            window.location.reload();
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

    return (
        <div className="EditSim">
            <div className={`modal ${active}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Edit Simulation</p>
                        <button className="delete" aria-label="close" onClick={handleClickModal}></button>
                    </header>
                    <form onSubmit={updateSimConfig}>
                        <section className="modal-card-body">
                        {/* <form onSubmit={updateSimConfig}> */}
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
                                <label className="label has-text-centered">Planned cost</label>
                                <input
                                    type="number"
                                    min="1"
                                    style={{width: "35%"}}
                                    oninput="validity.valid||(value='')"
                                    className="input is-small"
                                    placeholder="Planned Cost"
                                    value={plannedCost}
                                    onChange={(e) => {setPlannedCost(e.target.value)}}
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
                                    placeholder="Event Probability"
                                    value={eventProbability}
                                    onChange={(e) => {setEventProbability(e.target.value)}}
                                    required
                                />
                            </div>
                        </section>
                        <footer className="modal-card-foot">
                            <button class="button is-success" type="submit">Save changes</button>
                            <button onClick={handleClickModal} class="button is-dark" type="button"><strong>Close</strong></button>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
}