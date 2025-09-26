import employeeApi from "./employeesApiConfig/employeeApi";

export const getBankCodes = async () => {
    try {
        const response = await employeeApi.get("/employee-banks");
        return response.data || [];
    } catch (error) {
        console.error("Error fetching bank codes:", error);
        throw error;
    }
};
