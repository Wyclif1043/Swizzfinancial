import employeeApi from "./employeesApiConfig/employeeApi";

export const getBankBranches = async (bankCode) => {
  try {
    const response = await employeeApi.get(`/employee-banks/${bankCode}`);
    const data = response.data?.data;

    if (Array.isArray(data)) {
      return data;
    } else if (data) {
      return [data]; // wrap single object
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching bank branches:", error);
    return [];
  }
};