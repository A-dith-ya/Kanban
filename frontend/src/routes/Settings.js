import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import '../styles.css'

export default function Settings() {
    let navigate = useNavigate();
    const [currentAccount, setCurrentAccount] = useState({})
    const [errorMsg, setErrorMsg] = useState('')

    const currentProfile = async () => {
        const response = await fetch('/account', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        const data = await response.json()
        setCurrentAccount({ ...data })
    }

    const updateAccount = async (e) => {
        e.preventDefault()
        const account = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value
        }
        if (e.target.name.value == "") delete account.name
        if (e.target.email.value == "") delete account.email
        if (e.target.password.value == "") delete account.password

        const response = await fetch('/account', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            },
            body: JSON.stringify(account)
        })

        if (response.status == 200) {
            setErrorMsg('Changed account details successfully!')
            const data = await response.json()
            setCurrentAccount({ ...data })
            console.log(account)
        } else {
            setErrorMsg('Incorrect account details')
        }
    }

    const deleteAccount = async () => {
        const response = await fetch('/account', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            }
        })

        if (response.status == 200) {
            localStorage.clear()
            navigate('/login', { replace: true })
        }
    }

    useEffect(() => {
        currentProfile()
    }, [])

    return (
        <main className="container">
            <Link to="/todo" className="link">Go back</Link>
            <h2 className="page-title">Current Profile</h2>
            <p>
                Name: {currentAccount.name}<br></br>
                Email: {currentAccount.email}
            </p>
            <form className="form-container" onSubmit={updateAccount}>
                <h2 className="register-title">Change Details</h2>
                <div className="form-container-inner">
                    <label>Name</label>
                    <input className="form-input" type="text" name="name" />
                </div>
                <div className="form-container-inner">
                    <label>Email</label>
                    <input className="form-input" type="text" name="email" />
                </div>
                <div className="form-container-inner">
                    <label>Password</label>
                    <input className="form-input" type="password" name="password" />
                </div>
                <p class='error-msg'>{errorMsg && errorMsg}</p>
                <input className="form-input" type="submit" value="Change" />
            </form>
            <button className="delete-btn" onClick={deleteAccount} >Delete Account</button>
        </main>
    )
}

