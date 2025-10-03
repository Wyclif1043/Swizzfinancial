import employeeApi from "./employeesApiConfig/employeeApi";

export const getBankBranches = async (bankCode) => {
  try {
    //const response = await employeeApi.get(`/employee-banks/${bankCode}`);
    const response = await employeeApi.get(`/employee-branches/`);
    console.log(response)
    const data = response.data?.data;
    console.log("Fetched bank branches data:", data);

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