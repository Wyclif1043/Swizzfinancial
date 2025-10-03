import employeeApi from "./employeesApiConfig/employeeApi";

export const getEmployeeInsuranceCompanies =async () =>{
    try {
        const response = await employeeApi.get("/employee-insurance-companies");
        return response.data;   
    } catch (error) {
        console.error("Error fetching insurance companies:", error);
        throw error;
    }
}

export const addEmployeeInsuranceCompanyApi = async (data) => {
    try {
        return await employeeApi.post("/employee-insurance-companies", data);
    } catch (error) {
        console.error("Error adding insurance company:", error);
        throw error;
    }
}

export const updateEmployeeInsuranceCompanyApi = async (id, data) => {
    try {
        return await employeeApi.put(`/employee-insurance-companies/${id}`, data);
    } catch (error) {
        console.error("Error updating insurance company:", error);
        throw error;
    }
}

export const deleteEmployeeInsuranceCompanyApi = async (id) => {
    try {
        return await employeeApi.delete(`/employee-insurance-companies/${id}`);
    } catch (error) {
        console.error("Error deleting insurance company:", error);
        throw error;
    }
}