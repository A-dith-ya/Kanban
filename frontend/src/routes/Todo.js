import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import TodoList from "../components/TodoList";

export default function Todo() {
    let navigate = useNavigate()
    const [items, setItems] = useState([])
    const [errorMsg, setErrorMsg] = useState('')

    const logout = async () => {
        const response = await fetch('/account/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            }
        })
        if (response.status == 200) {
            localStorage.clear()
            navigate("/login", { replace: true });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const item = {
            title: e.target.title.value,
            description: e.target.description.value,
            state: e.target.state.value
        }

        const response = await fetch('/todo', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })

        if (response.status == 201) {
            setErrorMsg('')
            const data = await response.json()
            setItems([...items, data])
        } else {
            setErrorMsg('No title provided')
        }
    }

    const retrieveTodos = async () => {
        const response = await fetch('/todo', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.token}`
            }
        })

        if (response.status == 200) {
            const data = await response.json()
            setItems(data)
        }
    }

    useEffect(() => {
        retrieveTodos()
    }, [])

    return (
        <main className="container">
            <button className="logout-btn" onClick={logout}>Logout</button>
            <Link to="/settings" className="link logout-btn">Account Settings</Link>
            <form className="form-container" onSubmit={handleSubmit}>
                <h2 className="register-title">Add Task</h2>
                <div className="form-container-inner">
                    <label>Title</label>
                    <input className="form-input" type="text" name="title" placeholder="Task name" />
                </div>
                <p class='error-msg'>{errorMsg && errorMsg}</p>
                <div className="form-container-inner">
                    <label>Description</label>
                    <input className="form-input" type="text" name="description" placeholder="Optional" />
                </div>
                <div className="form-container-inner">
                    <label>Todo</label>
                    <input type="radio" name="state" value="TODO" defaultChecked />
                    <label>In Progress</label>
                    <input type="radio" name="state" value="IN PROGRESS" />
                    <label>Done</label>
                    <input className="form-input" type="radio" name="state" value="DONE" />
                </div>
                <input className="form-input" type="submit" value="Submit" />
            </form>
            <div className="kanban-boards">
                <TodoList title="Todo" items={items} retrieveTodos={retrieveTodos} />
                <TodoList title="In Progress" items={items} retrieveTodos={retrieveTodos} />
                <TodoList title="Done" items={items} retrieveTodos={retrieveTodos} />
            </div>
        </main>
    )
}


