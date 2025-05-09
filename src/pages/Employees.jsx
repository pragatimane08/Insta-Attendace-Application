import React, { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import AddEmployeeForm from "../components/ui/AddEmployeeForm";
import UpdateEmployeeForm from "../components/ui/UpdateEmployeeForm";
import BulkUpload from "../components/ui/BulkUpload";
import { Search, UserPlus, Edit, Trash, Filter, FileText } from "lucide-react";

const employeesData = [
  { name: "Mustkeem Baraskar", email: "mustkeem@gmail.com", phone: "1234567890", designation: "Software Developer", department: "Corporate Office" },
  { name: "Rohini Raut", email: "rohini@gmail.com", phone: "1234567890", designation: "Software Developer", department: "JIO" },
  { name: "Pragati Mane", email: "pragati@gmail.com", phone: "1234567890", designation: "Software Developer", department: "Corporate Office" },
  { name: "Shivanjali Bhosagi", email: "shivanjali@gmail.com", phone: "1234567890", designation: "Software Developer", department: "Corporate Office" },
  { name: "Dilip Nandiwale", email: "dilip@gmail.com", phone: "1234567890", designation: "Software Developer", department: "VI Pune" },
  { name: "Devayani Ghuge", email: "devayani@gmail.com", phone: "1234567890", designation: "Software Developer", department: "Maharashtra JIO" },
  { name: "Niharika Sangolkar", email: "niharika@gmail.com", phone: "1234567890", designation: "Software Developer", department: "Punjab Circle" },
  { name: "Sakshi Rajurkar", email: "sakshi@gmail.com", phone: "1234567890", designation: "Software Developer", department: "Airtel Bharti" },
  { name: "Vaibhav Alone", email: "vaibhav@gmail.com", phone: "1234567890", designation: "Software Developer", department: "Ericsson JIO" },
  { name: "Kajal Pawar", email: "kajal@gmail.com", phone: "1234567890", designation: "Software Developer", department: "Mumbai Airtel" },
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState(employeesData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleDelete = (emp) => {
    setSelectedEmp(emp);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setEmployees(employees.filter((e) => e !== selectedEmp));
    setShowConfirm(false);
    setSelectedEmp(null);
  };

  const onAddEmployeeClick = () => {
    setIsAddDialogOpen(true);
  };

  const onEditEmployeeClick = (emp) => {
    setSelectedEmp(emp);
    setIsEditDialogOpen(true);
  };

  const filteredEmployees = employees.filter((emp) =>
    (emp.name ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Employee Management</h1>
          <div className="flex gap-3">
            <button onClick={onAddEmployeeClick} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700">
              <UserPlus className="h-4 w-4" /> <span>Add New Employee</span>
            </button>
            <button onClick={() => setShowBulkUpload(true)} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
              <FileText className="h-4 w-4" /> <span>Bulk Upload</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 p-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
              <FileText className="h-4 w-4 mr-2" /> Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-white text-left">
              <tr>
                <th className="p-3 text-gray-500">Name</th>
                <th className="p-3 text-gray-500">Email</th>
                <th className="p-3 text-gray-500">Phone</th>
                <th className="p-3 text-gray-500">Designation</th>
                <th className="p-3 text-gray-500">Department</th>
                <th className="p-3 text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-400">No employees found.</td>
                </tr>
              ) : (
                filteredEmployees.map((emp, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{emp.name}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3">{emp.phone}</td>
                    <td className="p-3">{emp.designation}</td>
                    <td className="p-3">{emp.department}</td>
                    <td className="p-3 flex gap-6">
                      <button className="text-blue-600 hover:text-blue-800" onClick={() => onEditEmployeeClick(emp)}>
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(emp)}>
                        <Trash className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-end p-4 text-sm space-x-2">
            <button className="px-2 text-gray-500">&lt;</button>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} className="px-3 py-1 rounded hover:bg-gray-100">{n}</button>
            ))}
            <button className="px-2 text-gray-500">&gt;</button>
          </div>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
              <h2 className="text-lg font-semibold mb-4">Delete Employee</h2>
              <p className="text-sm text-gray-700 mb-6">Are you sure you want to delete <strong>{selectedEmp?.name}</strong>?</p>
              <div className="flex justify-center space-x-4">
                <button onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Yes, Delete</button>
                <button onClick={() => setShowConfirm(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {isAddDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
              <AddEmployeeForm onClose={() => setIsAddDialogOpen(false)} onAdd={(newEmp) => {
                setEmployees([...employees, newEmp]);
                setIsAddDialogOpen(false);
              }} />
            </div>
          </div>
        )}

        {isEditDialogOpen && selectedEmp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
              <UpdateEmployeeForm employee={selectedEmp} onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedEmp(null);
              }} onUpdate={(updatedEmp) => {
                setEmployees((prev) => prev.map((emp) => emp.email === updatedEmp.email ? updatedEmp : emp));
                setIsEditDialogOpen(false);
                setSelectedEmp(null);
              }} />
            </div>
          </div>
        )}

        {showBulkUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
              <BulkUpload onUpload={(bulkEmployees) => {
                if (bulkEmployees && bulkEmployees.length > 0) {
                  setEmployees([...employees, ...bulkEmployees]);
                }
                setShowBulkUpload(false);
              }} onClose={() => setShowBulkUpload(false)} />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Employees;