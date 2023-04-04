import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

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
        <div>
            <h1>Selected Sim Config</h1>
            <h2>Scrum Team Size: {scrumTeamSize}</h2>
            <h2>Scrum Team Rate: {scrumTeamRate}</h2>
            <h2>Scrum Team Hour: {scrumTeamHour}</h2>
            <h2>Planned Cost: {plannedCost}</h2>
            <h2>Sprint Length: {sprintLength}</h2>
            <h2>Planned Sprint: {plannedSprint}</h2>
            <h2>Start Date: {startDate.split('T')[0]}</h2>
            <h2>Product Backlog: 
                {productBacklog.map((pb) => (
                    <div>
                        <h3>id: {pb.pbId}</h3>
                        <h3>Story Point: {pb.pbPoint}</h3>
                    </div>
                ))}
            </h2>
        </div>
    );
};

export default SelectSimConfig;