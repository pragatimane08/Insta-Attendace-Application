import {employeeRepository} from "../repositories/employee.repository.js";
import {toast} from "../../components/ui/sonner.jsx";


export const employeeService = {
  /**
   * Fetches List of all Employees.
   * @returns {Promise} - Resolves with a list of users.
   */
  getAll: async () => {
    try {
      const response = await employeeRepository.getAll();
      return response.data.data;
    } catch (error) {
      toast.error('Error, Failed to fetch employees.');
      throw error;
    }
  },
  /**
   * Add an Employee to database
   * @Params {userdata} - email, username, password, phone_number, role, password, circle.
   * @returns {Promise} - Resolves with a list of users.
   */
  addOne: async (userData) => {
    try {
      const response = await employeeRepository.addOne(userData);
      toast.success('Employee Added Successfully.');
      return response.data.data;
    } catch (error) {
      toast.error('Error, Failed to Add Employee.');
      throw error;
    }
  },
  /**
   * Update an Employee to database
   * @Params {userdata} - email, username, password, phone_number, role, password, circle.
   * @returns {Promise} - Resolves with a list of users.
   */
  updateOne: async (userData) => {
    try {
      const response = await employeeRepository.updateOne(userData);
      toast.success('Employee Updated Successfully.');
      return response.data.data;
    } catch (error) {
      toast.error('Error, Failed to Update Employee.');
      throw error;
    }
  },
};
