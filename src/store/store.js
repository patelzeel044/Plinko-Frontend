import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice"
import plinkoReducer from './Slices/plinkoSlice';
import walletReducer from './Slices/walletSlice';
import transactionsReducer from './Slices/transactionsSlice';
import plinkoGReducer from './Slices/plinkoGSlice';
import adminUsersReducer from './Slices/AdminSlice/adminUsersSlice';
import txReducer from "./Slices/AdminSlice/adminTransactionsSlice";
import roundsReducer from "./Slices/AdminSlice/adminPlinkoRoundsSlice";
import adminDashboardReducer from "./Slices/AdminSlice/adminDashboardSlice";

const store = configureStore({
    reducer:{
        auth: authReducer,
        plinko: plinkoReducer,
        wallet: walletReducer,
        transactions: transactionsReducer,
        plinkoG: plinkoGReducer,

        adminDashboard:adminDashboardReducer,
        adminUsers: adminUsersReducer,
        adminTx: txReducer,
        adminRounds: roundsReducer,
    }
})

export default store;