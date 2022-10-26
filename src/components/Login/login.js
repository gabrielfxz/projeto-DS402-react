import React, {useState} from "react";
import {useNavigate} from "react-router";

import "./Login.css";
import AuthService from "../../Services/AuthServices";

export default function Login() {
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(evento) {
        evento.presentDefault()
        const userForm = {username,password}
        if(!username || !password) {
            setMessage("Preencha o username e a senha para continuar!")
        } else{
            AuthService.login(username,password).then(
                () => {
                    console.log("localStorage: "+localStorage.getItem("user"))
                    navigate("/")
                    window.location.reload()
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString()
                    setMessage(resMessage)
                }
            )
        }
    }

    return (
        <div className="">

        </div>
    )
}