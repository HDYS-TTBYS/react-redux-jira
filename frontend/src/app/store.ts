import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducers from '../features/auth/authSlice';
import taskReducers from "../features/task/taskSlice";
// import { save, load } from 'redux-localstorage-simple';

export const store = configureStore({
  reducer: {
    auth: authReducers,
    task: taskReducers,
  },
  // preloadedState: load(),
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(save()),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppDispatch = typeof store.dispatch;
