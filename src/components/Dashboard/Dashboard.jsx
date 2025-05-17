    import React, { useEffect, useState } from "react";
    import axios from "axios";
    import { useNavigate } from "react-router-dom";
    import Datetime from "react-datetime";
    import "react-datetime/css/react-datetime.css";
    import moment from "moment";

    import { ErrorPopup } from "../ErrorPopup/ErrorPopup";

    import "./Dashboard.css";

    export const Dashboard = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [useremail, setEmail] = useState(localStorage.getItem("email"));
    const [editingTaskId, setEditingTaskid] = useState(null);
    const [editedTask, setEditedTask] = useState({});
    const [newTask, setNewTask] = useState(null);
    const [error, setError] = useState("");

    const username = useremail ? useremail.split("@")[0] : "User";

    useEffect(
        () => {
        //useeffect is mainly used to authentication, mainly used to communicate outside
        if (!useremail) {
            navigate("/login");
        } else {
            fetchTask();
        }
        },
        [useremail] //it is dependancy , ie it tells recat to when to re run this effet , it will run on
        // 1-> initilay mount time and 2-> when the user email value changes
    );

    const fetchTask = async () => {
        try {
        const response = await axios.get(
            `http://localhost:4001/tasks/${useremail}`
        ); //
        setTasks(response.data || []);
        console.log("response", response.data);
        } catch (error) {
        setError(error.message || "Error in Fetching data from backend");
        console.error("Error in Fetching data from backend");
        }
    };

    const handleAddTask = () => {
        setNewTask({
        createdDate: new Date().toISOString().split("T")[0],
        task: "",
        completedBy: "",
        });
    };

    const handleTaskChange = (e) => {
        setNewTask({
        ...newTask,
        [e.target.name]: e.target.value /*[] is to detect dynamic change*/,
        });
    };

    const handleSaveNewTask = async () => {
        //if (!newTask.task) return;
        // setError("")

        if (!newTask || !newTask.task.trim()) {
        setError("Task description cannot be empty.");
        return;
        }

        if (newTask) {
        try {
            const response = await axios.post("http://localhost:4001/addnewtask", {
            ...newTask,
            email: useremail,
            });
            // console.log("Before fetchinh new task  ");
            await fetchTask();
            // console.log("fetch new task completed  ");
            setNewTask(null);
        } catch {
            setError(error.message || "error in saving task");
            console.error("error in saving task");
            // setError(error)
        }
        }
    };

    const handleEdit = (task) => {
        setEditingTaskid(task._id);
        setEditedTask({ ...task }); /*copying the shallow copy (refernce)*/
    };

    const handleDeleteTask = async (taskid) => {
        if (window.confirm("Are you Sure to Delete this task?")) {
        try {
            console.log("err := ", taskid);
            await axios.delete(`http://localhost:4001/deletetask/${taskid}`);
            fetchTask();
        } catch (error) {
            setError(error.message || "Error occured during Deleting Task");
            console.error("error in Deleting Task :", error);
        }
        }
    };

    const handleInputChange = (e) => {
        setEditedTask({
        ...editedTask,
        [e.target.name]: e.target.value /*[] is to detect dynamic change*/,
        });
    };

    const handleSaveEdit = async () => {
        if (!editedTask || !editedTask.task.trim()) {
        setError("Task description cannot be empty.");
        return;
        }
        try {
        const response = await axios.put(
            `http://localhost:4001/updatetask/${editingTaskId}`,
            { ...editedTask, email: useremail }
        );
        console.log("response : ", response.data);
        fetchTask();
        setEditingTaskid(null);
        } catch {
        setError(error.message || "Error in updating task");
        console.error("Error in updating task");
        }
    };

    const handleCancelEdit = (e) => {
        setEditingTaskid(null);
        setEditedTask({});
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you Sure to Delete this task?")) {
        try {
        await axios.delete(`http://localhost:4001/deleteaccount/${useremail}`);
        //   localStorage.removeItem("email");
        //   navigate("/Login");
            handleLogOut();
        } catch (error) {
        setError(error.message || "Error in deleting account");
        console.error("Error in deleting account");
        }
        }
    }

    const handleLogOut = () => {
        localStorage.removeItem("email");
        navigate("/Login");
    };

    return (
        <div className="dashboard-container">
        {error && <ErrorPopup message={error} onClose={() => setError("")} />}
        <div className="content-wrapper">
            <div className="header">
            <h2>Welcome {username}</h2>
            <div className="header-btn">
                <button className="logout-btn" onClick={handleLogOut}>
                Logout
                </button>
                <button className="add-btn" onClick={() => handleAddTask()}>
                ➕ Add
                </button>
                <button className="settings-btn">
                    ⚙️
                </button>
                <button class = "acntdelete-btn" onClick={handleDeleteAccount}>
                    🗑️ Account 
                </button>
            </div>
            </div>
            <div className="task-section">
            <h3>Your Task List</h3>
            {/* {console.log("length",tasks.Created)}
                    {console.log("Created:", tasks[0]?.Created)} */}
            {tasks.length > 0 ? (
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
                        <td>
                        {editingTaskId === task._id ? (
                            <>
                            <input
                                type="text"
                                name="task"
                                value={editedTask.task}
                                onChange={handleInputChange}
                            />
                            </>
                        ) : (
                            task.task
                        )}
                        </td>
                        <td>
                        {editingTaskId === task._id ? (
                            // <input
                            //     type="text"
                            //     name='completedBy'
                            //     value={editedTask.completedBy}
                            //     onChange={handleInputChange}
                            // />
                            <Datetime
                            value={moment(editedTask.completedBy)}
                            onChange={(date) =>
                                setEditedTask({
                                ...editedTask,
                                completedBy: moment(date).toISOString(),
                                })
                            }
                            inputProps={{ placeholder: "Select Date and Time",
                                    className: "custom-datetime-input",
                            }}
                            />
                        ) : // task.completedBy || "Not set"
                        task.completedBy ? (
                            moment(task.completedBy).format("YYYY-MM-DD hh:mm A")
                        ) : (
                            "Not set"
                        )}
                        </td>
                        <td>
                        {editingTaskId === task._id ? (
                            // returning multiple elements <> ..</>
                            <>
                            <button
                                className="save-btn"
                                onClick={() => handleSaveEdit()}
                            >
                                ✔️ Save
                            </button>
                            <button
                                className="cancel-btn"
                                onClick={() => handleCancelEdit()}
                            >
                                ❌ Cancel
                            </button>
                            </>
                        ) : (
                            <>
                            <button
                                className="edit-btn"
                                onClick={() => handleEdit(task)}
                            >
                                ✏️ Edit
                            </button>
                            <button
                                className="dlt-btn"
                                onClick={() => handleDeleteTask(task._id)}
                            >
                                🗑️ Delete
                            </button>
                            {/* <button className="add-task" onClick={handleAddTask}>➕</button> */}
                            </>
                        )}
                        </td>
                    </tr>
                    ))}
                    {newTask && (
                    <tr>
                        <td>{newTask.createdDate}</td>
                        <td>
                        <input
                            type="text"
                            name="task"
                            placeholder="Enter Task"
                            value={newTask.task}
                            onChange={handleTaskChange}
                        />
                        </td>
                        <td>
                        {/* <input
                            type="text"
                            name="completedBy"
                            placeholder="Enter Completeed by"
                            value={newTask.completedBy}
                            onChange={handleTaskChange}
                        /> */}

                        <Datetime
                            value={moment(newTask.completedBy)}
                            onChange={(date) =>
                            setNewTask({
                                ...newTask,
                                completedBy: moment(date).toISOString(),
                            })
                            }
                            inputProps={{ placeholder: "Select Date and Time",
                                className: "custom-datetime-input",
                            }}
                        />
                        </td>
                        <td>
                        <button
                            className="save-btn"
                            onClick={async () => {
                            await handleSaveNewTask();
                            }}
                        >
                            ✔️ Save
                        </button>
                        <button
                            className="cancel-btn"
                            onClick={() => setNewTask(null)}
                        >
                            ❌ Cancel
                        </button>
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            ) : (
                <p>No Tasks found</p>
            )}
            </div>
        </div>
        </div>
    );
    };
