// const Report = () => {
//     return (
//     <div>Report</div>
//     );
// };

// export default Report;
import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Report = () => {
// const API_URL = 'http://localhost:4000/api/auth';
const API_URL = process.env.REACT_APP_API_URL
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    leadStatus: "",
    leadPriority: "",
  });
  const [reportData, setReportData] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchReport = async () => {
    try {
      const res = await axios.post(`${API_URL}/reports/leads`, filters);
      setReportData(res.data);
    } catch (err) {
      console.error("Error fetching report:", err);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lead Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Lead_Report.xlsx");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Lead Report Generator</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <select
          name="leadStatus"
          value={filters.leadStatus}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Select Lead Status</option>
          <option value="Open">Open</option>
          <option value="Close">Close</option>
          <option value="Cancel">Cancel</option>
          <option value="Dormant">Dormant</option>
        </select>
        <select
          name="leadPriority"
          value={filters.leadPriority}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div className="flex gap-4 mb-4">
        <button
          onClick={fetchReport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Generate Report
        </button>
        {reportData.length > 0 && (
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Export to Excel
          </button>
        )}
      </div>
      {reportData.length > 0 && (
        <div className="overflow-auto">
          <table className="min-w-full border">
            <thead>
              <tr>
                {Object.keys(reportData[0]).map((key) => (
                  <th key={key} className="border p-2">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, idx) => (
                <tr key={idx}>
                  {Object.values(item).map((val, i) => (
                    <td key={i} className="border p-2">{val?.toString()}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Report;
