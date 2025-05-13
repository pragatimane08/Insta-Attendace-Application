import React, { useState } from 'react';
import { Input } from './input';
import {employeeService} from "../../api/services/employee.service.js";
import { toast } from './sonner.jsx';

// Reusable FormField Component
const FormField = ({ label, name, type, placeholder, value, onChange, error }) => (
    <div>
      <label className="block text-sm font-medium mb-1" htmlFor={name}>{label}</label>
      <Input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              error ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
          }`}
          aria-invalid={!!error}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

const AddEmployeeForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };


  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Employee name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const employee = {
        username: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        circle: formData.department,
        role: formData.designation,
        password: formData.password
      }
      employeeService.addOne(employee).then(res => {
        console.log(res);
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: '',
          designation: '',
          password: '',
        });
      });
      onClose();
    }
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-5 text-base w-full max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Add New Employee</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ×
          </button>
        </div>

        {/* Input Fields */}
        {[
          { label: 'Employee Name', name: 'name', type: 'text', placeholder: 'Full Name' },
          { label: 'Email', name: 'email', type: 'email', placeholder: 'Email Address' },
          { label: 'Phone Number', name: 'phone', type: 'tel', placeholder: 'Phone Number' },
          { label: 'Designation/Role', name: 'designation', type: 'text', placeholder: 'Job Title' },
          { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
        ].map((field) => (
            <FormField
                key={field.name}
                {...field}
                value={formData[field.name]}
                onChange={handleChange}
                error={errors[field.name]}
            />
        ))}

        {/* Department Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Department</label>
          <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.department ? 'border-red-500 focus:ring-red-500' : 'focus:ring-purple-500'
              }`}
          >
            <option value="">Select Department</option>
            <option>HR</option>
            <option>Engineering</option>
            <option>Sales</option>
          </select>
          {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit" className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
            Add Employee
          </button>
        </div>
      </form>
  );
};

export default AddEmployeeForm;