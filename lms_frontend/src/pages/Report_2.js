import React, { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Report_2 = () => {
  const API_URL = 'http://localhost:4000/api/auth';

  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    startDate: "",
    endDate: "",
  });

  const [reportData, setReportData] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchReport = async () => {
    try {
      const res = await axios.post(`${API_URL}/reports/tasks`, filters);
      setReportData(res.data);
    } catch (err) {
      console.error("Error fetching task report:", err);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Task Report");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Task_Report.xlsx");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Task Report Generator</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option value="">Select Status</option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Incomplete</option>
        </select>
        <select
          name="priority"
          value={filters.priority}
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
                  <th key={key} className="border p-2 capitalize">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, idx) => (
                <tr key={idx}>
                  {Object.values(item).map((val, i) => (
                    <td key={i} className="border p-2">
                      {typeof val === "object" && val !== null
                        ? new Date(val).toLocaleDateString()
                        : val?.toString()}
                    </td>
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

export default Report_2;
