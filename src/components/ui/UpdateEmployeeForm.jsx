import React, { useState, useCallback } from "react";
import { Input } from "./input";

const UpdateEmployeeForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    status: "",
    geofencing: "",
    designation: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const { name, email, phone, department, status, geofencing, designation, password } = formData;
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!department.trim()) newErrors.department = "Department is required";
    if (!status) newErrors.status = "Enrollment status is required";
    if (!geofencing) newErrors.geofencing = "Geofencing is required";
    if (!designation.trim()) newErrors.designation = "Designation is required";

    if (!password) {
      newErrors.password = "Password is required";
    } else if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)
    ) {
      newErrors.password =
        "Password must be at least 8 characters and include 1 letter, 1 number, and 1 special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (validate()) {
        console.log("Form submitted:", formData);
        onClose();
      }
    },
    [formData, onClose]
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-semibold">Update Employee</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto">
          <form className="space-y-5 text-base" onSubmit={handleSubmit}>
            <FormInput
              label="Employee Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Full Name"
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Email Address"
            />

            <FormInput
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="Phone Number"
            />

            <FormInput
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              error={errors.department}
              placeholder="Department"
            />

            <FormSelect
              label="Enrollment Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              error={errors.status}
              options={["Active", "Inactive"]}
              placeholder="Select status"
            />

            <FormSelect
              label="Geofencing"
              name="geofencing"
              value={formData.geofencing}
              onChange={handleChange}
              error={errors.geofencing}
              options={["On", "Off"]}
              placeholder="Select geofencing"
            />

            <FormInput
              label="Designation/Role"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              error={errors.designation}
              placeholder="Job Title"
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Password"
            />

            <div className="flex justify-end gap-3 pt-4">
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
                Update Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Field
const FormInput = ({ label, name, type = "text", value, onChange, error, placeholder }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <Input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        error ? "border-red-500 focus:ring-red-500" : "focus:ring-purple-500"
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

// Reusable Select Field
const FormSelect = ({
  label,
  name,
  value,
  onChange,
  error,
  options,
  placeholder,
  type = "text",
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${
        error ? "border-red-500 focus:ring-red-500" : "focus:ring-purple-500"
      }`}
    >
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default UpdateEmployeeForm;
