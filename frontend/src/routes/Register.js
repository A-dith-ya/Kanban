import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import '../styles.css'

export default function Register() {
    let navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('')

    const createAccount = async (e) => {
        e.preventDefault()
        const account = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }

        const response = await fetch('/account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(account)
        })

        if (response.status == 201) {
            const data = await response.json()
            localStorage.setItem('account', JSON.stringify(data.account))
            localStorage.setItem('token', data.token)
            navigate("/todo", { replace: true })
        } else {
            setErrorMsg('Invalid account details')
        }
    }

    return (
        <main className="container">
            <h1 className="page-title">Manage Tasks Progress!</h1>
            <form className="form-container" onSubmit={createAccount}>
                <h2 className="register-title">Sign Up</h2>
                <div className="form-container-inner">
                    <label>Username</label>
                    <input className="form-input" type="text" name="name" placeholder="Type username" />
                </div>
                <div className="form-container-inner">
                    <label>Email</label>
                    <input className="form-input" type="text" name="email" placeholder="Type email" />
                </div>
                <div className="form-container-inner">
                    <label>Password</label>
                    <input className="form-input" type="password" name="password" placeholder="Type password" />
                </div>
                <input className="form-input" type="submit" value="Submit" />
            </form>
            <p>{errorMsg && errorMsg}</p>
            <Link to="/login" className="link">Alreday have an account?</Link>
        </main>
    )
}
