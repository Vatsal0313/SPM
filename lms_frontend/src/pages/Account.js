import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { fetchEmp, getRolemaster, updateAccStatus } from '../api/auth';

const Account = () => {
  const [name, setName] = useState("");
  const [head, setHead] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empid, setEmpid] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [designation, setDesignation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log("Account creation:", empid, designation, name, head, role, email, password, status);

      await register({ empid, designation, name, head, role, email, password, status });
      const response = await fetchEmp();
      setEmployees(response.data);

      // Clear form fields
      setEmpid("");
      setDesignation("");
      setName("");
      setHead("");
      setRole("");
      setEmail("");
      setPassword("");
      setStatus("");

      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  const [employees, setEmployees] = useState([]); // dropdown
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    fetchEmployees();
    getRoles();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetchEmp();
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };
  const getRoles = async () => {
    try {
      const response = await getRolemaster();
      setRoles(response.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAccStatus(id, newStatus); // API call
      await fetchEmployees(); // Refresh list to reflect changes
      await getRoles();
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Create Users</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {/* Employee Form */}
        <form onSubmit={handleSignup} className="grid grid-cols-2 gap-6 mb-6">
          {/* Employee ID */}
          <div>
            <label className="block text-gray-700 font-medium">Employee ID</label>
            <input
              type="text"
              name="emp ID"
              value={empid}
              onChange={(e) => setEmpid(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-gray-700 font-medium">Designation</label>
            <input
              type="text"
              name="designation"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium">Name</label>
            <input
              type="text"
              name="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border rounded"
            />
          </div>
          {/* Head Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium">Head</label>
            <select
              value={head}
              onChange={(e) => setHead(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            >
              <option value="">{employees.length === 0 ? "Admin" : "Select Head"}</option>
              {employees.length === 0 ? (
                <option value="Admin">Admin</option>
              ) : (
                employees.filter((e) => e.status === "Active").map((r) => (
                  <option key={r._id} value={r.username}>
                    {r.username}
                  </option>
                ))
              )}
            </select>
          </div>
          {/* Role Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            >
              <option value="">{employees.length === 0 ? "Admin" : "Select Role"}</option>
              {employees.length === 0 ? (
                <option value="Admin">Admin</option>
              ) : (
                roles.filter((r) => r.status === "Active").map((r) => (
                  <option key={r._id} value={r.role}>
                    {r.role}
                  </option>
                ))
              )}
            </select>
          </div>
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Status</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          {/* Submit Button (Full Width) */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 text-lg"
            >
              Add Employee
            </button>
          </div>
        </form>

        {/* Employee List Table */}
        {employees.length > 0 && (
          <div className="overflow-x-auto mt-6">
            <h3 className="text-xl font-semibold mb-4">All Employees</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-3">Employee ID</th>
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Head</th>
                  <th className="border p-3">Designation</th>
                  <th className="border p-3">Role</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr key={index} className="text-center bg-white hover:bg-gray-100">
                    <td className="border p-3">{emp.employee_id}</td>
                    <td className="border p-3">{emp.username}</td>
                    <td className="border p-3">{emp.head}</td>
                    <td className="border p-3">{emp.designation}</td>
                    <td className="border p-3">{emp.role}</td>
                    <td className="border p-3">{emp.email}</td>
                    <td className="p-2 border">
                      <select
                        value={emp.status}
                        onChange={(e) => handleStatusChange(emp._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-sm font-semibold
                            ${emp.status.toLowerCase() === 'active' ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'}`}
                      >
                        <option className="bg-indigo-100 text-indigo-600" value="Active">Active</option>
                        <option className="bg-red-100 text-red-600" value="Inactive">Inactive</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
