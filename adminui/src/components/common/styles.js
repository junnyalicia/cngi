import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  textDanger: {
    color: theme.palette.error.main
  },
  paper: {
    padding: theme.spacing(2, 4, 3),
  },
  modalPaper: {
    position: 'absolute',
    width: '50%',
    backgroundColor: theme.palette.background.paper,
    borderColor: theme.palette.background.paper,
    borderWidth: '2px',
    borderStyle: 'solid',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
  },
  buttonDanger: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
  },
  successPaper: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.common.white,
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1),
    width: '100%',
    textAlign: 'left',
  },
  errorsPaper: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.common.white,
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1),
    width: '100%',
    textAlign: 'left',
  },
  infoPaper: {
    backgroundColor: theme.palette.info.main,
    color: theme.palette.common.white,
    margin: theme.spacing(3, 0, 2),
    padding: theme.spacing(1),
    width: '100%',
    textAlign: 'left',
  },
}));