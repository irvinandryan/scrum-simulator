import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getSessionUsername, isWeekday } from "../utils/Utils";

const CreateSimConfig = () => {
    const navigate = useNavigate();
    const [creator, setCreator] = useState(getSessionUsername());
    const [scrumTeamSize, setScrumTeamSize] = useState("");
    const [scrumTeamRate, setScrumTeamRate] = useState("");
    const [scrumTeamHour, setScrumTeamHour] = useState("");
    const [plannedCost, setPlannedCost] = useState("");
    const [sprintLength, setSprintLength] = useState("");
    const [plannedSprint, setPlannedSprint] = useState("");
    const [startDate, setStartDate] = useState("");
    const [eventProbability, setEventProbability] = useState("");

    const [productBacklog, setProductBacklog] = useState([
        {
            pbId: String,
            pbPoint: Number,
            isPbDone: false,
        },
    ]);

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
                    sbHour: Number,
                    relatedPbId: String,
                    isSbDone: false,
                },
            ],
        },
    ]);

    const addProductbacklog = () => {
        let object = {
            pbId: "",
            pbPoint: "Story point",
            isPbDone: false,
        }
        setProductBacklog([...productBacklog, object]);
    };

    const removeProductbacklog = (index) => {
        let data = [...productBacklog];
        data.splice(index, 1);
        setProductBacklog(data);
    };

    const handleProductbacklog = (e, index) => {
        let data = [...productBacklog];
        data[index][e.target.name] = e.target.value;
        setProductBacklog(data);
    };

    const saveSimConfig = async (e) => {
        e.preventDefault();
        try {
            await axios.post(process.env.REACT_APP_API + "/simConfigs", {
                creator,
                scrumTeamSize,
                scrumTeamRate,
                scrumTeamHour,
                plannedCost,
                sprintLength,
                plannedSprint,
                productBacklog,
                sprintBacklog,
                startDate,
                eventProbability,
            });
            navigate("/simconfigslist");
          } catch (error) {
            console.log(error);
          }
    };

    const generateSprintBacklog = (plannedSprint) => {
        let sprintBacklog = [];
        for (let i = 0; i < plannedSprint; i++) {
            let sprintBacklogItem = {
                sprintId: i.toString(),
                sprintBacklog: [],
                sprintCost: 0,
                sprintTimeSpent: 0,
                isSprintDone: false,
            };
            sprintBacklog.push(sprintBacklogItem);
        }
        return sprintBacklog;
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
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
                    <div className="columns mt-5 has-text-centered has-background-white-ter">
                        <div className="column is-one-half ml-2">
                            <h1 className="has-text-centered subtitle">Simulation Configuration</h1>
                            <form onSubmit={saveSimConfig}>
                                {productBacklog.map((form,index) => {
                                    return (
                                        <div className="form-group mt-2">
                                            <input 
                                                readOnly
                                                size={5}
                                                className="input is-static has-text-centered is-small is-inline mb-1"
                                                name="pbId"
                                                value={form.pbId=`PB-${index + 1}`}
                                                required
                                                onChange={(e) => handleProductbacklog(e, index)}
                                            />
                                            <input
                                                type="number"
                                                min="0"
                                                oninput="validity.valid||(value='')"
                                                className="input is-small is-inline mr-1 ml-1 mb-1"
                                                name="pbPoint"
                                                placeholder="Story point"
                                                value={form.pbPoint}
                                                required
                                                onChange={(e) => handleProductbacklog(e, index)}
                                            />
                                            {(productBacklog.length!==1)?
                                                <button
                                                    type="button"
                                                    onClick={() => removeProductbacklog(index)}
                                                    className="button is-danger is-inline is-small mb-1">
                                                    <strong>Delete</strong>
                                                </button>:''
                                            }
                                        </div>
                                    )
                                })}
                                <button
                                    onClick={() => 
                                        addProductbacklog()
                                    }
                                    className="button is-info is-small mt-2">
                                    <strong>Add product backlog</strong>
                                </button>
                                <div className="form-group mt-2">
                                    <input
                                        type="number"
                                        min="1" 
                                        style={{width: "170px"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small is-inline mr-1"
                                        placeholder="Team size"
                                        value={scrumTeamSize}
                                        onChange={(e) => setScrumTeamSize(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        style={{width: "170px"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small is-inline ml-1"
                                        placeholder="Rate per hour"
                                        value={scrumTeamRate}
                                        onChange={(e) => setScrumTeamRate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <input
                                        type="number"
                                        min="1"
                                        max="24"
                                        style={{width: "170px"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small is-inline mr-1"
                                        placeholder="Work hours per day"
                                        value={scrumTeamHour}
                                        onChange={(e) => setScrumTeamHour(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        style={{width: "170px"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small is-inline ml-1"
                                        placeholder="Planned cost"
                                        value={plannedCost}
                                        onChange={(e) => setPlannedCost(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <input
                                        type="number"
                                        min="1"
                                        style={{width: "170px"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small is-inline mr-1"
                                        placeholder="Days per sprint"
                                        value={sprintLength}
                                        onChange={(e) => setSprintLength(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="number"
                                        min="1"
                                        style={{width: "170px"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small is-inline ml-1"
                                        placeholder="Planned sprint"
                                        value={plannedSprint}
                                        onChange={(e) => {setPlannedSprint(e.target.value); setSprintBacklog(generateSprintBacklog(e.target.value))}}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <DatePicker
                                        popperPlacement="auto"
                                        placeholderText="Pick a start date"
                                        className="react-datepicker"
                                        dateFormat="dd/MM/yyyy"
                                        selected={startDate}
                                        filterDate={isWeekday}
                                        onChange={(startDate) => new Date(setStartDate((startDate - (startDate.getTimezoneOffset() * 60000))))}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <input
                                        type="number"
                                        step="any"
                                        min="0"
                                        max="1"
                                        style={{width: "170px"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small is-inline mt-2"
                                        placeholder="Event probability"
                                        value={eventProbability}
                                        onChange={(e) => {setEventProbability(e.target.value)}}
                                        required
                                    />
                                </div>
                                <Link to={`/simconfigslist`}  className="button is-danger mt-4 mr-4">
                                    <strong>Cancel</strong>
                                </Link>
                                <button type="submit" className="button is-success mt-4">
                                    <strong>Save Configuration</strong>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSimConfig;