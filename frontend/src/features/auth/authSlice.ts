import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from "../../app/store";
import axios from "axios";
import {
    AUTH_STATE,
    CRED,
    LOGIN_USER,
    POST_PROFILE,
    PROFILE,
    JWT,
    USER,
} from "../types";


axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.timeout = 3000



export const fetchAsyncLogin = createAsyncThunk(
    "auth/login",
    async (auth: CRED) => {
        const res = await axios.post<JWT>(
            `/authen/jwt/create`,
            auth,
            {
                headers: {
                    "Content-Type": "application/json",
                }
            },
        )
        console.log("fetchAsyncLogin done")
        return res.data
    }
)

export const fetchAsyncRegister = createAsyncThunk(
    "auth/register",
    async (auth: CRED) => {
        const res = await axios.post<USER>(
            `/api/create/`,
            auth,
            {
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        console.log("fetchAsyncRegister done!")
        return res.data
    }
)

export const fetchAsyncGetMyProf = createAsyncThunk(
    "auth/loginuser",
    async () => {
        const res = await axios.get<LOGIN_USER>(
            `/api/loginuser/`,
            {
                headers: {
                    Authorization: `JWT ${localStorage.localJWT}`,
                }
            }
        )
        return res.data
    }
)

export const fetchAsyncCreateProf = createAsyncThunk(
    "auth/createProfile",
    async () => {
        const res = await axios.post<PROFILE>(
            `/api/profile/`,
            { img: null },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `JWT ${localStorage.localJWT}`,
                }
            }
        )
        console.log("fetchAsyncCreateProf done")
        return res.data
    }
)

export const fetchAsyncGetProfs = createAsyncThunk(
    "auth/getProfiles",
    async () => {
        const res = await axios.get<PROFILE[]>(
            `/api/profile`,
            {
                headers: {
                    Authorization: `JWT ${localStorage.localJWT}`,
                }
            }
        )
        return res.data
    }
)

export const fetchAsyncUpdateProf = createAsyncThunk(
    "auth/updatePfofile",
    async (profile: POST_PROFILE) => {
        const uploadData = new FormData()
        profile.img && uploadData.append("img", profile.img, profile.img.name)
        const res = await axios.put<PROFILE>(
            `/api/profile/${profile.id}/`,
            uploadData,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `JWT ${localStorage.localJWT}`,
                }
            }
        )
        return res.data
    }
)

const initialState: AUTH_STATE = {
    isLoginView: true,
    loginUser: {
        id: 0,
        username: "",
    },
    profiles: [
        {
            id: 0,
            user_profile: 0,
            img: null,
        },
    ],
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        toggleMode(state) {
            state.isLoginView = !state.isLoginView
        }
    },
    extraReducers: (builder) => {
        //Login
        builder.addCase(fetchAsyncLogin.pending, (state) => {
        })
        builder.addCase(fetchAsyncLogin.fulfilled, (state, action: PayloadAction<JWT>) => {
            localStorage.setItem("localJWT", action.payload.access)
            window.location.href = "/tasks"
        })
        builder.addCase(fetchAsyncLogin.rejected, (state) => {
            window.location.href = "/"
        })

        //getMyProf
        builder.addCase(fetchAsyncGetMyProf.pending, (state) => {
        })
        builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action: PayloadAction<LOGIN_USER>) => {
            return {
                ...state,
                loginUser: action.payload
            }
        })
        builder.addCase(fetchAsyncGetMyProf.rejected, (state) => {
            window.location.href = "/"
        })

        //getProfs
        builder.addCase(fetchAsyncGetProfs.pending, (state) => {
        })
        builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action: PayloadAction<PROFILE[]>) => {
            return {
                ...state,
                profiles: action.payload
            }
        })
        builder.addCase(fetchAsyncGetProfs.rejected, (state) => {
            window.location.href = "/"
        })

        //updateProf
        builder.addCase(fetchAsyncUpdateProf.pending, (state) => {
        })
        builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action: PayloadAction<PROFILE>) => {
            return {
                ...state,
                profiles: state.profiles.map((prof: PROFILE) =>
                    prof.id === action.payload.id ? action.payload : prof
                )
            }
        })
        builder.addCase(fetchAsyncUpdateProf.rejected, (state) => {
            window.location.href = "/"
        })
    }
},
);

export const { toggleMode } = authSlice.actions;


export const selectIsLoginView = (state: RootState) => state.auth.isLoginView;
export const selectLoginUser = (state: RootState) => state.auth.loginUser;
export const selectProfiles = (state: RootState) => state.auth.profiles;


export default authSlice.reducer;
