import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getCurrentSprint } from "../../simulation-handler/Utils";
import { getActualCost } from "../../simulation-handler/AgileEVM";

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
    const [actualCost, setActualCost] = useState("");
    const [tempSize, setTempSize] = useState("");

    const [scrumTeamSize_old, setScrumTeamSize_old] = useState("");
    const [scrumTeamRate_old, setScrumTeamRate_old] = useState("");
    const [scrumTeamHour_old, setScrumTeamHour_old] = useState("");
    const [plannedCost_old, setPlannedCost_old] = useState("");
    const [sprintLength_old, setSprintLength_old] = useState("");
    const [plannedSprint_old, setPlannedSprint_old] = useState("");

    const [sprintBacklog, setSprintBacklog] = useState([
        {
            sprintId: String,
            isSprintDone: false,
            currentTeamSize: Number,
            eventLog: [String],
            responseLog: [String],
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
    }, []);

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
        setActualCost(getActualCost(response.data.sprintBacklog));
        setTempSize(response.data.scrumTeamSize)

        setScrumTeamSize_old(response.data.scrumTeamSize);
        setScrumTeamRate_old(response.data.scrumTeamRate);
        setScrumTeamHour_old(response.data.scrumTeamHour);
        setPlannedCost_old(response.data.plannedCost);
        setSprintLength_old(response.data.sprintLength);
        setPlannedSprint_old(response.data.plannedSprint);
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

        // check if any value is changed
        if (scrumTeamSize !== scrumTeamSize_old) {
            const log_message = "Scrum team size is changed from " + scrumTeamSize_old + " to " + scrumTeamSize;
            sprintBacklog[getCurrentSprint(sprintBacklog)].responseLog.push(log_message);
            setSprintBacklog(sprintBacklog);
        }
        if (scrumTeamRate !== scrumTeamRate_old) {
            const log_message = "Scrum team rate is changed from " + scrumTeamRate_old + " to " + scrumTeamRate;
            sprintBacklog[getCurrentSprint(sprintBacklog)].responseLog.push(log_message);
            setSprintBacklog(sprintBacklog);
        }
        if (scrumTeamHour !== scrumTeamHour_old) {
            const log_message = "Scrum team work hours per day is changed from " + scrumTeamHour_old + " to " + scrumTeamHour;
            sprintBacklog[getCurrentSprint(sprintBacklog)].responseLog.push(log_message);
            setSprintBacklog(sprintBacklog);
        }
        if (plannedCost !== plannedCost_old) {
            const log_message = "Planned cost is changed from " + plannedCost_old + " to " + plannedCost;
            sprintBacklog[getCurrentSprint(sprintBacklog)].responseLog.push(log_message);
            setSprintBacklog(sprintBacklog);
        }
        if (sprintLength !== sprintLength_old) {
            const log_message = "Sprint length is changed from " + sprintLength_old + " to " + sprintLength;
            sprintBacklog[getCurrentSprint(sprintBacklog)].responseLog.push(log_message);
            setSprintBacklog(sprintBacklog);
        }
        if (plannedSprint !== plannedSprint_old) {
            const log_message = "Planned sprint is changed from " + plannedSprint_old + " to " + plannedSprint;
            sprintBacklog[getCurrentSprint(sprintBacklog)].responseLog.push(log_message);
            setSprintBacklog(sprintBacklog);
        }

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

    const handleTeamSizeChange = async (e) => {
        setTempSize(e);
        if (e <= sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize) {
            for (let i = 0; i < sprintBacklog.length; i++) {
                if (sprintBacklog[i].isSprintDone === false) {
                    sprintBacklog[i].currentTeamSize = e;
                }
            }
            setSprintBacklog(sprintBacklog);
            setScrumTeamSize(e);
        } else {
            if (e > tempSize) {
                let diff = parseInt(tempSize) - parseInt(sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize);
                sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize = parseInt(e) - parseInt(diff);
                for (let i = getCurrentSprint(sprintBacklog)+1; i < sprintBacklog.length; i++) {
                    if (sprintBacklog[i].isSprintDone === false) {
                        sprintBacklog[i].currentTeamSize = e;
                    }
                }
                setSprintBacklog(sprintBacklog);
                setScrumTeamSize(e);
            }
            else {
                setScrumTeamSize(e);
            }
        }
    };

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
                    responseLog: [],
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
        <div className="EditSim has-text-centered">
            <div className={`modal ${active}`}>
                <div className="modal-background"></div>
                <div className="modal-card">
                    <header className="modal-card-head has-background-grey-lighter">
                        <p className="modal-card-title"><strong>Manage Project</strong></p>
                        <button className="delete" aria-label="close" onClick={handleClickModal}></button>
                    </header>
                    <form onSubmit={updateSimConfig}>
                        <section className="modal-card-body">
                            <div className="form-group mt-2">
                                <label className="label has-text-centered">Team size</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="9"
                                    style={{width: "35%"}}
                                    oninput="validity.valid||(value='')"
                                    className="input is-small"
                                    placeholder="Scrum Team Size"
                                    value={tempSize}
                                    onChange={(e) => handleTeamSizeChange(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mt-2">
                                <label className="label has-text-centered">Rate/hour</label>
                                <input
                                    type="number"
                                    min="1"
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
                                <label className="label has-text-centered">Work hours/day</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="24"
                                    style={{width: "35%"}}
                                    oninput="validity.valid||(value='')"
                                    className="input is-small"
                                    placeholder="Work Hours/Day"
                                    value={scrumTeamHour}
                                    onChange={(e) => setScrumTeamHour(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group mt-2">
                                <label className="label has-text-centered">Days/sprint</label>
                                <input
                                    type="number"
                                    min="1"
                                    style={{width: "35%"}}
                                    oninput="validity.valid||(value='')"
                                    className="input is-small"
                                    placeholder="Days/Sprint"
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
                        <footer className="modal-card-foot has-background-grey-lighter buttons is-centered">
                            <button onClick={handleClickModal} class="button is-danger" type="button"><strong>Cancel</strong></button>
                            <button class="button is-success" type="submit"><strong>Save changes</strong></button>
                        </footer>
                    </form>
                </div>
            </div>
        </div>
    );
}