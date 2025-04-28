// import React from "react";
// import { Pencil, Trash } from "lucide-react";

// const Leadsource = () => {
//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="bg-white p-4 shadow-md rounded-lg">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold">Lead Source Records</h2>
//           <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600">Add</button>
//         </div>

//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <label className="text-gray-600 text-sm">Show </label>
//             <select className="border p-1 rounded">
//               <option>10</option>
//               <option>25</option>
//               <option>50</option>
//             </select>
//             <label className="text-gray-600 text-sm"> entries</label>
//           </div>
//           <div>
//             <label className="text-gray-600 text-sm">Search:</label>
//             <input type="text" className="border p-1 rounded ml-2" />
//           </div>
//         </div>

//         <table className="w-full border-collapse border border-gray-200 rounded-lg">
//           <thead>
//             <tr className="bg-gray-100 text-gray-600 text-left">
//               <th className="p-2 border">SR NO</th>
//               <th className="p-2 border">LEAD SOURCE</th>
//               <th className="p-2 border">STATUS</th>
//               <th className="p-2 border">EDIT</th>
//               <th className="p-2 border">DELETE</th>
//             </tr>
//           </thead>
//           <tbody>
//             <tr className="text-center">
//               <td className="p-2 border">1</td>
//               <td className="p-2 border">Edge</td>
//               <td className="p-2 border">
//                 <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-semibold">ACTIVE</span>
//               </td>
//               <td className="p-2 border">
//                 <button className="text-indigo-500 hover:text-indigo-700">
//                   <Pencil size={16} />
//                 </button>
//               </td>
//               <td className="p-2 border">
//                 <button className="text-red-500 hover:text-red-700">
//                   <Trash size={16} />
//                 </button>
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
//           <span>Showing 1 to 1 of 1 entries</span>
//           <div className="flex items-center space-x-2">
//             <button className="p-1 px-2 border rounded bg-gray-200">Previous</button>
//             <input type="text" value="1" className="w-10 text-center border rounded" readOnly />
//             <button className="p-1 px-2 border rounded bg-gray-200">Next</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Leadsource;
import React, { useState, useEffect } from "react";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLeadSource, addLeadSource, deleteLeadSource, updateLeadSourceStatus } from "../api/auth";

const Leadsource = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [leadSource, setLeadSource] = useState("");
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const leadsource = await getLeadSource();
    setLeads(leadsource.data);
  };

  // Handle adding a new lead source
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addLeadSource({ leadSource, status });
      setError("");
      setIsAdding(false);
      setLeadSource("");
      await fetchLeads(); // Refresh list
      navigate("/home");
    } catch (err) {
      setError("Failed to add lead. It might already exist.");
    }
  };

  // Handle deleting a lead source
  const handleDelete = async (id) => {
    try {
      await deleteLeadSource(id);
      await fetchLeads(); // Refresh list
    } catch (err) {
      setError("Failed to delete lead.");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateLeadSourceStatus(id, newStatus); // API call
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
              <h2 className="text-2xl font-bold">Lead Source Records</h2>
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
            {/* Table for displaying lead source */}
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left">
                  <th className="p-2 border">SR NO</th>
                  <th className="p-2 border">LEAD SOURCE</th>
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
                        <td className="p-2 border">{lead.lead_source}</td>
                        <td className="p-2 border">
                          {/* <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            lead.status.toLowerCase() === 'active'
                              ? 'bg-indigo-100 text-indigo-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {lead.status.toUpperCase()}
                        </span> */}
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
              <h2 className="text-lg font-semibold">Add Lead Source</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                Back
              </button>
            </div>

            {/* Add Lead Source Form */}
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-gray-600">Lead Source</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
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

export default Leadsource;
