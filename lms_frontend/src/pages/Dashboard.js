import React, { useState, useEffect } from "react";
import axios from 'axios';
import { accdetails } from '../api/auth';

const Dashboard = () => {
  // console.log("DASHBOARD",user);
  
  // const API_URL = 'http://localhost:4000/api/auth';
  const API_URL = process.env.REACT_APP_API_URL
  const [totaldata, setToataldata] = useState("");
  const [employees, setEmployees] = useState([]);
  const [user, setUser] = useState([]);
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState([]);

  const fetchAccountDetails = async () => {
    try {
      const response = await accdetails();
      setUser(response.data.username);
      // setRole(response.data.role);
      console.log("R",response.data.username);

    } catch (err) {
      setError("Failed to load account details.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await accdetails();
        setUser(response.data.username);
        console.log("User fetched:", response.data.username);
      } catch (err) {
        setError("Failed to load account details.");
        setLoading(false);
      }
    };
    fetchAccountDetails();
  }, []);
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    // fetchAccountDetails();
    axios.get(`${API_URL}/dashboard/counts`)
      .then(response => {
        // console.log(response.data);
        setToataldata(response.data)
      })
      .catch(error => console.error("Error fetching contact counts:", error));
    axios.get(`${API_URL}/dashboard/hierarchy`)
      .then(response => {
        console.log("Hie", response.data,user);
        const filteredEmployees = response.data.filter((employee) =>
          employee.hierarchy.includes(user) || employee.username === user
        );
        setEmployees(filteredEmployees)
        // setEmployees(response.data)
      })
      .catch(error => console.error("Error fetching employees:", error));
  }, [user]);

  const filteredEmployees = employees.filter((employee) =>
    employee.hierarchy.includes(user) || employee.username === user
  );
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-lg font-semibold mb-4">Latest Updates</h2>
      <div className="grid grid-cols-6 gap-4 bg-white p-4 shadow-md rounded-lg">
        {[
          { label: "Total Contact", value: totaldata.totalContacts },
          { label: "Fresh Followup", value: totaldata.freshFollowup },
          { label: "Open Lead", value: totaldata.openLead },
          { label: "Close Lead", value: totaldata.closeLead },
          { label: "Cancel Lead", value: totaldata.cancelLead },
          // { label: "Lapsed Followup", value: 0, highlight: true },
        ].map((item, index) => (
          <div
            key={index}
            className={`p-2 border rounded text-center ${item.highlight ? "text-red-500" : "text-blue-500"}`}
          >
            <p className="text-gray-600 text-sm">{item.label}</p>
            <p className="text-lg font-bold">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 shadow-md rounded-lg mt-6">
        <h2 className="text-lg font-semibold mb-4">Employee Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <div key={employee._id} className="p-4 border rounded-lg shadow-md bg-gray-50">
              <p className="font-bold text-blue-600 mb-1">{`Employee: ${employee.username}`}</p>
              <p className="text-gray-500 text-sm mb-3">
                {employee.hierarchy.length > 0
                  ? `Hierarchy: ${employee.hierarchy.join(" → ")} → ${employee.username}`
                  : `No Head - ${employee.username}`}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  // { label: "Today Followup", value: employee.today_follow_up },
                  { label: "Open Lead", value: employee.open_lead },
                  { label: "Close Lead", value: employee.close_lead },
                  { label: "Cancel Lead", value: employee.cancel_lead },
                  { label: "Dormant Lead", value: employee.dormant_lead },
                  { label: "Completed Task", value: employee.completed_task },
                  { label: "Incomplete Task", value: employee.incomplete_task },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="p-2 border rounded text-center bg-white"
                  >
                    <p className="text-gray-600 text-sm">{item.label}</p>
                    <p className="text-lg font-semibold text-blue-500">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
export default Dashboard;
