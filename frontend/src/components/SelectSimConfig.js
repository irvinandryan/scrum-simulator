import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

const SelectSimConfig = () => {
    const [scrumTeamSize, setScrumTeamSize] = useState("");
    const [scrumTeamRate, setScrumTeamRate] = useState("");
    const [scrumTeamHour, setScrumTeamHour] = useState("");
    const [plannedCost, setPlannedCost] = useState("");
    const [sprintLength, setSprintLength] = useState("");
    const [plannedSprint, setPlannedSprint] = useState("");
    const [startDate, setStartDate] = useState("");
    const [productBacklog, setProductBacklog] = useState([]);
    const { id } = useParams();

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
    };

    useEffect(() => {
        getSimConfigById();
    }, []);

    return (
        // display the selected sim config
        <div className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                {/* <h2 className="subtitle has-text-centered">Selected</h2> */}
                    <div className="columns mt-5 has-background-white-ter">
                        <div className="column is-one-half has-text-centered">
                            <div className="column is-one-half has-text-centered">
                                <h2 className="subtitle">Scrum Team Size: {scrumTeamSize}</h2>
                                <h2 className="subtitle">Rate per Hour: {scrumTeamRate}</h2>
                                <h2 className="subtitle">Work Hour per Day: {scrumTeamHour}</h2>
                                <h2 className="subtitle">Planned Cost: {plannedCost}</h2>
                                <h2 className="subtitle">Sprint Length: {sprintLength}</h2>
                                <h2 className="subtitle">Days per Sprint: {plannedSprint}</h2>
                                <h2 className="subtitle">Start Date: {startDate.split('T')[0]}</h2>
                            </div>
                        </div>
                        <div className="column is-one-half">
                            <table className="table is-striped has-background-white-ter is-fullwidth mt-2">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Story Point</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productBacklog.map((pb) => (
                                        <tr>
                                            <td>{pb.pbId}</td>
                                            <td>{pb.pbPoint}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="columns">
                        <div className="column is-one-half has-text-centered">
                            <Link to={`/`}  className="button is-danger is-fullwidth">
                                Back
                            </Link>
                        </div>
                        <div className="column is-one-half has-text-centered">
                            <Link to={`/`} className="button is-info is-fullwidth">
                                Continue
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelectSimConfig;