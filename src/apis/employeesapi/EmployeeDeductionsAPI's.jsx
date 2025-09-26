import employeeApi from "./employeesApiConfig/employeeApi";

export const getDeductions = async () => {
    try {
        return await employeeApi.get("/employee-deductions");
    } catch (error) {
        console.error("Error fetching employee deductions:", error);
        throw error;
    }
}

export const createDeduction = async (formdata) => {
    try {
        return await employeeApi.post("/employee-deductions", formdata);
    } catch (error) {
        console.error("Error creating employee deduction:", error);
        throw error;
    }
}

export const updateDeduction = async (deductionId, formdata) => {
    try {
        return await employeeApi.put(`/employee-deductions/${deductionId}`, formdata);
    } catch (error) {
        console.error("Error updating employee deduction:", error);
        throw error;
    }
}
export const deleteDeductions = async (deductionId) => {
    try {
        return await employeeApi.delete(`/employee-deductions/${deductionId}`);
    } catch (error) {
        console.error("Error deleting employee deduction:", error);
        throw error;
    }
}