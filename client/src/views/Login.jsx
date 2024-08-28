import * as React from 'react';
import Card from '@mui/material/Card';
import { useState } from 'react'
import { loginValidation } from '../validations/login_validations';
import { OutlinedInput, IconButton, InputAdornment, Grid, InputLabel, TextField, Button } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { loginUserAction, toggleLoader } from '../reducer/actions/USER_ACTIONS';
import { useStyles } from './Styles/LOGIN_STYLE'


export default function Login() {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch()
    const [error, setError] = useState({
        email: false,
        password: false,
        invalidData: false
    })
   const classes=useStyles()
    const nav = useNavigate()
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleLogin = async () => {
        try{
        const errorCheck = loginValidation(email, password)
        setError(errorCheck);
        if (errorCheck.email || errorCheck.password) {
            return
        };
        dispatch(toggleLoader(true))
        const response = await fetch("http://localhost:3001/login", {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),

        })
        if(!response.ok){
            setError({...error,invalidData:true})
            dispatch(toggleLoader(false))
            return

        }
        const accessToken = response.headers.get("Authorization").split(' ')[1]
        
        dispatch(toggleLoader(false))
        const data=await response.json()
        console.log(data)
        sessionStorage.setItem('userId',JSON.stringify(data.user_id))
        sessionStorage.setItem('accessToken',JSON.stringify(accessToken))
        dispatch(loginUserAction(data.id))
        nav('/')
    } catch (err) {
        console.log(err)
        dispatch(toggleLoader(false))
        nav('/*')
    }
    }


const handleKeyPress=(e)=>{
if(e.key==='Enter'){
    handleLogin()
    e.preventDefault()
}
}

return (
    <div className={classes.div}>
        <Card className={classes.card}>
            <form 
            onKeyDown={(e)=>handleKeyPress(e)}>
                <h1 style={{ textAlign: 'center' }}>Login</h1>
                <Grid container spacing={2} justifyContent="center" alignItems="center">
                    <Grid item xs={12}>
                        <InputLabel sx={{ width: '100%', textAlign: 'center' }} htmlFor="filled-adornment-password">email</InputLabel>
                        <TextField error={error.email} sx={{ display: 'flex', margin: 'auto', width: '90%' }} id="fullWidth"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <InputLabel sx={{ width: '100%', textAlign: 'center' }} htmlFor="filled-adornment-password">Password</InputLabel>

                        <OutlinedInput
                            error={error.password}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            sx={{ display: 'flex', margin: 'auto', width: '90%' }}
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="password"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {error.invalidData && <h3 style={{ textAlign: 'center', color: 'red' }}>User not found</h3>}
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button sx={{backgroundColor:'#5D35FF'}} variant="contained" size='large' onClick={() => handleLogin()}>Login</Button>
                    </Grid>
                    <Grid item>
                        <span>Don't have account? </span>
                        <Button
                            onClick={() => { nav('/register') }}
                            size="small">Register</Button>
                    </Grid>
                </Grid>
            </form>

        </Card>
    </div>
);
}