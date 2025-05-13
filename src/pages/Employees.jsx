import React, {useEffect, useState} from "react";
import MainLayout from "../components/layout/MainLayout";
import AddEmployeeForm from "../components/ui/AddEmployeeForm";
import UpdateEmployeeForm from "../components/ui/UpdateEmployeeForm";
import BulkUpload from "../components/ui/BulkUpload.jsx";
import { Search, UserPlus, Filter, FileText } from "lucide-react";
import {employeeService} from "../api/services/employee.service.js";
import {toast} from "../components/ui/sonner.jsx";
import EmployeeTable from "../components/ui/EmployeeTable.jsx";
import TableSkeleton from "../components/ui/TableSkeleton.jsx";


const Employees = () => {

  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const recordsPerPage = 10;



  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (e) {
      toast.error("Error fetching employees");
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

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
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Employee Management</h1>
            <div className="flex gap-3">
              <button
                  onClick={onAddEmployeeClick}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700"
              >
                <UserPlus className="h-4 w-4" />
                <span>Add New Employee</span>
              </button>
              <button
                  onClick={() => setShowBulkUpload(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700"
              >
                <FileText className="h-4 w-4" />
                <span>Bulk Upload</span>
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // reset page on search
                  }}
                  className="w-80 pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100">
                <FileText className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Employee Table */}
          {isLoading ? (
              <TableSkeleton />
          ) : (
              <EmployeeTable
                  employees={filteredEmployees}
                  onEdit={onEditEmployeeClick}
                  onDelete={handleDelete}
                  currentPage={currentPage}
                  recordsPerPage={recordsPerPage}
                  setCurrentPage={setCurrentPage}
              />)}

          {/* Delete Confirmation Modal */}
          {showConfirm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
                  <h2 className="text-lg font-semibold mb-4">Delete Employee</h2>
                  <p className="text-sm text-gray-700 mb-6">
                    Are you sure you want to delete <strong>{selectedEmp?.name}</strong>?
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                        onClick={confirmDelete}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Yes, Delete
                    </button>
                    <button
                        onClick={() => setShowConfirm(false)}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* Add Employee Modal */}
          {isAddDialogOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
                  <AddEmployeeForm
                      onClose={() => setIsAddDialogOpen(false)}
                      onAdd={(newEmp) => {
                        setEmployees([...employees, newEmp]);
                        setIsAddDialogOpen(false);
                      }}
                  />
                </div>
              </div>
          )}

          {/* Edit Employee Modal */}
          {isEditDialogOpen && selectedEmp && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
                  <UpdateEmployeeForm
                      selectedEmployee={selectedEmp}
                      onClose={() => {
                        setIsEditDialogOpen(false);
                        setSelectedEmp(null);
                      }}
                      onUpdate={(updatedEmp) => {
                        setEmployees((prev) =>
                            prev.map((emp) =>
                                emp.email === updatedEmp.email ? updatedEmp : emp
                            )
                        );
                        setIsEditDialogOpen(false);
                        setSelectedEmp(null);
                      }}
                  />
                </div>
              </div>
          )}

          {/* Bulk Upload Modal */}
          {showBulkUpload && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-6 relative">
                  <BulkUpload
                      onUpload={(bulkEmployees) => {
                        if (bulkEmployees && bulkEmployees.length > 0) {
                          setEmployees([...employees, ...bulkEmployees]);
                        }
                        setShowBulkUpload(false);
                      }}
                  />
                  <button
                      onClick={() => setShowBulkUpload(false)}
                      className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>
              </div>
          )}
        </div>
      </MainLayout>
  );
};

export default Employees;
