import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

const SprintReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [scrumTeamSize, setScrumTeamSize] = useState("");
    const [scrumTeamRate, setScrumTeamRate] = useState("");
    const [scrumTeamHour, setScrumTeamHour] = useState("");
    const [plannedCost, setPlannedCost] = useState("");
    const [sprintLength, setSprintLength] = useState("");
    const [plannedSprint, setPlannedSprint] = useState("");
    const [startDate, setStartDate] = useState("");
    const [productBacklog, setProductBacklog] = useState([]);
    const [sprintBacklog, setSprintBacklog] = useState([]);

    const getSimConfigById = async () => {
        const response = await axios.get(`http://localhost:5000/simConfigs/${id}`);
        setScrumTeamSize(response.data.scrumTeamSize);
        setScrumTeamRate(response.data.scrumTeamRate);
        setScrumTeamHour(response.data.scrumTeamHour);
        setPlannedCost(response.data.plannedCost);
        setSprintLength(response.data.sprintLength);
        setPlannedSprint(response.data.plannedSprint);
        setStartDate(response.data.startDate);
        setProductBacklog(response.data.productBacklog);
        setSprintBacklog(response.data.sprintBacklog);
    };

    useEffect(() => {
        getSimConfigById();
    }, []);

    const handleSprintReview = async () => {
        const response = await axios.post(`http://localhost:5000/simConfigs/${id}/sprintreview`);
        navigate(`/sprintreview/${id}`);
    }

    return (
        <div className="columns is-full mt-5">
            <div className="column is-full">
                <h1 className="title has-text-centered">Sprint Review</h1>
                <div className="columns is-full mt-5">
                    <div className="column is-full">
                        <h1 className="title has-text-centered">Sprint Backlog</h1>
                        <table className="table is-striped has-background-white-ter is-fullwidth mt-2">
                            <thead>
                                <tr>
                                    <th>Story Point</th>
                                    <th>Story</th>
                                    <th>Task</th>
                                    <th>Task Point</th>
                                    <th>Task Hour</th>
                                    <th>Task Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sprintBacklog.map((sprintBacklog) => (
                                    <tr className="has-text-left" key={sprintBacklog._id}>
                                        <td>{sprintBacklog.pbPoint}</td>
                                        <td>{sprintBacklog.pbStory}</td>
                                        <td>{sprintBacklog.pbTask}</td>
                                        <td>{sprintBacklog.pbTaskPoint}</td>
                                        <td>{sprintBacklog.pbTaskHour}</td>
                                        <td>{sprintBacklog.pbTaskCost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="columns is-full mt-5">
                    <div className="column is-full">
                        <h1 className="title has-text-centered">Product Backlog</h1>
                        <table className="table is-striped has-background-white-ter is-fullwidth mt-2">
                            <thead>
                                <tr>
                                    <th>Story Point</th>
                                    <th>Story</th>
                                    <th>Task</th>
                                    <th>Task Point</th>
                                    <th>Task Hour</th>
                                    <th>Task Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productBacklog.map((productBacklog) => (
                                    <tr className="has-text-left" key={productBacklog._id}>
                                        <td>{productBacklog.pbPoint}</td>
                                        <td>{productBacklog.pbStory}</td>
                                        <td>{productBacklog.pbTask}</td>
                                        <td>{productBacklog.pbTaskPoint}</td>
                                        <td>{productBacklog.pbTaskHour}</td>
                                        <td>{productBacklog.pbTaskCost}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="columns is-full mt-5">
                    <div className="column is-full">
                        <h1 className="title has-text-centered">Sprint Review</h1>
                        <table className="table is-striped has-background-white-ter is-fullwidth mt-2">
                            <thead>
                                <tr>
                                    <th>Scrum Team Size</th>
                                    <th>Scrum Team Rate</th>
                                    <th>Scrum Team Hour</th>
                                    <th>Planned Cost</th>
                                    <th>Sprint Length</th>
                                    <th>Planned Sprint</th>
                                    <th>Start Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="has-text-left">
                                    <td>{scrumTeamSize}</td>
                                    <td>{scrumTeamRate}</td>
                                    <td>{scrumTeamHour}</td>
                                    <td>{plannedCost}</td>
                                    <td>{sprintLength}</td>
                                    <td>{plannedSprint}</td>
                                    <td>{startDate}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="columns is-full mt-5">
                    <div className="column is-full">
                        <button className="button is-primary is-fullwidth" onClick={handleSprintReview}>Sprint Review</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SprintReview;