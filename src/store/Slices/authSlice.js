import axiosInstance from "../../utils/axiosInstance"
import { createSlice,createAsyncThunk } from "@reduxjs/toolkit"
import toast from "react-hot-toast"

const initialState={
    loading:false,
    status:false,
    userData:null,
}

export const createAccount = createAsyncThunk('register', async(data)=>{
    try {
        
        const response= await axiosInstance.post('/users/register', data);
        //console.log(response,'RES')
        toast.success("User Registered Successfully")
        return response.data
    } catch (error) {
        console.log(error, 'error')
        toast.error(error?.response?.data?.error, 'error')
        throw error
    }
})

export const userLogin = createAsyncThunk('login', async(data)=>{
    try {
        const response= await axiosInstance.post('/users/login', data)
        //console.log(response,'login')
        return response.data.data.user
    } catch (error) {
        console.log(error,'login-error')
        toast.error(error?.response?.data?.error)
        throw error
    }
})

export const userLogout = createAsyncThunk('logout', async()=>{
    try {

        const response= await axiosInstance.post('/users/logout')
        //console.log(response)
        return response.data
    } catch (error) {
        console.log(error)
        toast.error(error?.response?.data?.error)
        throw error
    }
})

export const getCurrentUser = createAsyncThunk('getCurrentUser', async()=>{
    try {

        const response = await axiosInstance.get('/users/current-user')
        //console.log(response,'gcu')
        return response.data.data
    } catch (error) {
        console.log(error,'gcu-error')
        //toast.error(error?.response?.data?.error)
        throw error
    }
})




const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{},
    extraReducers: (builder)=>{
        builder
        .addCase(createAccount.pending, (state)=>{
            state.loading= true;
        })
        .addCase(createAccount.fulfilled, (state)=>{
            state.loading= false;
        })
        .addCase(userLogin.pending, (state)=>{
            state.loading= true;
        })
        .addCase(userLogin.fulfilled, (state, action)=>{
            state.loading= false;
            state.status=true;
            state.userData= action.payload
        })
        .addCase(userLogout.pending, (state)=>{
            state.loading= true;
        })
        .addCase(userLogout.fulfilled, (state)=>{
            state.loading= false;
            state.status= false;
            state.userData=null;
        })
        .addCase(getCurrentUser.pending, (state)=>{
            state.loading= true;
        })
        .addCase(getCurrentUser.fulfilled, (state,action)=>{
            state.loading= false;
            state.status=true;
            state.userData=action.payload;
        })
        .addCase(getCurrentUser.rejected, (state)=>{
            state.loading = false;
            state.status =  false;
            state.userData = null;
        })
    }
    
})

export default authSlice.reducer