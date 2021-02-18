import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from "../../app/store";
import axios from "axios";
import {
    READ_TASK,
    POST_TASK,
    TASK_STATE,
    USER,
    CATEGORY
} from "../types";


axios.defaults.baseURL = process.env.REACT_APP_API_URL
axios.defaults.timeout = 3000

const localJWT = localStorage.localJWT

export const fetchAsyncGetTasks = createAsyncThunk(
    "task/getTasks",
    async () => {
        const res = await axios.get<READ_TASK[]>("/api/tasks/", {
            headers: {
                Authorization: `JWT ${localJWT}`,
            }
        })
        return res.data
    }
)

export const fetchAsyncGetUsers = createAsyncThunk(
    "task/getUsers",
    async () => {
        const res = await axios.get<USER[]>("/api/users/", {
            headers: {
                Authorization: `JWT ${localJWT}`,
            }
        })
        return res.data
    }
)

export const fetchAsyncGetCategory = createAsyncThunk(
    "task/getCategory",
    async () => {
        const res = await axios.get<CATEGORY[]>("/api/category/", {
            headers: {
                Authorization: `JWT ${localJWT}`,
            }
        })
        return res.data
    }
)

export const fetchAsyncCreateCategory = createAsyncThunk(
    "task/createCaterogy",
    async (item: string) => {
        const res = await axios.post<CATEGORY>(
            `/api/category/`,
            { item: item },
            {
                headers: {
                    Authorization: `JWT ${localJWT}`,
                }
            }
        )
        return res.data
    }
)

export const fetchAsyncCreateTask = createAsyncThunk(
    "task/createTask",
    async (task: POST_TASK) => {
        const res = await axios.post<READ_TASK>(
            `/api/tasks/`,
            task,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `JWT ${localJWT}`,
                }
            }
        )
        return res.data
    }
)

export const fetchAsyncUpdateTask = createAsyncThunk(
    "task/updateTask",
    async (task: POST_TASK) => {
        const res = await axios.put<READ_TASK>(
            `/api/tasks/${task.id}/`,
            task,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `JWT ${localJWT}`,
                }
            }
        )
        return res.data
    }
)

export const fetchAsyncDeleteTask = createAsyncThunk(
    "task/deleteTask",
    async (id: number) => {
        await axios.delete(
            `/api/tasks/${id}/`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `JWT ${localJWT}`,
                }
            }
        )
        return id
    }
)

export const initialState: TASK_STATE = {
    tasks: [
        {
            id: 0,
            task: "",
            description: "",
            criteria: "",
            status: "",
            status_name: "",
            category: 0,
            category_item: "",
            estimate: 0,
            responsible: 0,
            responsible_username: "",
            owner: 0,
            owner_username: "",
            created_at: "",
            updated_at: "",
        }
    ],
    editedTask: {
        id: 0,
        task: "",
        description: "",
        criteria: "",
        status: "",
        category: 0,
        estimate: 0,
        responsible: 0,
    },
    selectedTask: {
        id: 0,
        task: "",
        description: "",
        criteria: "",
        status: "",
        status_name: "",
        category: 0,
        category_item: "",
        estimate: 0,
        responsible: 0,
        responsible_username: "",
        owner: 0,
        owner_username: "",
        created_at: "",
        updated_at: "",
    },
    users: [
        {
            id: 0,
            username: "",
        }
    ],
    categorys: [
        {
            id: 0,
            item: "",
        }
    ],
    errorMessage: null,
};

