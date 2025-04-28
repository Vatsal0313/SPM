import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLeadFor, addLeadFor, deleteLeadFor, updateLeadForStatus } from "../api/auth";


const Leadfor = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [leadFor, setLeadFor] = useState("");
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const leadfor = await getLeadFor();
    setLeads(leadfor.data);
  };

  // Handle adding a new lead for
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addLeadFor({ leadFor, status });
      setError("");
      setIsAdding(false);
      setLeadFor("");
      await fetchLeads(); // Refresh list
      navigate("/home");
    } catch (err) {
      setError("Failed to add lead. It might already exist.");
    }
  };

  // Handle deleting a lead for
  const handleDelete = async (id) => {
    try {
      await deleteLeadFor(id);
      await fetchLeads();
    } catch (err) {
      setError("Failed to delete lead.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeadForStatus(id, newStatus); // API call
      await fetchLeads(); // Refresh list to reflect changes
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  const [filterStatus, setFilterStatus] = useState("");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 shadow-md rounded-lg">
        {!isAdding ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Lead For Records</h2>
              <button
                onClick={() => setIsAdding(true)}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-4 mb-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            {/* Table for displaying lead for */}
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left">
                  <th className="p-2 border">SR NO</th>
                  <th className="p-2 border">LEAD FOR</th>
                  <th className="p-2 border">STATUS</th>
                  <th className="p-2 border">DELETE</th>
                </tr>
              </thead>
              <tbody>
                {leads.length > 0 ? (
                  // leads.map((lead, index) => (
                  leads
                    .filter((lead) =>
                      (filterStatus ? lead.status === filterStatus : true)
                    )
                    .map((lead, index) => (
                      <tr key={lead._id} className="text-center">
                        <td className="p-2 border">{index + 1}</td>
                        <td className="p-2 border">{lead.lead_for}</td>
                        <td className="p-2 border">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                            className={`px-3 py-1 rounded-full text-sm font-semibold
                            ${lead.status.toLowerCase() === 'active' ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'}`}
                          >
                            <option className="bg-indigo-100 text-indigo-600" value="Active">Active</option>
                            <option className="bg-red-100 text-red-600" value="Inactive">Inactive</option>
                          </select>
                        </td>
                        <td className="p-2 border">
                          <button
                            onClick={() => handleDelete(lead._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-4 text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Lead For</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                Back
              </button>
            </div>

            {/* Add Lead For Form */}
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-gray-600">Lead For</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={leadFor}
                  onChange={(e) => setLeadFor(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-600">Status</label>
                <select
                  className="border p-2 w-full rounded"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {error && (
                <div className="bg-yellow-100 text-red-600 p-3 border border-red-500 rounded mb-4">
                  {error}
                </div>
              )}

              <button
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600"
              >
                Save
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Leadfor;
