import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, Download } from "lucide-react";
import employeeData from "../assets/attendace.json";
import MainLayout from "../components/layout/MainLayout";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Attendance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    name: "",
    status: "",
  });
  const [filteredData, setFilteredData] = useState([]);
  const [statuses, setStatuses] = useState(employeeData.map((emp) => emp.status));
  const [showExportOptions, setShowExportOptions] = useState(false);
  const exportRef = useRef();

  const uniqueNames = [...new Set(employeeData.map((e) => e.name))];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setShowExportOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const filtered = employeeData
      .map((emp, index) => ({
        ...emp,
        status: statuses[index],
      }))
      .filter((emp) => {
        const empDate = new Date(emp.date);
        const from = filters.startDate ? new Date(filters.startDate) : null;
        const to = filters.endDate ? new Date(filters.endDate) : null;

        // Reset time part for date comparison
        if (from) from.setHours(0, 0, 0, 0);
        if (to) to.setHours(23, 59, 59, 999);
        empDate.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

        const matchesSearch = [emp.name, emp.department, emp.designation].some((field) =>
          field.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesDate = (!from || empDate >= from) && (!to || empDate <= to);
        const matchesName = !filters.name || emp.name === filters.name;
        const matchesStatus = !filters.status || emp.status === filters.status;

        return matchesSearch && matchesDate && matchesName && matchesStatus;
      });

    setFilteredData(filtered);
  }, [searchTerm, filters, statuses]);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...statuses];
    updated[index] = newStatus;
    setStatuses(updated);
  };

  const handleExportCSV = () => {
    const header = [
      "Employee Name",
      "Designation",
      "Department",
      "Date",
      "In Time",
      "In Location",
      "Out Time",
      "Out Location",
      "Work Hours",
      "Status",
    ];
    const rows = filteredData.map((emp) => [
      emp.name,
      emp.designation,
      emp.department,
      emp.date,
      emp.inTime,
      emp.inLocation,
      emp.outTime,
      emp.outLocation,
      emp.workHours,
      emp.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title with date range if specified
    let title = "Attendance Report";
    if (filters.startDate || filters.endDate) {
      title += ` (${filters.startDate || 'Start'} to ${filters.endDate || 'End'})`;
    }
    doc.text(title, 14, 15);
    
    const tableColumn = [
      "Employee Name",
      "Designation",
      "Department",
      "Date",
      "In Time",
      "In Location",
      "Out Time",
      "Out Location",
      "Work Hours",
      "Status",
    ];
    
    const tableRows = filteredData.map((emp) => [
      emp.name,
      emp.designation,
      emp.department,
      emp.date,
      emp.inTime,
      emp.inLocation,
      emp.outTime,
      emp.outLocation,
      emp.workHours,
      emp.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
    });

    doc.save("attendance.pdf");
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Attendance Management</h2>

        {/* Header Controls */}
        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="relative w-60">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From:</label>
            <input
              type="date"
              className="border px-2 py-1 rounded"
              value={filters.startDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To:</label>
            <input
              type="date"
              className="border px-2 py-1 rounded"
              value={filters.endDate}
              onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
            />
          </div>

          <select
            className="border px-2 py-1 rounded"
            value={filters.name}
            onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
          >
            <option value="">All Employees</option>
            {uniqueNames.map((name, i) => (
              <option key={i} value={name}>
                {name}
              </option>
            ))}
          </select>

          <select
            className="border px-2 py-1 rounded"
            value={filters.status}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Half Day">Half Day</option>
          </select>

          <button 
            className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100"
            onClick={() => {
              setFilters({
                startDate: "",
                endDate: "",
                name: "",
                status: "",
              });
              setSearchTerm("");
            }}
          >
            Clear Filters
          </button>

          {/* Export Dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => setShowExportOptions((prev) => !prev)}
              className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100"
            >
              <Download size={16} />
              Export
            </button>
            {showExportOptions && (
              <div className="absolute z-10 mt-2 w-40 bg-white border rounded shadow">
                <button
                  onClick={handleExportCSV}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Export as CSV
                </button>
                <button
                  onClick={handleExportPDF}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Date range display */}
        {(filters.startDate || filters.endDate) && (
          <div className="mb-4 text-sm text-gray-600">
            Showing attendance from: <span className="font-medium">{filters.startDate || 'Beginning'}</span> to <span className="font-medium">{filters.endDate || 'Today'}</span>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border shadow-sm">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3">Employee Name</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">In Time</th>
                <th className="px-4 py-3">In Location</th>
                <th className="px-4 py-3">Out Time</th>
                <th className="px-4 py-3">Out Location</th>
                <th className="px-4 py-3">Work Hours</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((emp, i) => {
                  const index = employeeData.findIndex(
                    (e) =>
                      e.name === emp.name && e.date === emp.date && e.inTime === emp.inTime
                  );
                  return (
                    <tr key={i} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{emp.name}</td>
                      <td className="px-4 py-2">{emp.designation}</td>
                      <td className="px-4 py-2">{emp.department}</td>
                      <td className="px-4 py-2">{emp.date}</td>
                      <td className="px-4 py-2">{emp.inTime}</td>
                      <td className="px-4 py-2">{emp.inLocation}</td>
                      <td className="px-4 py-2">{emp.outTime}</td>
                      <td className="px-4 py-2">{emp.outLocation}</td>
                      <td className="px-4 py-2">{emp.workHours}</td>
                      <td className="px-4 py-2">
                        <select
                          value={statuses[index]}
                          onChange={(e) => handleStatusChange(index, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            statuses[index] === "Present"
                              ? "bg-green-100 text-green-700"
                              : statuses[index] === "Absent"
                              ? "bg-red-100 text-red-700"
                              : statuses[index] === "Late"
                              ? "bg-yellow-100 text-yellow-700"
                              : statuses[index] === "Half Day"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                          <option value="Half Day">Half Day</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="px-4 py-4 text-center text-gray-500">
                    No attendance records found for the selected filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Attendance;