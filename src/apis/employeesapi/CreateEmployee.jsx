import employeeApi from "./employeesApiConfig/employeeApi";

export const createEmployee = async (employeeData) => {
    try {
        return await employeeApi.post("/employee-profiles", employeeData);
    } catch (error) {
        console.error("Error creating employee:", error.response?.data || error.message);
        throw error;
    }
}
