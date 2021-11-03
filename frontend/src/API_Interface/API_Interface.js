import axios from 'axios';

const AxiosConfigured = () => {
    // Indicate to the API that all requests for this app are AJAX
    axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    // Set the baseURL for all requests to the API domain instead of the current domain
    // axios.defaults.baseURL = `http://localhost:8443/api/v1`;
    axios.defaults.baseURL = `http://localhost:8443/api/v1`;


    // Allow the browser to send cookies to the API domain (which include auth_token)
    axios.defaults.withCredentials = true;


//    axios.defaults.headers.common['X-CSRF-TOKEN'] = csrf_token;

    return axios;
};


const axiosAgent = AxiosConfigured();

export default class APIInterface {

    async getUserInfo(user_id) {
        return axiosAgent.get(`login/${user_id}`)
            .then(userInfo => userInfo.data)
            .catch(error => (
                {
                    error,
                    user: undefined
                 }));
    }

    /*
    async allRoutes() {
        return axiosAgent.get(`routes/all-routes`);
    }

    async routesWithID(routeID) {
        return axiosAgent.get(`routes/${routeID}`);
    }

    async allMarket() {
        return axiosAgent.get(`markets/all-markets`);
    }

    async marketsWithID(marketID) {
        return axiosAgent.get(`markets/${marketID}`);
    }
    async allEmployees() {
        return axiosAgent.get(`employees/all-employees`);
    }

    async employeesWithID(employeeID) {
        return axiosAgent.get(`employees/${employeeID}`);
    }

    async allTransactions(cycleID) {
        return axiosAgent.get(`transactions/${cycleID}`);
    }
    async TransactionsOneAccount(cycleID, accountID) {
        return axiosAgent.get(`transactions/${cycleID}/${accountID}/one-account`);
    }
    async TransactionsOneRouteID(cycleID, routeID) {
        return axiosAgent.get(`transactions/${cycleID}/${routeID}/trans-for-route`);
    }
    async TransactionsByMarketID(cycleID, marketID) {
        return axiosAgent.get(`transactions/${cycleID}/${marketID}/trans-for-market`);
    }
    async TransactionsAllRouteAllCycle(cycleID) {
        return axiosAgent.get(`transactions/${cycleID}/all-routes`);
    }
    async TransactionsCurrentCycle() {
        return axiosAgent.get(`transactions/cycleID/maxCycleID`);
    }
    async TransactionsAccName(accountID) {
        return axiosAgent.get(`transactions/${accountID}/accName`);
    }
     */
}