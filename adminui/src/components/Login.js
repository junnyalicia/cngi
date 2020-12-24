import React from 'react';
import {Avatar, Button, CssBaseline, Grid, Hidden, Paper, TextField, Typography} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {makeStyles} from '@material-ui/core/styles';
import Configuration from "../config";
import axios from "axios";

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/collection/540518/1600x900)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  errorsPaper: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1),
    width: '100%',
    textAlign: 'left',
  },
}));

export default function SignInPage(props, context) {
  const classes = useStyles();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(null);

  if (sessionStorage.getItem("token")) {
    // eslint-disable-next-line
    sessionStorage.removeItem("token");
  }

  const handleLogin = () => {
    axios.post(Configuration.API_ENDPOINT + '/auth', {
      username: username,
      password: password
    }).then((resp) => {
      sessionStorage.setItem("token", resp.data.access_token);
      // eslint-disable-next-line
      location.href = '/';
    }).catch((error) => {
      if (error.response) {
        setErrorMessage(error.response.data.description);
      }
    });
  };
  const setField = (f) => (e) => (f(e.target.value));
  const onKeyPress = (event) => {
    if (event.key === 'Enter')
      handleLogin();
  }

  return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline/>
        <Hidden xsDown>
          <Grid item sm={4} md={7} className={classes.image}
                style={{display: "flex", alignItems: "center"}}>
          </Grid>
        </Hidden>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}><LockOutlinedIcon/></Avatar>
            <Typography component="h1" variant="h5">用户登录</Typography>
            {errorMessage !== null ? (
                <Paper className={classes.errorsPaper}>
                  <Typography>{errorMessage}</Typography>
                </Paper>
            ) : null}
            <TextField variant="outlined" margin="normal" required fullWidth label="用户名" autoComplete="off"
                       value={username} onChange={setField(setUsername)} onKeyPress={onKeyPress}/>
            <TextField variant="outlined" margin="normal" required fullWidth type="password" label="密码"
                       autoComplete="off" value={password} onChange={setField(setPassword)} onKeyPress={onKeyPress}/>
            <Button type="submit" fullWidth variant="contained"
                    color="primary" className={classes.submit} onClick={handleLogin}>
              登录
            </Button>
          </div>
        </Grid>
      </Grid>
  );

}
