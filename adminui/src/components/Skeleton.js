import {AppBar, Button, Container, CssBaseline, Link, Toolbar, Typography} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import RouterLink from "./common/RouterLink";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginBottom: theme.spacing(4),
  },
  footer: {
    padding: theme.spacing(1.5),
    marginTop: 'auto',
    paddingTop: 'auto',
    height: theme.spacing(6),
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '60vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  appBarLink: {
    color: 'white',
    textDecoration: 'none !important'
  },
}));

export default function Skeleton(props) {
  const classes = useStyles();
  const signOut = () => {
    sessionStorage.removeItem("token");
    // eslint-disable-next-line
    location.reload();
  }

  return (
      <div className={classes.root}>
        <CssBaseline/>
        <AppBar position="absolute" className={classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Typography component="h1" variant="h6" noWrap className={classes.title}>
              <Link component={RouterLink} to="/" className={classes.appBarLink}>问答系统管理端</Link>
            </Typography>
            <div>
              <Button component={RouterLink} to="/" color="inherit">分类管理</Button>
              <Button component={RouterLink} to="/questions" color="inherit">问题管理</Button>
              <Button component={RouterLink} to="/refreshIndex" color="inherit">刷新索引</Button>
              <Button onClick={signOut} color="inherit">退出登录</Button>
            </div>
          </Toolbar>
        </AppBar>
        <main className={clsx(classes.content, classes.main)}>
          <div className={classes.appBarSpacer}/>
          <Container className={classes.container}>{props.children}</Container>
        </main>
      </div>
  );
}