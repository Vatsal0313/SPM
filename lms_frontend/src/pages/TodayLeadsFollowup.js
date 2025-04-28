import React, { useState, useEffect } from "react";
import axios from "axios";

const TodayLeadsFollowup = ({user}) => {
  // const API_URL = "http://localhost:4000/api/auth";
  const API_URL = process.env.REACT_APP_API_URL
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchFollowups = async () => {
      try {
        
        const response = await axios.get(`${API_URL}/todaysfetchfollowups`);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // normalize to midnight
        
        const filteredContacts = response.data.filter(contact => {
          const followUpDates = contact.follow_up_Date;
          const index = contact.total_follow_up;
          
          // Check if contact is allocated to the current user
          if (
            contact.allocated_to[0] === user && // match allocated user
            index < followUpDates.length
          ) {
            const followUpDate = new Date(followUpDates[index]);
            followUpDate.setHours(0, 0, 0, 0); // normalize to midnight
    
            return followUpDate.getTime() === today.getTime();
          }
    
          return false;
        });
    
        setContacts(filteredContacts);
    
      } catch (err) {
        console.error("Error fetching contacts", err);
      }
    };
    fetchFollowups();
  }, [user]);



  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      
      {/* Search & Filter Section */}
      {/* <div className="bg-white p-4 shadow rounded-md mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <input type="date" className="border p-2 rounded w-full" placeholder="From Date" />
        <input type="date" className="border p-2 rounded w-full" placeholder="To Date" />
        <select className="border p-2 rounded w-full">
        <option>---Select Lead For---</option>
        </select>
        <select className="border p-2 rounded w-full">
        <option>---Select Lead Source---</option>
        </select>
        <select className="border p-2 rounded w-full">
        <option>All</option>
        </select>
        </div>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Search</button>
        </div> */}
      
      {/* Data Table */}
      <div className="bg-white p-4 shadow rounded-md">
        <h2 className="text-2xl font-bold mb-4">Today's Lead Follow-up's</h2>
        {/* <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
        <table className="w-full border-collapse border text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">SR NO</th>
              <th className="p-2 border">Next FU Date</th>
              <th className="p-2 border">Company Name</th>
              <th className="p-2 border">Person Name</th>
              <th className="p-2 border">Allocated To</th>
              <th className="p-2 border">Mobile No</th>
              <th className="border p-2">Lead For</th>
              <th className="border p-2">Lead Source</th>
              <th className="border p-2">Lead Status</th>
              <th className="border p-2">Lead Generate Date</th>
              <th className="p-2 border">Total Follow Up</th>
              <th className="p-2 border">Reporting Details</th>
              <th className="p-2 border">Last FU Date</th>
            </tr>
          </thead>
          <tbody>
          {contacts.length > 0 ? (
              contacts.map((contact, index) => (
                <tr key={contact._id || index} className="border">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{new Date(contact.follow_up_Date[contact.total_follow_up]).toLocaleDateString()}</td>
                  {/* <td className="p-2 border">{contact.nextFuTime}</td> */}
                  <td className="p-2 border">{contact.company_name}</td>
                  <td className="p-2 border">{contact.contact_name}</td>
                  <td className="p-2 border">{contact.allocated_to[contact.total_follow_up]}</td>
                  <td className="p-2 border">{contact.phone_number}</td>
                  <td className="p-2 border">{contact.lead_for}</td>
                  <td className="p-2 border">{contact.lead_source[contact.total_follow_up]}</td>
                  <td className="p-2 border">{contact.status}</td>
                  <td className="p-2 border">{new Date(contact.createdAt).toLocaleDateString()}</td>
                  <td className="p-2 border">{contact.total_follow_up}</td>
                  <td className="p-2 border">
                    {contact.reporting_details[contact.total_follow_up] !== "" 
                      ? contact.reporting_details[contact.total_follow_up] 
                      : "-"}
                  </td>
                  {/* <td className="p-2 border">{new Date(contact.follow_up_Date[contact.total_follow_up-1]).toLocaleDateString()}</td> */}
                  <td className="p-2 border">
  {contact.total_follow_up > 0
    ? new Date(contact.follow_up_Date[contact.total_follow_up - 1]).toLocaleDateString()
    : '-'}
</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="11" className="border p-2 text-center">
                  No Contacts Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodayLeadsFollowup;