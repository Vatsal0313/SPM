import React, { useState, useEffect } from "react";
import { accdetails } from '../api/auth';
import { updateacc } from '../api/auth';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    employee_id: "",
    designation: "",
    username: "",
    email: "",
    department: "",
    phone_number: "",
    password: "",
    dob: "",
    address: "",
    role: "",
    head: ""
  });


  // Fetch account details on component mount
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await accdetails();
        // console.log("Se",response.data);

        if (response.data && response.data.dob) {
          const parsedDate = new Date(response.data.dob);
          if (!isNaN(parsedDate.getTime())) {  // Check if the date is valid
            response.data.dob = parsedDate.toISOString().split('T')[0];
          }
        }

        setFormData(response.data);
      } catch (err) {
        setError("Failed to load account details.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("Form Submitted:", formData);
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateacc(formData);
      alert("Account updated successfully!");
    } catch (err) {
      setError("Failed to update account.");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-7xl mx-4">
        <h2 className="text-3xl font-bold text-center mb-6">Account Details</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
            {/* Employee ID */}
            <div>
              <label className="block text-gray-700 font-medium">Employee ID</label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not allowed"
                readOnly
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-gray-700 font-medium">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not allowed"
                readOnly
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not allowed"
                readOnly
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium">Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not allowed"
                readOnly
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Head</label>
              <input
                type="text"
                name="head"
                value={formData.head}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not allowed"
                readOnly
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg bg-gray-100 cursor-not allowed"
                readOnly
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-gray-700 font-medium">Department</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* Phone No */}
            <div>
              <label className="block text-gray-700 font-medium">Phone No</label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 font-medium">Password</label>
              <input
                type="text"
                name="password"
                value={formData.hp}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-gray-700 font-medium">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>

            {/* Address */}
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="2"
                className="w-full p-3 border rounded-lg"
              ></textarea>
            </div>

            {/* Edit Button */}
            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 text-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Settings;
