import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import '../styles.css'

export default function Login() {
    let navigate = useNavigate()
    const [errorMsg, setErrorMsg] = useState('')

    const login = async (e) => {
        e.preventDefault()

        const account = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        const response = await fetch('/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(account)
        })

        if (response.status == 200) {
            const data = await response.json()
            localStorage.setItem('account', JSON.stringify(data.account))
            localStorage.setItem('token', data.token)
            navigate("/todo", { replace: true })
        } else {
            setErrorMsg('Invalid account credentials')
        }
    }

    return (
        <main className="container" >
            <h1 className="page-title">Simple Kanban</h1>
            <form className="form-container" onSubmit={login}>
                <h2 className="register-title">Login</h2>
                <div className="form-container-inner">
                    <label >Email</label>
                    <input className="form-input" type="text" name="email" placeholder="Type email" />
                </div>
                <div className="form-container-inner">
                    <label>Password</label>
                    <input className="form-input" type="password" name="password" placeholder="Type password" />
                </div>
                <div className="form-container-inner">
                    <input className="form-input" type="submit" value="Login" />
                </div>
            </form>
            <p>{errorMsg && errorMsg}</p>
            <Link to="/" className="link">Create an account!</Link>
        </main>
    )
}

