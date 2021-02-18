import React, { useState } from 'react'
import styles from "./Auth.module.css";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { TextField, Button } from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
    toggleMode,
    fetchAsyncLogin,
    fetchAsyncRegister,
    fetchAsyncCreateProf,
    selectIsLoginView,
    selectErrorMessage as authSelectErrorMessage,
} from "./authSlice";
import {
    selectErrorMessage as taskSelectErrorMessage,
} from "../task/taskSlice";
import { CRED } from '../types';


const useStyles = makeStyles((theme: Theme) => ({
    button: {
        margin: theme.spacing(3),
    }
}))
const Auth: React.FC = () => {
    const classes = useStyles()
    const dispatch: AppDispatch = useDispatch()
    const isLoginView = useSelector(selectIsLoginView)
    const [isLoding, setisLoding] = useState(false)
    const authErrorMessage = useSelector(authSelectErrorMessage)
    const taskErrorMessage = useSelector(taskSelectErrorMessage)
    const [credential, setCredential] = useState<CRED>({ username: "", password: "" })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredential({ ...credential, [e.target.name]: e.target.value })
    }
    const login = async () => {
        setisLoding(true)
        if (isLoginView) {
            await dispatch(fetchAsyncLogin(credential))
        } else {
            const result = await dispatch(fetchAsyncRegister(credential))
            if (fetchAsyncRegister.fulfilled.match(result)) {
                await dispatch(fetchAsyncLogin(credential))
                await dispatch(fetchAsyncCreateProf())
            }
        }
        setisLoding(false)
    }

    return (
        <div className={styles.auth__root}>
            {isLoding ? <CircularProgress /> : null}

            <h1>{isLoginView ? "ログイン" : "新規作成"}</h1>
            <br />
            <TextField
                InputLabelProps={{
                    shrink: true,
                }}
                label="ユーザーネーム"
                type="text"
                name="username"
                value={credential.username}
                onChange={handleInputChange}
                disabled={isLoding}
            />
            <br />
            <TextField
                InputLabelProps={{
                    shrink: true,
                }}
                label="パスワード"
                type="password"
                name="password"
                value={credential.password}
                onChange={handleInputChange}
                disabled={isLoding}
            />
            <Button
                variant="contained"
                color="primary"
                size="small"
                className={classes.button}
                onClick={login}
                disabled={credential.username === "" || credential.password === "" || isLoding}
            >
                {isLoginView ? "ログイン" : "新規作成"}
            </Button>
            <span onClick={() => dispatch(toggleMode())}>
                {isLoginView ? "アカウントを作成" : "ログインに戻る"}
            </span>
            {authErrorMessage ? <Alert severity="error">{authErrorMessage}</Alert> : null}
            <br />
            {taskErrorMessage ? <Alert severity="error">{taskErrorMessage}</Alert> : null}

        </div>
    )
}

export default Auth
