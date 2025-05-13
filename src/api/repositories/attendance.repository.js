import { apiClient } from '../apiClient.js';
import { apiUrl } from '../apiUrl.js';

export const attendanceRepository = {
    getAll: async () =>{
        return apiClient.get(apiUrl.attendance.getAll);
    }
}