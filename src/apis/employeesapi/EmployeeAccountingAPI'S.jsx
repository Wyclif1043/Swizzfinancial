import employeeApi from "./employeesApiConfig/employeeApi";

export const getAccounts = async () => {
    try {
        const response = await employeeApi.get("/account-details");
        return response.data?.data || [];
    } catch (error) {
        console.error("Error fetching accounts:", error);
        throw error;
    }
};

export const createAccount = async (formdata) => {
    try {
        return await employeeApi.post("/account-details", formdata);
    } catch (error) {
        console.error("Error creating account:", error.response?.data || error.message);
        throw error;
    }
}

export const updateAccount = async (accountId, formdata) => {
    try {
        return await employeeApi.put(`/account-details/${accountId}`, formdata);
    } catch (error) {
        console.error("Error updating account:", error.response?.data || error.message);
        throw error;
    }
}

export const deleteAccount = async (accountId) => {
    try {
        return await employeeApi.delete(`/account-details/${accountId}`);
    } catch (error) {
        console.error("Error deleting account:", error.response?.data || error.message);
        throw error;
    }
}
