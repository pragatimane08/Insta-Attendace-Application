import { apiClient } from '../apiClient.js';        
import { apiUrl } from '../apiUrl.js';

export const  employeeRepository = {
    getAll: async () => {
        try {
          const response = await employeeRepository.getAll();
          return response.data;
        } catch (error) {
          toast({
            title: "Error",
            description: error.message || "Something went wrong.",
            variant: "destructive",
          });
          throw error;
        }
      },
      
}