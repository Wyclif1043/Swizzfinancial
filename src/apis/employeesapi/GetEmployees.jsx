import employeeApi from "./employeesApiConfig/employeeApi";

const getEmployees = async () => {
  try {
    const response = await employeeApi.get("/employee-profiles");
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    throw error;
  }
};

export default getEmployees;
