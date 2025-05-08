import { useEffect } from "react";
import { employeeService } from "../services/employeeService"; // adjust path if needed

useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setEmployees(data); // replaces employeesData
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };
  fetchEmployees();
}, []);