export const taskSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {
        editTask(state, action: PayloadAction<POST_TASK>) {
            state.editedTask = action.payload
        },
        selectTask(state, action: PayloadAction<READ_TASK>) {
            state.selectedTask = action.payload
        },
    },
    extraReducers: (builder) => {
        //GetTasks
        builder.addCase(fetchAsyncGetTasks.pending, (state) => {
            state.errorMessage = null
        })
        builder.addCase(fetchAsyncGetTasks.fulfilled, (state, action: PayloadAction<READ_TASK[]>) => {
            return {
                ...state,
                tasks: action.payload,
            }
        })
        builder.addCase(fetchAsyncGetTasks.rejected, (state) => {
            console.log("failed GetTasks")
            state.errorMessage = "認証情報の有効期限切れです。"
            // window.location.href = "/"
        })

        //GetUsers
        builder.addCase(fetchAsyncGetUsers.pending, (state) => {
            state.errorMessage = null
        })
        builder.addCase(fetchAsyncGetUsers.fulfilled, (state, action: PayloadAction<USER[]>) => {
            return {
                ...state,
                users: action.payload
            }
        })
        builder.addCase(fetchAsyncGetUsers.rejected, (state) => {
            console.log("failed GetUsers")
            state.errorMessage = "認証情報の有効期限切れです。"
            // window.location.href = "/"
        })

        //GetCategory
        builder.addCase(fetchAsyncGetCategory.pending, (state) => {
            state.errorMessage = null
        })
        builder.addCase(fetchAsyncGetCategory.fulfilled, (state, action: PayloadAction<CATEGORY[]>) => {
            return {
                ...state,
                categorys: action.payload
            }
        })
        builder.addCase(fetchAsyncGetCategory.rejected, (state) => {
            console.log("failed GetCategory")
            state.errorMessage = "認証情報の有効期限切れです。"
            // window.location.href = "/"
        })

        //CreateCategory
        builder.addCase(fetchAsyncCreateCategory.pending, (state) => {
            state.errorMessage = null
        })
        builder.addCase(fetchAsyncCreateCategory.fulfilled, (state, action: PayloadAction<CATEGORY>) => {
            return {
                ...state,
                categorys: [...state.categorys, action.payload]
            }
        })
        builder.addCase(fetchAsyncCreateCategory.rejected, (state) => {
            console.log("failed CreateCategory")
            state.errorMessage = "認証情報の有効期限切れです。"
            // window.location.href = "/"
        })

        //CreateTask
        builder.addCase(fetchAsyncCreateTask.pending, (state) => {
            state.errorMessage = null
        })
        builder.addCase(fetchAsyncCreateTask.fulfilled, (state, action: PayloadAction<READ_TASK>) => {
            return {
                ...state,
                tasks: [action.payload, ...state.tasks],
                editedTask: initialState.editedTask,
            }
        })
        builder.addCase(fetchAsyncCreateTask.rejected, (state) => {
            console.log("failed CreateTask")
            state.errorMessage = "認証情報の有効期限切れです。"
            // window.location.href = "/"
        })

        //UpdateTask
        builder.addCase(fetchAsyncUpdateTask.pending, (state) => {
            state.errorMessage = null
        })
        builder.addCase(fetchAsyncUpdateTask.fulfilled, (state, action: PayloadAction<READ_TASK>) => {
            return {
                ...state,
                tasks: state.tasks.map((t) =>
                    t.id === action.payload.id ? action.payload : t
                ),
                editedTask: initialState.editedTask,
                selectedTask: initialState.selectedTask,
            }
        })
        builder.addCase(fetchAsyncUpdateTask.rejected, (state) => {
            console.log("failed UpdateTask")
            state.errorMessage = "認証情報の有効期限切れです。"
            // window.location.href = "/"
        })

        //DeleteTask
        builder.addCase(fetchAsyncDeleteTask.pending, (state) => {
            state.errorMessage = null
        })
        builder.addCase(fetchAsyncDeleteTask.fulfilled, (state, action: PayloadAction<number>) => {
            return {
                ...state,
                tasks: state.tasks.filter((t) => t.id !== action.payload),
                editedTask: initialState.editedTask,
                selectedTask: initialState.selectedTask,
            }
        })
        builder.addCase(fetchAsyncDeleteTask.rejected, (state) => {
            console.log("failed DeleteTask")
            state.errorMessage = "認証情報の有効期限切れです。"
            // window.location.href = "/"
        })
    }
},
);

export const { editTask, selectTask } = taskSlice.actions;


export const selectTasks = (state: RootState) => state.task.tasks;
export const selectEditedTask = (state: RootState) => state.task.editedTask;
export const selectSelectedTask = (state: RootState) => state.task.selectedTask;
export const selectUsers = (state: RootState) => state.task.users;
export const selectCategory = (state: RootState) => state.task.categorys;
export const selectErrorMessage = (state: RootState) => state.task.errorMessage;


export default taskSlice.reducer;
