import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentSprintReview, getTotalWorkHourOfPb, isSimulationDone } from "../../../simulation-handler/Utils";
import { doEventSprintPlanning } from "../../../simulation-handler/EventHandler";
import { NavBarReview, EVMBar } from "../../components/NavBar";
import { EditSim } from "../../components/ManageProject.js";

const SprintReview = () => {
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
    const [startDate, setStartDate] = useState("");
    const [currentSprint, setCurrentSprint] = useState(0);
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
        try {
            const response = await axios.get(process.env.REACT_APP_API + `/simconfigs/${id}`, { headers: { "Authorization": `Bearer ${token}` } });
            setCreator(response.data.creator);
            setScrumTeamSize(response.data.scrumTeamSize);
            setScrumTeamRate(response.data.scrumTeamRate);
            setScrumTeamHour(response.data.scrumTeamHour);
            setPlannedCost(response.data.plannedCost);
            setSprintLength(response.data.sprintLength);
            setPlannedSprint(response.data.plannedSprint);
            setStartDate(response.data.startDate);
            setProductBacklog(response.data.productBacklog);
            setSprintBacklog(response.data.sprintBacklog);
            setCurrentSprint(getCurrentSprintReview(response.data.sprintBacklog)-1);
            setEventProbability(response.data.eventProbability);
        }
        catch (error) {
            console.log(error);
            navigate("/*")
        }
    }

    const handleNextSprint = async () => {
        try {
            if (isSimulationDone(productBacklog, sprintBacklog, plannedCost)) {
                navigate(`/simconfigslist/simulation/${id}/summary`);
            } else {
                doEventSprintPlanning(productBacklog, sprintBacklog, setProductBacklog, setSprintBacklog, eventProbability, currentSprint);
                await axios.patch(process.env.REACT_APP_API + `/simconfigs/${id}`, {
                    scrumTeamSize,
                    scrumTeamRate,
                    scrumTeamHour,
                    plannedCost,
                    sprintLength,
                    plannedSprint,
                    startDate,
                    productBacklog,
                    sprintBacklog,
                    releaseBacklog,
                }, { headers: { "Authorization": `Bearer ${token}` } });
                navigate(`/simconfigslist/simulation/${id}/sprintplanning`);
            }
        } catch (error) {
            console.log(error);
        }
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
            <NavBarReview
                sprintBacklog={sprintBacklog}
                currentSprint={currentSprint}
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
                <h2 className="subtitle has-text-centered"><strong>Sprint Review {currentSprint+1}</strong></h2>
                    <div className="columns mb-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth" style={{border: `groove`}}>
                                <thead>
                                    <tr style={{backgroundColor: `lightsteelblue`}}>
                                        <th className="has-text-centered">Sprint {currentSprint+1} event</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[currentSprint].eventLog.length === 0 ? (
                                        <tr>
                                            <td className="has-text-centered">No event</td>
                                        </tr>
                                    ) : (
                                        sprintBacklog[currentSprint].eventLog.map((event, index) => {
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
                    <div className="columns mb-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth" style={{border: `groove`}}>
                                <thead>
                                    <tr>
                                        <th colSpan="5" className="has-text-centered" style={{backgroundColor: `lightsteelblue`}}>Sprint {currentSprint+1} backlog</th>
                                    </tr>
                                    <tr>
                                        <th colSpan="2" style={{backgroundColor: `lightgray`}}>Cost</th>
                                        <th colSpan="3" style={{backgroundColor: `lightgray`}}>Time spent</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="2">{parseFloat(sprintBacklog[currentSprint].sprintCost).toFixed(2)}</td>
                                        <td colSpan="3">{parseFloat(sprintBacklog[currentSprint].sprintTimeSpent)}</td>
                                    </tr>
                                </tbody>
                                <thead>
                                    <tr>
                                        <th colSpan="2" style={{backgroundColor: `lightgray`}}>Release backlog ID</th>
                                        <th colSpan="3" style={{backgroundColor: `lightgray`}}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[currentSprint].releaseBacklog.map((releaseBacklog) => (
                                        <tr>
                                            <td colSpan="2">{releaseBacklog.rbId}</td>
                                            <td colSpan="3">{releaseBacklog.isRbDone ? "Done" : "Not done"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <thead>
                                    <tr style={{backgroundColor: `lightgray`}}>
                                        <th>Sprint backlog ID</th>
                                        <th>Related product backlog</th>
                                        <th>Time needed</th>
                                        <th>Time spent</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sprintBacklog[currentSprint].sprintBacklogItem.map((sprintBacklogItem) => (
                                        <tr>
                                            <td>{sprintBacklogItem.sbId}</td>
                                            <td>{sprintBacklogItem.relatedPbId}</td>
                                            <td>{sprintBacklogItem.sbPlannedHour}</td>
                                            <td>{sprintBacklogItem.sbActualHour}</td>
                                            <td>{sprintBacklogItem.isSbDone ? "Done" : "Not done"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="columns mb-5 is-full has-background-white-ter">
                        <div className="column is-one-thirds">
                            <table className="table is-bordered is-striped has-background-white-ter is-fullwidth" style={{border: `groove`}}>
                                <thead>
                                    <tr>
                                        <th colSpan="4" className="has-text-centered" style={{backgroundColor: `lightsteelblue`}}>Product backlog</th>
                                    </tr>
                                </thead>
                                <thead>
                                    <tr style={{backgroundColor: `lightsteelblue`}}>
                                        <th>Product backlog ID</th>
                                        <th>Story point</th>
                                        <th>Time spent</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productBacklog.map((productBacklog) => (
                                        <tr>
                                            <td>{productBacklog.pbId}</td>
                                            <td>{productBacklog.pbPoint}</td>
                                            <td>{getTotalWorkHourOfPb(productBacklog.pbId, sprintBacklog)}</td>
                                            <td>{productBacklog.isPbDone ? "Done" : "Not done"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-one-half has-text-centered">
                            <button type="submit" className="button is-fullwidth is-info" onClick={() => handleNextSprint()}>
                                <strong>Next sprint</strong>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <EditSim active={activeEdit} handleClickModal={handleClickModalEdit} />
        </div>
    );
}

export default SprintReview;