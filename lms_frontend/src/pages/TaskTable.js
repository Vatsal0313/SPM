import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash } from "lucide-react";
import { accdetails, getContact, fetchEmp, deleteTask, updateTaskStatus } from "../api/auth";

const TasksTable = ({ T, TA, TD }) => {
  // const API_URL = "http://localhost:4000/api/auth";
  const API_URL = process.env.REACT_APP_API_URL

  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("");
  const [contact, setContact] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignTo, setAssignTo] = useState("");
  const [assignBy, setAssignBy] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Incomplete");
  // const [acc, setAcc] = useState("Incomplete");
  const [contacts, setContacts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch(`${API_URL}/gettasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
    const getAcc = async () => {
      try {
        const response = await accdetails();
        setAssignBy(response.data.username)
      } catch (err) {
        setError("Failed to load account details.");
      }
    }
    const getContacts = async () => {
      const response = await getContact();
      setContacts(response.data)
    }
    const getEmp = async () => {
      const response1 = await accdetails();
      const response = await fetchEmp();
      const empl = response.data
      const id = response1.data._id
      const filteredEmployees = empl.filter(emp => emp._id !== id)
      // console.log("TT", filteredEmployees);

      setAccounts(filteredEmployees)
    }
    getAcc();
    getContacts();
    getEmp();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(task, priority, contact, startDate, dueDate, assignTo, assignBy, description, status);

    await axios.post(`${API_URL}/addtasks`, { task, priority, contact, startDate, dueDate, assignTo, assignBy, description, status });
    setTask("");
    setContact("");
    setPriority("");
    setStartDate("");
    setDueDate("");
    setAssignBy("");
    setAssignTo("");
    setDescription("");
    setStatus("Incomplete");
    setShowForm(true);
    await fetch(`${API_URL}/gettasks`)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      await fetch(`${API_URL}/gettasks`)
        .then((res) => res.json())
        .then((data) => setTasks(data))
        .catch((error) => console.error("Error fetching tasks:", error));;
    } catch (err) {
      // console.log(err.message);

      setError("Failed to delete lead.");
    }
  };

  const handleStatusChange = async (id, newStatus, assignTo) => {
    try {
      await updateTaskStatus(id, newStatus, assignTo); // API call
      await fetch(`${API_URL}/gettasks`)
        .then((res) => res.json())
        .then((data) => setTasks(data))
        .catch((error) => console.error("Error fetching tasks:", error)); // Refresh list to reflect changes
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : showForm ? (
      // {showForm ? (
        <div className="bg-white p-4 shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Tasks</h2>
            {TA && (
              <button
                className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600"
                onClick={() => setShowForm(false)}
              >
                Add
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Statuses</option>
              <option value="Completed">Completed</option>
              <option value="Incomplete">Incomplete</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Assignees</option>
              {accounts.map((c) => (
                <option key={c._id} value={c.username}>
                  {c.username}
                </option>
              ))}
            </select>
          </div>

          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="border px-4 py-2">Task ID</th>
                <th className="border px-4 py-2">Task</th>
                <th className="border px-4 py-2">Priority</th>
                <th className="border px-4 py-2">Contact</th>
                <th className="border px-4 py-2">Start Date</th>
                <th className="border px-4 py-2">Due Date</th>
                <th className="border px-4 py-2">Assign To</th>
                <th className="border px-4 py-2">Assign By</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Status</th>
                {TD && (
                  <th className="p-2 border">DELETE</th>
                )}
              </tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? (
                // tasks.map((task, index) => (
                tasks
                  .filter((task) =>
                    (filterStatus ? task.status === filterStatus : true) &&
                    (filterPriority ? task.priority === filterPriority : true) &&
                    (filterAssignee ? task.assignTo === filterAssignee : true)
                  )
                  .map((task, index) => (

                    <tr key={index}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{task.task}</td>
                      <td className="border px-4 py-2">{task.priority}</td>
                      <td className="border px-4 py-2">{task.contact}</td>
                      <td className="border px-4 py-2">{new Date(task.startDate).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{new Date(task.dueDate).toLocaleDateString()}</td>
                      <td className="border px-4 py-2">{task.assignTo}</td>
                      <td className="border px-4 py-2">{task.assignBy}</td>
                      <td className="border px-4 py-2">{task.description}</td>
                      {/* <td className="border px-4 py-2">{task.status}</td> */}
                      <td className="p-2 border">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value, task.assignTo)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold
                            ${task.status.toLowerCase() === 'completed' ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'}`}
                        >
                          <option className="bg-indigo-100 text-indigo-600" value="Completed">Completed</option>
                          <option className="bg-red-100 text-red-600" value="Incomplete">Incomplete</option>
                        </select>
                      </td>
                      {TD && (

                        <td className="p-2 border">
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
              ) : (
                <tr>
                  <td className="border px-4 py-2 text-center" colSpan="9">No data available in table</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-6 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">

            <h2 className="text-xl font-semibold mb-4">Add Task</h2>
            <button
              className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600"
              onClick={() => setShowForm(true)}
            >
              All
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6 mb-6">
            {/* Employee ID */}
            <div>
              <label className="block text-gray-700 font-medium">Task</label>
              <input
                type="text"
                name="task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Contact</label>
              <select
                name="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select Contact</option>
                {contacts.map((c) => (
                  <option key={c._id} value={c.contact_name}>
                    {c.contact_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Priority</label>
              <select
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                required
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full p-3 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="w-full p-3 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Assign To</label>
              <select
                name="assignTo"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                required
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select Assign To</option>
                {accounts.map((c) => (
                  <option key={c._id} value={c.username}>
                    {c.username}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Assign By</label>
              <input
                type="text"
                name="assignBy"
                value={assignBy}
                onChange={(e) => setAssignBy(e.target.value)}
                required
                className="w-full p-3 border rounded-lg"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Description</label>
              <input
                type="text"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-3 border rounded-lg"
              />
            </div>
            {/* Submit Button (Full Width) */}
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 text-lg"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TasksTable;
