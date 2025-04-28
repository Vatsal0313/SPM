import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import { fetchEmp } from '../api/auth';
import axios from 'axios';

const Signup = () => {
  const API_URL = process.env.REACT_APP_API_URL
  const [name, setName] = useState("");
  const [head, setHead] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empid, setEmpid] = useState("");
  const [role, setRole] = useState("");
  const [status, setStataus] = useState("");
  const [designation, setDesignation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]); // Store roles fro dropdown
  useEffect(() => {
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
        const response = await axios.get(`${API_URL}/fetchrolemaster`);
        setRoles(response.data);
      } catch (err) {
        console.error("Error fetching roles:", err);
      }
    };
    fetchEmployees();
    getRoles();
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // const res = await fetch("http://localhost:4000/api/auth/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, email, password }),
      // });

      // const data = await res.json();
      // if (!res.ok) throw new Error(data.error || "Signup failed");
      // console.log({empid, designation, name, role, email, password, status });

      await register({ empid, designation, name, role, email, password, status });

      navigate("/"); // ✅ Redirect to login on success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-semibold text-center">Sign Up</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          {/* <input
            type="text"
            placeholder="Head"
            value={head}
            onChange={(e) => setHead(e.target.value)}
            required
            className="w-full p-2 border rounded"
          /> */}
          {employees.length === 0 ? (
            <input
              type="text"
              placeholder="Head"
              value="Admin"
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          ) : (
            <select
              value={head}
              onChange={(e) => setHead(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Head</option>
              {employees.map((r) => (
                <option key={r._id} value={r.username}>
                  {r.username}
                </option>
              ))}
            </select>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Emp ID"
            value={empid}
            onChange={(e) => setEmpid(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Designation"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          {/* <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="w-full p-2 border rounded"
          /> */}
          {employees.length === 0 ? (
            <input
              type="text"
              placeholder="Role"
              value="Admin"
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          ) : (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r._id} value={r.role}>
                  {r.role}
                </option>
              ))}
            </select>
          )}
          <input
            type="text"
            placeholder="Status"
            value={status}
            onChange={(e) => setStataus(e.target.value)}
            required
            className="w-full p-2 border rounded"
          />
          <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Sign Up
          </button>
        </form>
        <p className="text-center">
          Already have an account?{" "}
          <a href="/" className="text-blue-500">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
