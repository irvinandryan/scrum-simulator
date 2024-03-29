import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getSessionUsername, isWeekday } from "../../../simulation-handler/Utils";
import { NavBarHome } from "../../components/NavBar";
import "./CreateSimConfigStyle.css";
import { saveSimConfigAPI } from "../../../simulator-api/SimulatorApi";

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
                    sbPlannedHour: Number,
                    sbActualHour: Number,
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

    const handleStartDate = (startDate) => {
        try {
            new Date(setStartDate(startDate - (startDate.getTimezoneOffset() * 60000)));
        } catch (error) {
            console.log(error);
        }
    };


    const saveSimConfig = async (e) => {
        e.preventDefault();
        saveSimConfigAPI(creator, scrumTeamSize, scrumTeamRate, scrumTeamHour, plannedCost, sprintLength, plannedSprint, productBacklog, sprintBacklog, startDate, eventProbability, navigate);
    };

    const generateSprintBacklog = (plannedSprint) => {
        let sprintBacklog = [];
        for (let i = 0; i < plannedSprint; i++) {
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
        return sprintBacklog;
    };

    return (
        <div className="hero is-fullheight">
            <NavBarHome
                navigate={navigate}
            />
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
                                                min="1"
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
                                        max="9"
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
                                        min="1"
                                        style={{width: "170px"}}
                                        oninput="validity.valid||(value='')"
                                        className="input is-small is-inline ml-1"
                                        placeholder="Rate/hour"
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
                                        placeholder="Work hours/day"
                                        value={scrumTeamHour}
                                        onChange={(e) => setScrumTeamHour(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="number"
                                        step="any"
                                        min="1"
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
                                        calendarContainer="auto"
                                        placeholderText="Pick a start date"
                                        className="datePicker"
                                        dateFormat="dd/MM/yyyy"
                                        selected={startDate}
                                        filterDate={isWeekday}
                                        onChange={(startDate) => handleStartDate(startDate)}
                                        wrapperClassName="w-full"
                                        
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