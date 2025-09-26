import employeeApi from "./employeesApiConfig/employeeApi";

export const getEarnings = async () => {
    try {
        return await employeeApi.get("/employee-earnings");
    } catch (error) {
        console.error("Error fetching earnings:", error.response?.data || error.message);
        throw error;        
    }
}

export const createEarning = async (formdata) => {
    try {
        return await employeeApi.post("/employee-earnings", formdata);
    } catch (error) {
        console.error("Error creating earning:", error.response?.data || error.message);
        throw error;
    }
}
export const updateEarning = async (earningId, formdata) => {
    try {
        return await employeeApi.put(`/employee-earnings/${earningId}`, formdata);
    } catch (error) {
        console.error("Error updating earning:", error.response?.data || error.message);
        throw error;
    }
}

export const deleteEarning = async (id) => {
    try {
        return await employeeApi.delete(`/employee-earnings/${id}`);
    } catch (error) {
        console.error("Error deleting earning:", error.response?.data || error.message);
        throw error;
    }
}