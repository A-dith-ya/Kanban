import React from "react";

export default function TodoList(props) {
    const changeState = async (itemId, itemState) => {
        let state = ''
        switch (itemState) {
            case 'TODO':
                state = 'IN PROGRESS';
                break;
            case 'IN PROGRESS':
                state = 'DONE';
                break;
            case 'DONE':
                return deleteItem(itemId)
        }

        const response = await fetch(`todo/${itemId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            },
            body: JSON.stringify({ state })
        })

        if (response.status == 201) {
            props.retrieveTodos()
        }
    }

    const deleteItem = async (itemId) => {
        const response = await fetch(`todo/${itemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.token}`
            }
        })

        if (response.status == 200) {
            props.retrieveTodos()
        }
    }

    const todoItems = props.items.map((item) => {
        if (item.state == props.title.toUpperCase())
            return (
                <div className="kanban-board-item">
                    <p className="kanban-board-item-title">{item.title}</p>
                    {item.description && <p className="kanban-board-item-desc">{item.description}</p>}
                    <button className="kanban-board-item-btn" onClick={e => changeState(item._id, item.state)}>Next Stage</button>
                </div>)
    })

    return (
        <div className="kanban-board">
            <h1>{props.title}</h1>
            {todoItems}
        </div>
    )
}