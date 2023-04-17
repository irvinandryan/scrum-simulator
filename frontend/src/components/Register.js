import React, { useState } from "react";
import axios from "axios";
import { Router, useNavigate, useParams } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(process.env.REACT_APP_API + "/register", {
                username,
                password
            });
            navigate("/");
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
                alert(error.response.data.message);
            }
        }
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
                                <button className="button is-success mt-5"><strong>Create account</strong></button>
                            </form>
                        </div>
                    </div>            
                </div>
            </div>
        </div>
    );
};

export default Register;