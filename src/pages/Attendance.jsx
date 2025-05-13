import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, Filter, Download } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import StatusChip from "../components/ui/StatusChip.jsx";
import { format } from 'date-fns';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { attendanceService } from "../api/services/attendance.service.js";

// Constants
const RECORDS_PER_PAGE = 10;
const TABLE_COLUMNS = [
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

const Attendance = () => {
    // State management
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        dateRange: {
            startDate: null,
            endDate: null,
            key: 'selection'
        },
        name: "",
        status: "",
    });
    const [filteredData, setFilteredData] = useState([]);
    const [showExportOptions, setShowExportOptions] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    // Refs
    const exportRef = useRef();
    const datePickerRef = useRef();

    // Memoized values
    const uniqueNames = useMemo(() => [...new Set(filteredData.map((e) => e.name))], [filteredData]);
    
    const { currentRecords, totalPages } = useMemo(() => {
        const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
        const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
        const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);
        const totalPages = Math.ceil(filteredData.length / RECORDS_PER_PAGE);
        
        return { currentRecords, totalPages };
    }, [currentPage, filteredData]);

    // Data transformation and filtering
    const transformAttendanceData = useCallback((data) => {
        return data.map((emp) => ({
            name: emp.employee_name,
            designation: emp.designation || "N/A",
            department: emp.department || "N/A",
            date: emp.date,
            inTime: emp.check_in_time ? format(new Date(emp.check_in_time), "HH:mm") : "-",
            inLocation: emp.check_in_location || "-",
            outTime: emp.check_out_time ? format(new Date(emp.check_out_time), "HH:mm") : "-",
            outLocation: emp.check_out_location || "-",
            workHours: emp.duration || "-",
            status: emp.status || "N/A",
        }));
    }, []);

    const filterAttendanceData = useCallback((data) => {
        return data.filter((emp) => {
            const empDate = new Date(emp.date);
            const from = filters.dateRange.startDate ? new Date(filters.dateRange.startDate) : null;
            const to = filters.dateRange.endDate ? new Date(filters.dateRange.endDate) : null;

            if (from) from.setHours(0, 0, 0, 0);
            if (to) to.setHours(23, 59, 59, 999);
            empDate.setHours(12, 0, 0, 0);

            const matchesSearch = [emp.name, emp.department, emp.designation].some((field) =>
                field.toLowerCase().includes(searchTerm.toLowerCase())
            );
            const matchesDate = (!from || empDate >= from) && (!to || empDate <= to);
            const matchesName = !filters.name || emp.name === filters.name;
            const matchesStatus = !filters.status || emp.status === filters.status;

            return matchesSearch && matchesDate && matchesName && matchesStatus;
        });
    }, [searchTerm, filters]);

    // Data fetching
    const fetchAttendance = useCallback(async () => {
        setIsLoading(true);
        try {
            const result = await attendanceService.getAll();
            const transformed = transformAttendanceData(result);
            const filtered = filterAttendanceData(transformed);
            setFilteredData(filtered);
        } catch (error) {
            console.error("Failed to fetch or filter attendance data", error);
        } finally {
            setIsLoading(false);
        }
    }, [transformAttendanceData, filterAttendanceData]);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    // Export functions
    const handleExportCSV = useCallback(() => {
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
        
        const csvContent = "data:text/csv;charset=utf-8," +
            [TABLE_COLUMNS, ...rows].map((e) => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "attendance.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [filteredData]);

    const handleExportPDF = useCallback(() => {
        const doc = new jsPDF();
        
        // Add title with date range if specified
        let title = "Attendance Report";
        if (filters.dateRange.startDate || filters.dateRange.endDate) {
            const start = filters.dateRange.startDate ? 
                format(new Date(filters.dateRange.startDate), "dd MMM yyyy") : 'Start';
            const end = filters.dateRange.endDate ? 
                format(new Date(filters.dateRange.endDate), "dd MMM yyyy") : 'End';
            title += ` (${start} to ${end})`;
        }
        doc.text(title, 14, 15);

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
            head: [TABLE_COLUMNS],
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
    }, [filteredData, filters.dateRange]);

    // Date range handlers
    const handleDateRangeChange = useCallback((item) => {
        setFilters(prev => ({
            ...prev,
            dateRange: item.selection
        }));
    }, []);

    const formatDateRangeDisplay = useCallback(() => {
        if (!filters.dateRange.startDate && !filters.dateRange.endDate) {
            return "Select Date Range";
        }
        const start = filters.dateRange.startDate ? 
            format(new Date(filters.dateRange.startDate), "dd MMM yyyy") : '';
        const end = filters.dateRange.endDate ? 
            format(new Date(filters.dateRange.endDate), "dd MMM yyyy") : '';
        return `${start} - ${end}`;
    }, [filters.dateRange]);

    const clearDateRange = useCallback(() => {
        setFilters(prev => ({
            ...prev,
            dateRange: {
                startDate: null,
                endDate: null,
                key: 'selection'
            }
        }));
    }, []);

    // Click outside handlers
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (exportRef.current && !exportRef.current.contains(e.target)) {
                setShowExportOptions(false);
            }
            if (datePickerRef.current && !datePickerRef.current.contains(e.target)) {
                setShowDatePicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Clear all filters
    const clearAllFilters = useCallback(() => {
        setFilters({
            dateRange: {
                startDate: null,
                endDate: null,
                key: 'selection'
            },
            name: "",
            status: "",
        });
        setSearchTerm("");
    }, []);

    return (
        <MainLayout>
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Attendance Management</h2>

                {/* Header Controls */}
                <div className="flex flex-wrap gap-4 items-center mb-6">
                    {/* Search Input */}
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

                    {/* Date Range Picker */}
                    <div className="relative" ref={datePickerRef}>
                        <button
                            onClick={() => setShowDatePicker(!showDatePicker)}
                            className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100"
                        >
                            <Filter size={16} />
                            {formatDateRangeDisplay()}
                            {filters.dateRange.startDate && (
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        clearDateRange();
                                    }}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    ×
                                </button>
                            )}
                        </button>
                        {showDatePicker && (
                            <div className="absolute z-10 mt-2 bg-white border rounded shadow-lg">
                                <DateRange
                                    editableDateInputs={true}
                                    onChange={handleDateRangeChange}
                                    moveRangeOnFirstSelection={false}
                                    ranges={[filters.dateRange]}
                                    maxDate={new Date()}
                                />
                            </div>
                        )}
                    </div>

                    {/* Employee Filter */}
                    <select
                        className="border px-2 py-1 rounded"
                        value={filters.name}
                        onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
                    >
                        <option value="">All Employees</option>
                        {uniqueNames.map((name, i) => (
                            <option key={i} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        className="border px-2 py-1 rounded"
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                        <option value="">All Statuses</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Half Day">Half Day</option>
                    </select>

                    {/* Clear Filters */}
                    <button
                        className="flex items-center gap-2 border px-4 py-2 rounded hover:bg-gray-100"
                        onClick={clearAllFilters}
                    >
                        Clear Filters
                    </button>

                    {/* Export Dropdown */}
                    <div className="relative" ref={exportRef}>
                        <button
                            onClick={() => setShowExportOptions(prev => !prev)}
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
                {(filters.dateRange.startDate || filters.dateRange.endDate) && (
                    <div className="mb-4 text-sm text-gray-600">
                        Showing attendance from: 
                        <span className="font-medium ml-1">
                            {filters.dateRange.startDate ? 
                                format(new Date(filters.dateRange.startDate), "dd MMM yyyy") : 'Beginning'}
                        </span> to 
                        <span className="font-medium ml-1">
                            {filters.dateRange.endDate ? 
                                format(new Date(filters.dateRange.endDate), "dd MMM yyyy") : 'Today'}
                        </span>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center py-4">
                        Loading attendance data...
                    </div>
                )}

                {/* Table */}
                {!isLoading && (
                    <div className="overflow-x-auto rounded-lg border shadow-sm">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                            <tr>
                                {TABLE_COLUMNS.map((column, index) => (
                                    <th key={index} className="px-4 py-3">{column}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700">
                            {currentRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={TABLE_COLUMNS.length} className="text-center py-6 text-gray-400">
                                        No attendance records found.
                                    </td>
                                </tr>
                            ) : (
                                currentRecords.map((attendance, idx) => (
                                    <tr key={`${attendance.name}-${attendance.date}`} className="border-t">
                                        <td className="px-4 py-3">{attendance.name}</td>
                                        <td className="px-4 py-3">{attendance.designation}</td>
                                        <td className="px-4 py-3">{attendance.department}</td>
                                        <td className="px-4 py-3">
                                            {format(new Date(attendance.date), "dd MMM yyyy")}
                                        </td>
                                        <td className="px-4 py-3">{attendance.inTime}</td>
                                        <td className="px-4 py-3">{attendance.inLocation}</td>
                                        <td className="px-4 py-3">{attendance.outTime}</td>
                                        <td className="px-4 py-3">{attendance.outLocation}</td>
                                        <td className="px-4 py-3">{attendance.workHours}</td>
                                        <td className="px-4 py-3">
                                            <StatusChip status={attendance.status} />
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-end p-4 text-sm space-x-2">
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                                    disabled={currentPage === 1}
                                    className={`px-2 ${currentPage === 1 ? 'text-gray-300' : 'text-gray-500'}`}
                                >
                                    &lt;
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                                    <button
                                        key={n}
                                        onClick={() => setCurrentPage(n)}
                                        className={`px-3 py-1 rounded ${currentPage === n ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                                <button 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                                    disabled={currentPage === totalPages}
                                    className={`px-2 ${currentPage === totalPages ? 'text-gray-300' : 'text-gray-500'}`}
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default Attendance;