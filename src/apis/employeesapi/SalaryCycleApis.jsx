import employeeApi from "./employeesApiConfig/employeeApi";

export const getSalaryCycles = async () => {
    try {
        return await employeeApi.get("/salary-cycles");
        
    } catch (error) {
        console.error("Error fetching salary cycles:", error.response?.data || error.message);
        throw error;        
    }           
}