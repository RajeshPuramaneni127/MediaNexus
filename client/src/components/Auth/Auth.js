import React, { useState } from 'react';
import { Avatar, Typography, Button, Paper, Grid, Container } from '@material-ui/core';
import useStyles from './styles';
import { LockOutlined } from '@material-ui/icons';
import Input from './Input';
import { GoogleLogin } from 'react-google-login';
import Icon from './Icon';
import { useDispatch } from 'react-redux';
import { AUTH } from '../../constants/ActionTypes';
import { useHistory } from 'react-router-dom';
import { signup, signin } from '../../actions/auth'

const initialState = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

const Auth = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [showPassword, setShowPassword] = useState(false);
    const classes = useStyles();
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSignup) {
            dispatch(signup(formData, history));
        } else {
            dispatch(signin(formData, history));
        }
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const switchMode = () => {
        setIsSignup((prev) => !prev);
        setShowPassword(false);
    }
    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;
        try {
            dispatch({ type: AUTH, data: { result, token } })
            history.push('/');
        } catch (error) {
            console.log(error)
        }
    }
    const googleFailure = () => {
        console.log("Gogle Sign In was unsuccessfull! Try again");
    }
    return (
        <Container component="main" maxWidth='xs'>
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlined />
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                    <Input name="lastName" label="Last Name" handleChange={handleChange} autoFocus half />
                                </>
                            )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        {isSignup && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Button type="submmit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignup ? 'SIGN UP' : 'SIGN IN'}
                    </Button>
                    <GoogleLogin
                        clientId="302835672157-ldri4pv6pdmeuupa5193la9mbc47ktcl.apps.googleusercontent.com"
                        render={(renderProps) => (
                            <Button
                                className={classes.googleButton}
                                color="primary"
                                fullWidth
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                startIcon={<Icon />}
                                variant="contained">
                                Google Sign In
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy={'single_host_origin'}
                    />
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
}

export default Auth;
