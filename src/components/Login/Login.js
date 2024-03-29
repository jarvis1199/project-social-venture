import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import firebase, { auth, db, provider } from '../../utils/firebase'

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField'
import { InputAdornment } from '@material-ui/core';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import { FcGoogle } from 'react-icons/fc';
import { Alert } from "@material-ui/lab";
import CircularProgress from '@material-ui/core/CircularProgress';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import Footer from './../Footer/Footer'
import bgImage from '../../assets/images/bgImage_2.png'
import { alpha } from '@material-ui/core/styles'

//#region //styles

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        // flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        height: "100vh",
        backgroundColor: 'white'
    },
    bgStyle: {
        backgroundImage: `url(${bgImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        // margin: 'auto',
        height: '820px',
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            height: '100%'
        },
    },
    gridContainer: {
        width: '75%',
        [theme.breakpoints.down('sm')]: {
            width: '95%',
        },
    },
    formContainer: {
        backgroundColor: 'white',
        padding: 40,
        borderRadius: 25,
        boxShadow: theme.palette.colors.boxShadow,
        width: 400,

    },
    textMargin: {
        marginTop: 20
    },
    btnStyle: {
        marginTop: 20,
        borderRadius: 15,
        padding: 10,
        [theme.breakpoints.down('sm')]: {
            fontSize: 10
        },
    },
    googleBtn: {
        marginTop: 25,
        fontSize: 15,
        borderRadius: 15,
        [theme.breakpoints.down('sm')]: {
            fontSize: 12
        },
    },
    errorMessage: {
        fontSize: 15,
        marginTop: 10
    },
    modal: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 200,
    },
    paper: {
        backgroundColor: alpha(theme.palette.background.paper),
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    forgotStyle: {
        cursor: 'pointer',
        color: 'blue',
        '&:hover': {
            color: '#4877c2',
        },
    }
}))

//#endregion

export default function Login() {

    const history = useHistory();

    const classes = useStyles();

    const [values, setValues] = useState({
        email: "",
        password: "",
        showPassword: false,
        errors: "",
        isLoading: false,
        selectedDate: new Date('2014-08-18T21:11:54')
    })

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (prop) => (e) => {
        setValues({ ...values, [prop]: e.target.value })
    }

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const login = (e) => {

        e.preventDefault();

        setValues({ ...values, isLoading: true });

        if (!values.email || !values.password) {
            setValues({ ...values, errors: "Please Complete all fields", isLoading: false, password: "" })
        }
        else {
            firebase.auth().signInWithEmailAndPassword(values.email, values.password)
                .then((userCredential) => {
                    // Signed  
                    //var user = userCredential.user;
                    // ...
                    setValues({ ...values, errors: "", isLoading: false })
                    history.push('/home')
                })
                .catch((error) => {
                    //var errorCode = error.code;
                    var errorMessage = error.message;
                    setValues({ ...values, errors: errorMessage, isLoading: false, password: "" })
                });
        };
    }

    const loginwithGoogle = (e) => {

        e.preventDefault();


        auth
            .signInWithPopup(provider)
            .then((result) => {

                const firstName = result.additionalUserInfo.profile.given_name;
                const lastName = result.additionalUserInfo.profile.family_name;
                // This gives you a Google Access Token. You can use it to access the Google API.
                // The signed-in user info.
                // ...
                var user = result.user;
                db.collection("users").doc(user.uid).set(
                    {
                        email: user.email,
                        firstname: firstName,
                        lastname: lastName,
                        photourl: user.photoURL,
                        userid: user.uid,
                        gender: "",
                        birthday: values.selectedDate,
                        signinwithgoogle: "true"
                    }).then(() => {
                        setValues({ isLoading: false });           
                        history.push('/home');
                    })
            }).catch((error) => {

            });
    }

    if (values.isLoading) {
        return (
            <div className={classes.root}>
                <CircularProgress color="primary" size={200} />
            </div>
        );
    }

    return (
        <>
            <Grid className={classes.bgStyle}>
                <Grid container justifyContent="center" style={{ margin: '100px auto' }}>
                    <Grid className={classes.gridContainer}>
                        <Grid container justifyContent="flex-start">
                            <Grid className={classes.formContainer}>
                                <Grid align='center'>
                                    <h2>Sign In</h2>
                                </Grid>
                                {values.errors && (
                                    <Alert className={classes.errorMessage} severity="error">
                                        {values.errors}
                                    </Alert>)}
                                <form>
                                    <Grid container>
                                        <TextField
                                            name="username"
                                            type="name"
                                            label="EMAIL"
                                            placeholder="Email"
                                            variant="outlined"
                                            className={classes.textMargin}
                                            autoFocus={true}
                                            onChange={handleChange("email")}
                                            value={values.email}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MailOutlineIcon color="primary" />
                                                    </InputAdornment>
                                                ),
                                                className: classes.textSize
                                            }}
                                            InputLabelProps={{
                                                className: classes.labelStyle
                                            }}
                                        />
                                    </Grid>
                                    <Grid container>
                                        <TextField
                                            label='Password'
                                            placeholder='Enter password'
                                            name="password"
                                            variant="outlined"
                                            onChange={handleChange("password")}
                                            value={values.password}
                                            type={values.showPassword ? 'text' : 'password'}
                                            className={classes.textMargin}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockOutlinedIcon color="primary" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                        >
                                                            {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                                className: classes.textSize
                                            }}
                                            InputLabelProps={{
                                                className: classes.labelStyle
                                            }}
                                        />
                                    </Grid>
                                    <Grid container justifyContent="flex-end" style={{ marginTop: 10 }} onClick={handleOpen} >
                                        <Typography className={classes.forgotStyle}>Forgot Password?</Typography>
                                    </Grid>
                                    <Grid container justifyContent="center" spacing={3}>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.btnStyle}
                                                fullWidth
                                                onClick={login}
                                            >Login Now</Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.btnStyle}
                                                fullWidth
                                                onClick={() => history.push('/signup')}
                                            >Sign up</Button>
                                        </Grid>
                                    </Grid>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        className={classes.googleBtn}
                                        startIcon={<FcGoogle />}
                                        fullWidth
                                        onClick={loginwithGoogle}
                                    >
                                        Sign in with google
                                    </Button>
                                </form>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <>
                        <Fade in={open}>
                            <ForgotPassword />
                        </Fade>
                    </>
                </Modal>

            </Grid>
            <Footer />
        </>
    )
}
