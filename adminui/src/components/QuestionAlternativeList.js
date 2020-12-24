import React from "react";
import {useStyles} from "./common/styles";
import axiosInstance from "./common/AxiosInstance";
import {
  Button,
  FormControl,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@material-ui/core";


export default function QuestionAlternativeList({match}) {
  const classes = useStyles();
  const [question, setQuestion] = React.useState(null);
  const [alt, setAlt] = React.useState([]);
  const [modalErrorMessage, setModalErrorMessage] = React.useState(null);
  const [selectedAlt, setSelectedAlt] = React.useState(-1);
  const [openNewModal, setOpenNewModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [editModalData, setEditModalData] = React.useState(null);

  React.useEffect(() => {
    axiosInstance.get('/questions/' + match.params.id).then((resp) => {
      setQuestion(resp.data.data);
    });
    axiosInstance.get('/questions/' + match.params.id + '/alternatives').then((resp) => {
      setAlt(resp.data.data);
    });
  }, [match.params.id]);

  const handleObjectFieldChange = (o, fn, f) => (e) => {
    fn({...o, [f]: e.target.value});
  };
  const handleOpenNewModal = () => {
    setEditModalData({question: ""});
    setOpenNewModal(true);
  };
  const handleOpenEditModal = (i) => () => {
    setSelectedAlt(i);
    setEditModalData(alt[i]);
    setOpenEditModal(true);
  };
  const handleOpenDeleteModal = (i) => () => {
    setSelectedAlt(i);
    setOpenDeleteModal(true);
  };
  const handleCloseModal = () => {
    setOpenNewModal(false);
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setSelectedAlt(-1);
    setEditModalData(null);
    setModalErrorMessage(null);
  };
  const handleNewModal = () => {
    axiosInstance.put('/questions/' + question.id + '/alternatives', {
      question: editModalData.question,
    }).then(() => {
      // eslint-disable-next-line
      location.reload();
    }).catch((e) => setModalErrorMessage(e.message !== undefined ? e.message : JSON.stringify(e)));
  };
  const handleEditModal = () => {
    axiosInstance.post('/questions/' + question.id + '/alternatives/' + alt[selectedAlt].id, {
      question: editModalData.question,
    }).then(() => {
      // eslint-disable-next-line
      location.reload();
    }).catch((e) => setModalErrorMessage(e.message !== undefined ? e.message : JSON.stringify(e)));
  };
  const handleDeleteModal = () => {
    axiosInstance.delete('/questions/' + question.id + '/alternatives/' + alt[selectedAlt].id).then(() => {
      // eslint-disable-next-line
      location.reload();
    }).catch((e) => setModalErrorMessage(e.message !== undefined ? e.message : JSON.stringify(e)));
  };

  return (<div>
    <Paper className={classes.paper}>
      <Typography>
        {question !== null ? (<span>{question.question} 的同义提问</span>) : "正在加载……"}
      </Typography>
    </Paper>
    <Typography>&nbsp;</Typography>
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>同义提问</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alt.map((row, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell>{row.question}</TableCell>
                <TableCell>
                  <Button size="small" color="primary" onClick={handleOpenEditModal(i)}>编辑</Button>
                  <Button size="small" className={classes.textDanger} onClick={handleOpenDeleteModal(i)}>删除</Button>
                </TableCell>
              </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4}>
              <Button size="small" color="primary" onClick={handleOpenNewModal}>添加同义提问</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>

    <Modal disableAutoFocus disableEnforceFocus open={openNewModal} onClose={handleCloseModal}>
      {(openNewModal) ? (<div className={classes.modalPaper}>
        <Typography variant="h5" component="h2">添加同义提问</Typography>
        <div>
          <TextField fullWidth margin="normal" label="同义提问"
                     value={editModalData.question}
                     onChange={handleObjectFieldChange(editModalData, setEditModalData, 'question')}/>
          <FormControl fullWidth margin="normal">
            <Button variant="contained" color="primary" onClick={handleNewModal}>
              提交修改
            </Button>
          </FormControl>
          {modalErrorMessage !== null ? (
              <Paper className={classes.errorsPaper}>
                <Typography>{modalErrorMessage}</Typography>
              </Paper>
          ) : null}
        </div>
      </div>) : (<Typography>Error</Typography>)}
    </Modal>

    <Modal disableAutoFocus disableEnforceFocus open={openEditModal} onClose={handleCloseModal}>
      {(openEditModal && selectedAlt !== -1) ? (<div className={classes.modalPaper}>
        <Typography variant="h5" component="h2">编辑同义提问 {alt[selectedAlt].question}</Typography>
        <div>
          <TextField fullWidth margin="normal" label="同义提问"
                     value={editModalData.question}
                     onChange={handleObjectFieldChange(editModalData, setEditModalData, 'question')}/>
          <FormControl fullWidth margin="normal">
            <Button variant="contained" color="primary" onClick={handleEditModal}>
              提交修改
            </Button>
          </FormControl>
          {modalErrorMessage !== null ? (
              <Paper className={classes.errorsPaper}>
                <Typography>{modalErrorMessage}</Typography>
              </Paper>
          ) : null}
        </div>
      </div>) : (<Typography>Error</Typography>)}
    </Modal>

    <Modal disableAutoFocus disableEnforceFocus open={openDeleteModal} onClose={handleCloseModal}>
      <div className={classes.modalPaper}>
        {openDeleteModal && selectedAlt !== -1 ? (<div>
          <Typography variant="h5" component="h2">删除同义提问 {alt[selectedAlt].question}</Typography>
          <Typography>
            请确认你是否真的要删除问题 {question.question} 的同义提问 {alt[selectedAlt].question} ？此操作不可撤销。
          </Typography>
          <FormControl fullWidth margin="normal">
            <Button variant="contained" className={classes.buttonDanger} onClick={handleDeleteModal}>
              确认删除
            </Button>
          </FormControl>
          {modalErrorMessage !== null ? (
              <Paper className={classes.errorsPaper}>
                <Typography>{modalErrorMessage}</Typography>
              </Paper>
          ) : null}
        </div>) : (<Typography>Error</Typography>)}
      </div>
    </Modal>
  </div>);
}
