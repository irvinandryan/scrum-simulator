import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerAPI } from "../../../simulator-api/SimulatorApi";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        registerAPI(username, password, setError, navigate);
    };

    return (
        <div className="hero is-fullheight">
            <div className="hero-body">
                <div className="container">
                    <div className="columns is-full mt-5 has-background-white-ter">
                        <div className="column has-text-centered">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Username</label>
                                    <input
                                        type="text"
                                        style={{width: "35%"}}
                                        name="username"
                                        className="input is-normal"
                                        placeholder="Username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mt-2">
                                    <label className="label has-text-centered">Password</label>
                                    <input
                                        type="password"
                                        style={{width: "35%"}}
                                        name="password"
                                        className="input is-normal"
                                        placeholder="Password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <Link to="/" className="button is-danger mt-5 mr-2"><strong>Cancel</strong></Link>
                                <button className="button is-success mt-5 ml-2"><strong>Create account</strong></button>
                            </form>
                        </div>
                    </div>            
                </div>
            </div>
        </div>
    );
};

export default Register;