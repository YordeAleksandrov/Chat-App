import * as React from 'react';
import Card from '@mui/material/Card';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react'
import { registerValidations } from '../validations/register_validation';
import { OutlinedInput, IconButton, InputAdornment, Grid, InputLabel, TextField, Button } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { loginUserAction, toggleLoader } from '../reducer/actions/USER_ACTIONS';
import { useStyles } from './Styles/REGISTER_STYLE'



export default function Register() {
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const[name,setName]=useState('')
    const [showPassword, setShowPassword] = useState(false)
    const dispatch = useDispatch()
    const [error, setError] = useState({
        email: false,
        password: false,
        name:false,
        invalidData: false
    })
    const classes=useStyles()
    const nav = useNavigate()
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleRegister = async () => {
        const errorCheck = registerValidations(name,email, password)
        setError(errorCheck);
        console.log(errorCheck)
        if (errorCheck.email || errorCheck.password ||errorCheck.name) {
            return
        };
        dispatch(toggleLoader(true))
        try {
            const response = await fetch("http://localhost:3001/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id:uuidv4(),
                    name:name,
                    email: email,
                    password: password,
                }),
    
            })
            if (!response.ok) {
                console.log('error at registering')
                setError({ ...error, invalidData: true })
                dispatch(toggleLoader(false))
                return
    
            }
            const accessToken = response.headers.get("Authorization").split(' ')[1]
            dispatch(toggleLoader(false))
            const data = await response.json()
            dispatch(loginUserAction(data.user))
            sessionStorage.setItem('user', JSON.stringify(data.user))
            sessionStorage.setItem('accessToken',JSON.stringify(accessToken))
            nav('/')
            
        } catch (error) {
             console.log(error)
        }
       
    }




    return (
        <div className={classes.div}>
            <Card className={classes.card}>
                <form>
                    <h1 style={{ textAlign: 'center' }}>Register</h1>
                    <Grid container spacing={4} justifyContent="center" alignItems="center">
                        <Grid item xs={12}>
                            <InputLabel sx={{ width: '100%', textAlign: 'center' }} htmlFor="filled-adornment-password">Username</InputLabel>
                            <TextField error={error.name} sx={{ display: 'flex', margin: 'auto', width: '90%' }} id="fullWidth"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel sx={{ width: '100%', textAlign: 'center' }} htmlFor="filled-adornment-password">email</InputLabel>
                            <TextField error={error.email} sx={{ display: 'flex', margin: 'auto', width: '90%' }} id="fullWidth2"
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
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button sx={{backgroundColor:'#5D35FF'}} variant="contained" size='large' onClick={() => handleRegister()}>Register</Button>
                        </Grid>
                        <Grid item>
                        <span>already got an account?</span>
                            <Button
                            
                                onClick={() => { nav('/login') }}
                                size="small"> Login</Button>
                        </Grid>
                    </Grid>
                </form>

            </Card>
        </div>
    );
}