import { toast }from "../components/ui/sonner.jsx";
import { attendanceRepository } from "./repositories/attendance.repository.js";

export const attendanceService = {
    getAll: async () => {
        try {
          const response = await fetch("/api/attendance");
          if (!response.ok) throw new Error("Failed to fetch attendance.");
          const data = await response.json();
          return data;
        } catch (error) {
          toast({
            title: "Error",
            description: error.message || "Something went wrong.",
            variant: "destructive",
          });
          throw error; // So the calling component can still handle it if needed
        }
      },
      
    // Add more service methods as needed
};