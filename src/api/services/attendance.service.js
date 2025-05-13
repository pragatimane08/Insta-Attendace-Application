import { toast }from "../../components/ui/sonner.jsx";
import { attendanceRepository } from "../repositories/attendance.repository.js";

export const attendanceService = {
    getAll: async () => {
        try {
            const response = await attendanceRepository.getAll();
            return response.data.data;
        } catch (error) {
            toast.error('Error, Failed to fetch attendance.');
            throw error;
        }
      },
};