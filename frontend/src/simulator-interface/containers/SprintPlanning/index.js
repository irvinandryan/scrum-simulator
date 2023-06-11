import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { Tooltip } from 'react-tooltip'
import { getCurrentSprint, getMaxScrumTeamWorkHour, getTotalSpending } from "../../../simulation-handler/Utils.js";
import { doEventSprintExecution } from "../../../simulation-handler/EventHandler.js";
import { EVMBar, NavBar } from "../../components/NavBar.js";
import { getSimConfigByIdAPI, updateSimConfigAPI } from "../../../simulator-api/SimulatorApi.js";
import { EditSim } from "../../components/ManageProject.js";

const SprintPlanning = () => {
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
    const [eventProbability, setEventProbability] = useState("");

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
            sbPlannedHour: Number,
            sbActualHour: Number,
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
            currentTeamSize: Number,
            sprintTimeSpent: Number,
            isSprintDone: false,
            eventLog: [String],
            responseLog: [String],
        },
    ]);

    useEffect(() => {
        getSimConfigById();
    }, []);

    const getSimConfigById = async () => {
        getSimConfigByIdAPI(id, setCreator, setScrumTeamSize, setScrumTeamRate, setScrumTeamHour, setPlannedCost, setSprintLength, setPlannedSprint, setProductBacklog, setSprintBacklog, setStartDate, setEventProbability, navigate)
    };

    const updateSimConfig = async (e) => {
        e.preventDefault();
        let sum = 0;
        sprintBacklogItem.forEach((item) => {
            sum += parseInt(item.sbPlannedHour);
        });
        if (sum > (sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize * scrumTeamHour * sprintLength)) {
            alert("Total work hours of sprint backlog items cannot be greater than maximum work hours of scrum team");
            return;
        }
        if ((plannedCost - getTotalSpending(sprintBacklog)) < (sprintBacklogItem.reduce((prev,next) => prev + parseInt(next.sbPlannedHour),0) * scrumTeamRate)) {
            alert("Total spending cannot be greater than remaining cost");
            return;
        }
        for (let i = 0; i < sprintBacklog.length; i++) {
            if (sprintBacklog[i].sprintBacklogItem.length === 0) {
                sprintBacklog[i].sprintBacklogItem = sprintBacklogItem;
                sprintBacklog[i].releaseBacklog = releaseBacklog;
                setReleaseBacklog(releaseBacklog);
                setSprintBacklog(sprintBacklog);
                break;
            }
        }
        doEventSprintExecution(sprintBacklog, scrumTeamSize, setSprintBacklog, eventProbability)
        updateSimConfigAPI(id, scrumTeamSize, scrumTeamRate, scrumTeamHour, plannedCost, sprintLength, plannedSprint, productBacklog, sprintBacklog, startDate, releaseBacklog, eventProbability, navigate);
        navigate(`/simconfigslist/simulation/${id}/sprintexecution`);
    };
        
    const addSprintBacklogItem = () => {
        let object = {
            sbId: String,
            sbPlannedHour: Number,
            sbActualHour: Number,
            relatedPbId: String,
            isSbDone: false,
        };
        setSprintBacklogItem([...sprintBacklogItem, object]);
    };

    const handleSprintBacklogItem = (e, index) => {
        let data = [...sprintBacklogItem];
        data[index][e.target.name] = e.target.value;
        setSprintBacklogItem(data);
    };

    const removeSprintBacklogItem = (index) => {
        let data = [...sprintBacklogItem];
        data.splice(index, 1);
        setSprintBacklogItem(data);
    };

    const handleReleaseBacklog = (e) => {
        setReleaseBacklog(e);
    };

    const getInputHour = (sprintBacklogItem) => {
        if (isNaN(sprintBacklogItem.reduce((prev,next) => prev + parseInt(next.sbPlannedHour),0))) {
            return '-';
        }
        return sprintBacklogItem.reduce((prev,next) => prev + parseInt(next.sbPlannedHour),0);
    };

    const getInputCost = (sprintBacklogItem) => {
        if (isNaN(sprintBacklogItem.reduce((prev,next) => prev + parseInt(next.sbPlannedHour),0))) {
            return '-';
        }
        return sprintBacklogItem.reduce((prev,next) => prev + parseInt(next.sbPlannedHour),0) * scrumTeamRate;
    };

    window.onpopstate = () => {
        navigate(`/simconfigslist`);
    };

    const [isEditOpen, setIsEditOpen] = useState(false);
    const activeEdit = isEditOpen ? "is-active" : "";
    const handleClickModalEdit = () => {
        setIsEditOpen(!isEditOpen);
    };

    return (
        <div className="hero is-fullheight">
            <EVMBar
                productBacklog={productBacklog}
                sprintBacklog={sprintBacklog}
                plannedCost={plannedCost}
                plannedSprint={plannedSprint}
                startDate={startDate}
                sprintLength={sprintLength}
            />
            <NavBar
                sprintBacklog={sprintBacklog}
                scrumTeamSize={scrumTeamSize}
                scrumTeamRate={scrumTeamRate}
                scrumTeamHour={scrumTeamHour}
                plannedCost={plannedCost}
                sprintLength={sprintLength}
                plannedSprint={plannedSprint}
                startDate={startDate}
                navigate={navigate}
            />
            <div className="hero-body">
                <div className="container mt-5 mb-5">
                <h2 className="subtitle has-text-centered"><strong>Sprint Planning {getCurrentSprint(sprintBacklog) + 1}</strong></h2>
                    <div className="columns mb-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth" style={{border: `groove`}}>
                                <thead>
                                    <tr style={{backgroundColor: `lightsteelblue`}}>
                                        <th 
                                            className="has-text-centered" 
                                            data-tooltip-id="event-planning" 
                                            data-tooltip-content="Event will affect your project plan, please respond by managing your project">
                                            Sprint {getCurrentSprint(sprintBacklog) + 1} event
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[getCurrentSprint(sprintBacklog)].eventLog.length === 0 ? (
                                        <tr>
                                            <td className="has-text-centered">No event</td>
                                        </tr>
                                    ) : (
                                        sprintBacklog[getCurrentSprint(sprintBacklog)].eventLog.map((event, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{event}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="columns is-full mt-5 has-background-white-ter">
                        <div className="column has-text-centered">
                            <div className="form-group">
                                <form onSubmit={updateSimConfig}>
                                    <h3 
                                        className="subtitle has-text-centered" 
                                        data-tooltip-id="release-backlog-planning" 
                                        data-tooltip-content="Select product backlog items to be completed in this sprint">
                                        Release Backlog
                                    </h3>
                                    <div className="form-group mt-2 mb-5">
                                        <Select
                                            name="rbId"
                                            required
                                            placeholder="Select release backlog"
                                            isMulti
                                            options={productBacklog.filter((pb) => pb.isPbDone === false).map((pb) => {
                                                return (
                                                    {value: pb.pbId, label: pb.pbId}
                                                );
                                            })}
                                            className="basic-multi-select"
                                            onChange={(e) => handleReleaseBacklog(e.map((rb) => {
                                                return (
                                                    {
                                                        rbId: rb.value,
                                                        isRbDone: false
                                                    }
                                                );
                                            }))}
                                        />
                                    </div>
                                    <h3 
                                        className="subtitle has-text-centered"
                                        data-tooltip-id="sprint-backlog-planning" 
                                        data-tooltip-content="Create sprint backlog and estimate the time needed to finish each sprint backlog items by filling the Hour needed field">
                                        Sprint Backlog
                                    </h3>
                                    {sprintBacklogItem.map((form,index) => {
                                        return (
                                            <div className="form-group mt-2">
                                                <input 
                                                    readOnly
                                                    size={5}
                                                    className="input is-static has-text-centered is-small is-inline mb-1"
                                                    name="sbId"
                                                    value={form.sbId=`SB-${index + 1}`}
                                                    required
                                                    onChange={(e) => handleSprintBacklogItem(e, index)}
                                                />
                                                <input
                                                    type="number"
                                                    min="1"
                                                    oninput="validity.valid||(value='')"
                                                    className="input is-small is-inline mr-1 ml-1 mb-1"
                                                    name="sbPlannedHour"
                                                    placeholder="Hour needed"
                                                    value={form.sbPlannedHour}
                                                    required
                                                    onChange={(e) => handleSprintBacklogItem(e, index)}
                                                />
                                                <select
                                                    className="select is-small is-inline mr-1 ml-1 mb-1"
                                                    name="relatedPbId"
                                                    value={form.relatedPbId}
                                                    required
                                                    onChange={(e) => handleSprintBacklogItem(e, index)}>
                                                    <option value="" disabled>
                                                        Related product backlog
                                                    </option>
                                                    {productBacklog.filter((pb) => pb.isPbDone === false).map((pb) => {
                                                        return (
                                                            <option value={pb.pbId}>
                                                                {pb.pbId}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                                {(sprintBacklogItem.length!==1)?
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSprintBacklogItem(index)}
                                                        className="button is-danger is-inline is-small mb-1">
                                                        <strong>Delete</strong>
                                                    </button>:''
                                                }
                                            </div>
                                        )
                                    })}
                                    <input
                                        readOnly
                                        size={8}
                                        className="input is-small is-static has-text-centered is-inline mr-1 ml-1 mb-1 mt-2"
                                        name="totalHourLabel"
                                        placeholder="Total hour"
                                        value={"Total hour"}
                                        required
                                    />
                                    <input
                                        readOnly
                                        size={4}
                                        className="input is-small is-static has-text-centered is-inline mr-1 ml-1 mb-1 mt-2"
                                        name="totalHour"
                                        min="0"
                                        max={getMaxScrumTeamWorkHour(sprintBacklog[getCurrentSprint(sprintBacklog)].currentTeamSize, scrumTeamHour, sprintLength)}
                                        value={getInputHour(sprintBacklogItem)}
                                        required
                                    />
                                    <input
                                        readOnly
                                        size={8}
                                        className="input is-small is-static has-text-centered is-inline mr-1 ml-1 mb-1 mt-2"
                                        name="totalCostLabel"
                                        placeholder="Total cost"
                                        value={"Total cost"}
                                        required
                                    />
                                    <input
                                        readOnly
                                        size={7}
                                        className="input is-small is-static has-text-centered is-inline mr-1 ml-1 mb-1 mt-2"
                                        name="totalHour"
                                        min="0"
                                        max={plannedCost - getTotalSpending(sprintBacklog)}
                                        value={getInputCost(sprintBacklogItem, scrumTeamRate)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            addSprintBacklogItem()
                                        }
                                        className="button is-info is-small mr-1 ml-1 mb-1 mt-2">
                                        <strong>Add sprint backlog</strong>
                                    </button>
                                    <div className="columns">
                                        <div className="column is-one-half has-text-centered">
                                            <button 
                                                type="button"
                                                className="button is-fullwidth has-background-grey-dark has-text-white mt-4" 
                                                onClick={() => handleClickModalEdit()}
                                                data-tooltip-id="manage-planning" 
                                                data-tooltip-content="Respond to events by managing your project">
                                                <strong>Manage project</strong>
                                            </button>
                                        </div>
                                        <div className="column is-one-half has-text-centered">
                                            <button 
                                                type="submit" 
                                                className="button is-fullwidth is-info mt-4"
                                                data-tooltip-id="continue-planning" 
                                                data-tooltip-content="Continue to sprint execution">
                                                <strong>Continue</strong>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <EditSim active={activeEdit} handleClickModal={handleClickModalEdit} />
            <Tooltip id="event-planning" />
            <Tooltip id="release-backlog-planning" />
            <Tooltip id="sprint-backlog-planning" />
            <Tooltip id="continue-planning" />
            <Tooltip id="manage-planning" />
        </div>
    );
}

export default SprintPlanning;