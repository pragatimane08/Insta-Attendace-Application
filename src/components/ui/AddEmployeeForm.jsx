import React, { useState } from 'react';
import { Input } from "./input"; // adjust path as needed

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

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Employee name is required';
    if (!formData.email.match(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/)) newErrors.email = 'Enter a valid email address';
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = 'Phone number must be 10 digits';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', formData);
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

      {/* Reusable Inputs */}
      {[
        { label: "Employee Name", name: "name", type: "text", placeholder: "Full Name" },
        { label: "Email", name: "email", type: "email", placeholder: "Email Address" },
        { label: "Phone Number", name: "phone", type: "tel", placeholder: "Phone Number" },
        { label: "Designation/Role", name: "designation", type: "text", placeholder: "Job Title" },
        { label: "Password", name: "password", type: "password", placeholder: "Password" },
      ].map(({ label, name, type, placeholder }) => (
        <div key={name}>
          <label className="block text-sm font-medium mb-1">{label}</label>
          <Input
            type={type}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
            className={errors[name] ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name]}</p>}
        </div>
      ))}

      {/* Department */}
      <div>
        <label className="block text-sm font-medium mb-1">Department</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${errors.department ? "border-red-500 focus:ring-red-500" : "focus:ring-purple-500"}`}
        >
          <option value="">Select Department</option>
          <option>HR</option>
          <option>Engineering</option>
          <option>Sales</option>
        </select>
        {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department}</p>}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Add Employee
        </button>
      </div>
    </form>
  );
};

export default AddEmployeeForm;
