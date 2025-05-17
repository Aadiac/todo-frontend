import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import "./Dashboard.css"

export const Dashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [useremail, setEmail] = useState(localStorage.getItem("email"));
    const [editingTaskId, setEditingTaskid] = useState(null);
    const [editedTask, setEditedTask] = useState({});
    const [newTask, setNewTask] = useState(null);

    const username = useremail ? useremail.split("@")[0] : "User";

    useEffect(() => {
        if (!useremail) {
            navigate("/login");
        } else {
            fetchTask();
        }
    }, [useremail]);

    const fetchTask = async () => {
        try {
            const response = await axios.get(`http://localhost:4001/tasks/${useremail}`);
            setTasks(response.data || []);
        } catch (error) {
            console.error("Error in Fetching data from backend");
        }
    };

    const handleEdit = (task) => {
        setEditingTaskid(task._id);
        setEditedTask({ ...task });
    };

    const handleInputChange = (e) => {
        setEditedTask({
            ...editedTask,
            [e.target.name]: e.target.value,
        });
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(`http://localhost:4001/updatetask/${editingTaskId}`, { ...editedTask, email: useremail });
            fetchTask();
            setEditingTaskid(null);
        } catch {
            console.error("Error in updating task");
        }
    };

    const handleCancelEdit = () => {
        setEditingTaskid(null);
        setEditedTask({});
    };

    const handleAddTask = () => {
        setNewTask({
            createdDate: new Date().toISOString().split('T')[0],
            task: "",
            completedBy: ""
        });
    };

    const handleNewTaskChange = (e) => {
        setNewTask({
            ...newTask,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveNewTask = async () => {
        if (!newTask.task) return;
        try {
            await axios.post("http://localhost:4001/addtask", { email: useremail, task: newTask });
            fetchTask();
            setNewTask(null);
        } catch (error) {
            console.error("Error adding task", error);
        }
    };

    const handleLogOut = () => {
        localStorage.removeItem("email");
        navigate("/Login");
    };

    return (
        <div className="dashboard-container">
            <div className="content-wrapper">
                <div className="header">
                    <h2>Welcome {username}</h2>
                    <button className="logout-btn" onClick={handleLogOut}>Logout</button>
                </div>
                <div className="task-section">
                    <h3>Your Task List</h3>
                    {tasks.length > 0 || newTask ? (
                        <table className="task-table">
                            <thead>
                                <tr>
                                    <th>Created Date</th>
                                    <th>Task</th>
                                    <th>Completed By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.map((task, index) => (
                                    <tr key={index}>
                                        <td>{task.createdDate}</td>
                                        <td>{editingTaskId === task._id ? (
                                            <input type="text" name="task" value={editedTask.task} onChange={handleInputChange} />
                                        ) : (task.task)}</td>
                                        <td>{editingTaskId === task._id ? (
                                            <input type="text" name='completedBy' value={editedTask.completedBy} onChange={handleInputChange} />
                                        ) : (task.completedBy || "Not set")}</td>
                                        <td>{editingTaskId === task._id ? (
                                            <>
                                                <button className="save-btn" onClick={handleSaveEdit}>✔️ Save</button>
                                                <button className="cancel-btn" onClick={handleCancelEdit}>❌ Cancel</button>
                                            </>
                                        ) : (
                                            <button className="edit-btn" onClick={() => handleEdit(task)}>✏️ Edit</button>
                                        )}</td>
                                    </tr>
                                ))}
                                {newTask && (
                                    <tr>
                                        <td>{newTask.createdDate}</td>
                                        <td>
                                            <input type="text" name="task" placeholder="Enter task" value={newTask.task} onChange={handleNewTaskChange} />
                                        </td>
                                        <td>
                                            <input type="text" name="completedBy" placeholder="Completed by" value={newTask.completedBy} onChange={handleNewTaskChange} />
                                        </td>
                                        <td>
                                            <button className="save-btn" onClick={handleSaveNewTask}>✔️ Save</button>
                                            <button className="cancel-btn" onClick={() => setNewTask(null)}>❌ Cancel</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    ) : (<p>No Tasks found</p>)}
                </div>
                <div className="actions">
                    <button className="add-task" onClick={handleAddTask}>➕</button>
                    <button className="settings">⚙️</button>
                </div>
            </div>
        </div>
    );
};
