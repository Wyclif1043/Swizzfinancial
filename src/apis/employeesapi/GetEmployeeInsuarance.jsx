import employeeApi from "./employeesApiConfig/employeeApi";

export const getEmployeeInsurance = async () => {
    try {
        const response = await employeeApi.get("/employee-insurance-companies");
        return response.data;
    } catch (error) {
        console.error("Error fetching employee insurance:", error);
        throw error;
    }
};
