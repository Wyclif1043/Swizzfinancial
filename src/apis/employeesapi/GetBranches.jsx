import employeeApi from "./employeesApiConfig/employeeApi";

export const getBranches = async () => {
    try {
        const response = await employeeApi.get("/employee-branches");
        return response.data|| [];
    } catch (error) {
        console.error("Error fetching branches:", error);
        throw error;
    }
};
