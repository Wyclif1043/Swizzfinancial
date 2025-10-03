import employeeApi from "./employeesApiConfig/employeeApi";

export const getSalaryCycles = async () => {
    try {
        return await employeeApi.get("/salary-cycles");
    } catch (error) {
        console.error("Error fetching salary cycles:", error.response?.data || error.message);
        throw error;        
    }           
}

export const deleteSalaryCycle = async (id) => {
    try {
        return await employeeApi.delete(`/salary-cycles/${id}`);
    } catch (error) {
        console.error("Error deleting salary cycle:", error.response?.data || error.message);
        throw error;
    }
}

export const AddSalaryCycleApi = async (data) => {
    try {
        return await employeeApi.post("/salary-cycles", data);
    } catch (error) {
        console.error("Error adding salary cycle:", error.response?.data || error.message);
        throw error;
    }
}

export const updateSalaryCycle = async (id, data) => {
    try {
        return await employeeApi.put(`/salary-cycles/${id}`, data);
    } catch (error) {
        console.error("Error updating salary cycle:", error.response?.data || error.message);
        throw error;
    }
}

export const processSalaryCycle = async (data) => {
    try {
        return await employeeApi.post(`/payroll-closures`, data);    
    } catch (error) {
        console.error("Error processing salary cycle:", error.response?.data || error.message);
        throw error;
    }
}
