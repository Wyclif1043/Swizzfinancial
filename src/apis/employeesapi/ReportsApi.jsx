import employeeApi from "./employeesApiConfig/employeeApi";

export const getEmployeePayslips = async () => {
    try {
        return await employeeApi.get("/employee-payslips");
    } catch (error) {
        console.error("Error fetching employee payslips:", error);
        throw error;
    }
}

export const getAnnualTaxReport = async () => {
    try {
        return await employeeApi.get("/annual-tax-reports");
    } catch (error) {
        console.error("Error fetching annual tax report:", error);
        throw error;
    }
}

export const filterPayslips = async (employeeId, year, salaryCycleName) => {
  try {
    const createdFrom = `${year}-01-01`;
    const createdTo = `${year}-12-31`;

    return await employeeApi.get("/employee-payslips", {
      params: {
        employeeId,
        createdFrom,
        createdTo,
        salaryCycleName,
      },
    });
  } catch (error) {
    console.error("Error filtering employee payslips:", error);
    throw error;
  }
};
