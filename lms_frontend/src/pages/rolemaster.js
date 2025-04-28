import React, { useState, useEffect } from "react";
import { Plus, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { getRolemaster, addRolemaster, deleteRolemaster, updateRolemasterStatus } from "../api/auth";



const Rolemaster = () => {
  // const API_URL = 'http://localhost:4000/api/auth';
  const API_URL = process.env.REACT_APP_API_URL
  const [isAssigning, setIsAssigning] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [rolemaster, setRolemaster] = useState("");
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState({
    taskManagement: { all: false, add: false, delete: false },
    leads: { freshFollowup: false, repeatFollowup: false },
    manageContact: { all: false, add: false, delete: false },
  });

  const handleCheckboxChange = (category, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: !prev[category][permission],
      },
    }));
  };

  const handleRoleupdate = async (e) => {
    e.preventDefault();
    // console.log("Role:", selectedRole);
    // console.log("Permissions:", permissions);

    e.preventDefault();
    if (!selectedRole || !selectedRole._id) {
      alert("Please select a valid role to update.");
      return;
    }

    // console.log("Role:", selectedRole);
    // console.log("Permissions:", permissions);
    const roleE = selectedRole.role;
    const statuS = selectedRole.status;
    try {
      const response = await axios.put(`${API_URL}/roleupdate/${selectedRole._id}`, { roleE, statuS, permissions });
      if (response.ok) {
        alert("Role updated successfully!");
        fetchRoles(); // Refresh the role list after updating
      } else {
        // alert(data.message || "Failed to update role.");
      }
      setIsAssigning(false)
      await fetchRoles();
    } catch (error) {
      console.error("Error updating role:", error);
      alert("An error occurred while updating the role.");
    }

  };

  // Fetch Role records on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const role = await getRolemaster();
    // console.log("S",role.data.leads);
    setRoles(role.data);
  };

  // Handle adding a new Role
  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addRolemaster({ rolemaster, status });
      setError("");
      setIsAdding(false);
      setRolemaster("");
      await fetchRoles(); // Refresh list
      navigate("/home");
    } catch (err) {
      setError("Failed to add lead. It might already exist.");
    }
  };

  // Handle deleting a role
  const handleDelete = async (id) => {
    try {
      await deleteRolemaster(id);
      await fetchRoles(); // Refresh list
    } catch (err) {
      setError("Failed to delete lead.");
    }
  };
  const openAssignFunctionality = async (role, e) => {
    setSelectedRole(role);
    setIsAssigning(true);
    setPermissions(role.functionalities)
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateRolemasterStatus(id, newStatus); // API call
      await fetchRoles(); // Refresh list to reflect changes
    } catch (err) {
      setError("Failed to update status.");
    }
  };

  const [filterStatus, setFilterStatus] = useState("");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-4 shadow-md rounded-lg">
        {!isAdding && !isAssigning ? (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Role Master</h2>
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
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-left text-center">
                  <th className="p-2 border">SR NO</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Assign Functionality</th>
                  <th className="p-2 border">STATUS</th>
                  <th className="p-2 border">DELETE</th>
                </tr>
              </thead>
              <tbody>
                {roles.length > 0 ? (
                  roles
                  .filter((role)=>
                    (filterStatus ? role.status === filterStatus : true)
                  )
                  .map((role, index) => (
                    <tr key={role._id} className="text-center">
                      <td className="p-2 border">{index + 1}</td>
                      <td className="p-2 border">{role.role}</td>
                      <td className="p-2 border">
                        <button
                          onClick={() => openAssignFunctionality(role)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          {/* Assign */}
                          <Plus size={16} />
                        </button>
                      </td>
                      <td className="p-2 border">
                        <select
                          value={role.status}
                          onChange={(e) => handleStatusChange(role._id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold
                            ${role.status.toLowerCase() === 'active' ? 'bg-indigo-100 text-indigo-600' : 'bg-red-100 text-red-600'}`}
                        >
                          <option className="bg-indigo-100 text-indigo-600" value="Active">Active</option>
                          <option className="bg-red-100 text-red-600" value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td className="p-2 border">
                        <button
                          onClick={() => handleDelete(role._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </>
        ) : isAssigning ? (
          <>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold mb-4">Assign Functionality</h2>
                <button onClick={() => setIsAssigning(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Back</button>
              </div>
              <label className="block text-gray-700 mb-2">ROLE NAME</label>
              <input
                type="text"
                className="border p-2 w-full rounded mb-4"
                value={selectedRole.role}
                onChange={(e) => setSelectedRole(e.target.value)}
                placeholder="Role"
                readOnly
              />
              <h3 className="font-semibold text-gray-700 mb-2">ASSIGN FUNCTIONALITY</h3>
              <div className="grid grid-cols-3 gap-4">
                {Object.keys(permissions).map((category) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-semibold text-gray-800">{category.replace(/([A-Z])/g, ' $1')}</h4>
                    {Object.keys(permissions[category]).map((permission) => (
                      <label key={permission} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={permissions[category][permission]}
                          onChange={() => handleCheckboxChange(category, permission)}
                          className="form-checkbox"
                        />
                        <span className="text-gray-700">{permission.replace(/([A-Z])/g, ' $1')}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
              <button
                onClick={handleRoleupdate}
                className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded-lg w-full hover:bg-indigo-600"
              >
                Assign
              </button>
            </div>
            {/* </div> */}


            {/* <h2 className="text-xl font-bold mb-4">Assign Functionality - {selectedRole}</h2> */}
            {/* Assign functionality form goes here */}

            {/* </div> */}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Add Roles</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
              >
                Back
              </button>
            </div>

            {/* Add Role Form */}
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="block text-gray-600">Role</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={rolemaster}
                  onChange={(e) => setRolemaster(e.target.value)}
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

// const AssignFunctionality = ({ role, setIsAssigning }) => {
//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-4">Assign Functionality - {role.role}</h2>
//       {/* Assign functionality form goes here */}
//       <button onClick={() => setIsAssigning(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Back</button>
//     </div>
//   );
// };

export default Rolemaster;
