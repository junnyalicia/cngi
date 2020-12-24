import React from 'react';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {
  Button,
  ButtonGroup,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Paper,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactMarkdown from "react-markdown";

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    margin: theme.spacing(1),
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '60%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  expansionPanelActions: {
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
  },
  ml1: {
    marginLeft: theme.spacing(1)
  },
  m1: {
    margin: theme.spacing(1),
  },
  feedbackPanelPadding: {
    padding: theme.spacing(2, 3),
  },
}));

const panelStyles = {
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:first-child)': {
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
    },
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
};

const MyExpansionPanel = withStyles(panelStyles)(ExpansionPanel);
const FeedbackPanel = withStyles(panelStyles)(Paper);


export default function AnswerPanel(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(0);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (<div className={classes.root}>
    <Typography className={classes.m1} component="p" variant="subtitle2" color="textSecondary">
      {props.data.user_question}
    </Typography>
    {props.data.results.map((value, index) => (
        <MyExpansionPanel expanded={expanded === index} onChange={handleChange(index)}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>}>
            <Typography className={classes.heading}>{value.question}</Typography>
            <Typography className={classes.secondaryHeading}>{value.category_path}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <div>
              <ReactMarkdown source={value.answer}/>
            </div>
          </ExpansionPanelDetails>
        </MyExpansionPanel>
    ))}
    <FeedbackPanel className={classes.feedbackPanelPadding}>
      <ButtonGroup variant="outlined" color="primary" size="small">
        {props.data.results.map((v, i) => (
            <Button key={i}>{i + 1}</Button>
        ))}
        <Button color="secondary">未解决</Button>
      </ButtonGroup>
      <Typography component="small" variant="caption" className={classes.ml1}>
        以上哪个回答解决了您的问题？您的反馈将帮助我们改进回答。
      </Typography>
    </FeedbackPanel>
  </div>);
}
