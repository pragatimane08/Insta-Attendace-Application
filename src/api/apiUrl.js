
export const apiUrl = {
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8081/api',

  // Auth endpoints
  auth: {
    login: `/auth/login`,
    register: `/auth/register`,
    forgotPassword: `/auth/forgot-password`,
    resetPassword: `/auth/reset-password`,
  },

  // Employee endpoints
  employees: {
    getAll: `/employees`,
    getById: (id) => `/employees/${id}`,
    create: `/employees`,
    update: (id) => `/employees/${id}`,
    delete: (id) => `/employees/${id}`,
  },

  // Attendance endpoints
  attendance: {
    getAll: `/attendance`,
    getByEmployeeId: (id) => `/attendance/employee/${id}`,
    checkIn: `/attendance/check-in`,
    checkOut: `/attendance/check-out`,
    getReports: `/attendance/reports`,
  },

  // Leave management endpoints
  leave: {
    getAll: `/leave`,
    getById: (id) => `/leave/${id}`,
    create: `/leave`,
    update: (id) => `/leave/${id}`,
    approve: (id) => `/leave/${id}/approve`,
    reject: (id) => `/leave/${id}/reject`,
    getByEmployeeId: (id) => `/leave/employee/${id}`,
  },

  // Payroll endpoints
  payroll: {
    getAll: `/payroll`,
    generate: `/payroll/generate`,
    getById: (id) => `/payroll/${id}`,
    getByEmployeeId: (id) => `/payroll/employee/${id}`,
    downloadPayslip: (id) => `/payroll/${id}/download`,
  },
};
