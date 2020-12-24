import React from 'react';
import clsx from 'clsx';
import {
  AppBar,
  Badge,
  Container,
  CssBaseline,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  SwipeableDrawer,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import {ChevronRight, Menu, Notifications} from '@material-ui/icons';
import {ThemeProvider} from '@material-ui/styles';
import AnswerPanel from "./components/AnswerPanel";
import Copyright from "./components/Copyright";
import {useFooterBackgroundColor, useNwafuTheme} from "./components/Theme";
import axiosInstance from "./components/common/AxiosInstance";

const drawerWidth = 280;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(0.5),
    marginTop: 'auto',
    paddingTop: 'auto',
    height: theme.spacing(6),
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '60vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  mb1: {
    marginBottom: theme.spacing(1),
  },
}));

export default function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [thisQuestion, setThisQuestion] = React.useState('');
  const [questions, setQuestions] = React.useState([]);
  const toggleDrawer = (status) => (event) => {
    if (!(event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')))
      setOpen(status);
  };
  const addQuestion = () => {
    const q = thisQuestion;
    setThisQuestion('');
    axiosInstance.get('/bert/query', {
      params: {
        question: q
      }
    }).then((resp) => {
      setQuestions(questions.concat(resp.data));
    });
  };
  const questionUpdateHandler = (e) => setThisQuestion(e.target.value);
  const addQuestionOnEnter = (event) => {
    if (event.key === 'Enter')
      addQuestion();
  };

  return (
      <div className={classes.root}>
        <ThemeProvider theme={useNwafuTheme()}>
          <CssBaseline/>
          <SwipeableDrawer open={open} onOpen={toggleDrawer(true)} onClose={toggleDrawer(false)}
                           classes={{paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),}}>
            <div className={classes.list} role="presentation"
                 onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            </div>
          </SwipeableDrawer>
          <AppBar position="absolute" className={classes.appBar}>
            <Toolbar className={classes.toolbar}>
              <IconButton edge="start" aria-label="open drawer" onClick={toggleDrawer(true)}
                          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
                <Menu/>
              </IconButton>
              <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                自动问答
              </Typography>
              <IconButton>
                <Badge badgeContent={1} color="secondary"><Notifications/></Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
          <main className={clsx(classes.content, classes.main)}>
            <div className={classes.appBarSpacer}/>
            <Container maxWidth="lg" className={classes.container}>
              <Paper className={classes.paper}>
                <Typography variant="h5">问我一个问题：</Typography>
                <TextField id="outlined-name" placeholder="您遇到了什么问题？" margin="normal" variant="outlined"
                           value={thisQuestion} onChange={questionUpdateHandler} onKeyPress={addQuestionOnEnter}
                           InputProps={{
                             endAdornment: (<InputAdornment position="end">
                               <IconButton edge="end" aria-label="Find answer for your question" onClick={addQuestion}>
                                 <ChevronRight/>
                               </IconButton>
                             </InputAdornment>),
                           }}/>
              </Paper>
            </Container>
            <Container maxWidth="lg" className={classes.container}>
              {[...questions].reverse().map(value => (
                  value.code === 'SUCCESS' ? (
                      <AnswerPanel data={value.data}/>
                  ) : (
                      <Paper className={clsx(classes.paper, classes.mb1)}>
                        <Typography>{value.message}</Typography>
                      </Paper>
                  )
              ))}
            </Container>
          </main>
          <footer className={clsx(classes.footer, useFooterBackgroundColor()().footer)}>
            <Container>
              <Copyright/>
            </Container>
          </footer>
        </ThemeProvider>
      </div>
  );
}
