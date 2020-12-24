import React from "react";
import axiosInstance from "./common/AxiosInstance";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import ReactMarkdown from "react-markdown";
import {useStyles} from "./common/styles";
import RouterLink from "./common/RouterLink";


export default function QuestionList({props}) {
  const classes = useStyles();
  const [categories, setCategories] = React.useState([]);
  const [questions, setQuestions] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(-1);
  const [selectedQuestion, setSelectedQuestion] = React.useState(-1);
  const [modalErrorMessage, setModalErrorMessage] = React.useState(null);
  const [openAnswerModal, setOpenAnswerModal] = React.useState(false);
  const [openNewModal, setOpenNewModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [editModalData, setEditModalData] = React.useState(null);

  const handleFieldChange = (f) => (e) => f(e.target.value);
  const handleObjectFieldChange = (o, fn, f) => (e) => {
    fn({...o, [f]: e.target.value});
  };
  React.useEffect(() => {
    axiosInstance.get('/categories/').then(resp => setCategories(resp.data.data));
  }, []);
  React.useEffect(() => {
    axiosInstance.get(
        '/questions/' + (selectedCategory !== -1 ? 'list_by_categories/' + selectedCategory : '')
    ).then(resp => setQuestions(resp.data.data));
  }, [selectedCategory]);

  const handleOpenAnswerModal = (i) => () => {
    setSelectedQuestion(i);
    setOpenAnswerModal(true);
  };
  const handleOpenNewModal = () => {
    setEditModalData({category_id: 0, question: "", answer: ""});
    setOpenNewModal(true);
  };
  const handleOpenEditModal = (i) => () => {
    setSelectedQuestion(i);
    setEditModalData(questions[i]);
    setOpenEditModal(true);
  };
  const handleOpenDeleteModal = (i) => () => {
    setSelectedQuestion(i);
    setOpenDeleteModal(true);
  };
  const handleCloseModal = () => {
    setOpenAnswerModal(false);
    setOpenNewModal(false);
    setOpenEditModal(false);
    setOpenDeleteModal(false);
    setSelectedQuestion(-1);
    setEditModalData(null);
    setModalErrorMessage(null);
  };
  const handleNewModal = () => {
    axiosInstance.put('/questions/', {
      question: editModalData.question,
      answer: editModalData.answer,
      category_id: editModalData.category_id,
    }).then(() => {
      // eslint-disable-next-line
      location.reload();
    }).catch((e) => setModalErrorMessage(e.message !== undefined ? e.message : JSON.stringify(e)));
  };
  const handleEditModal = () => {
    axiosInstance.post('/questions/' + questions[selectedQuestion].id, {
      question: editModalData.question,
      answer: editModalData.answer,
      category_id: editModalData.category_id,
    }).then(() => {
      // eslint-disable-next-line
      location.reload();
    }).catch((e) => setModalErrorMessage(e.message !== undefined ? e.message : JSON.stringify(e)));
  };
  const handleDeleteModal = () => {
    axiosInstance.delete('/questions/' + questions[selectedQuestion].id).then(() => {
      // eslint-disable-next-line
      location.reload();
    }).catch((e) => setModalErrorMessage(e.message !== undefined ? e.message : JSON.stringify(e)));
  };

  return (<div>
    <Paper className={classes.paper}>
      <FormControl>
        <Select value={selectedCategory} onChange={handleFieldChange(setSelectedCategory)}>
          <MenuItem value={-1}>所有分类</MenuItem>
          {categories.map((value) => (<MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>))}
        </Select>
      </FormControl>
    </Paper>
    <Typography>&nbsp;</Typography>
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell><TableCell>问题</TableCell>
            <TableCell>上级分类</TableCell><TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {questions.map((row, i) => (
              <TableRow key={i}>
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell>{row.question}</TableCell>
                <TableCell>
                  {categories.length !== 0 ? categories.filter((v) => (v.id === row.category_id))[0].name : ""}
                </TableCell>
                <TableCell>
                  <Button size="small" color="primary" onClick={handleOpenAnswerModal(i)}>查看回答</Button>
                  <Button size="small" color="primary" component={RouterLink} to={"/questions/"+row.id}>同义提问</Button>
                  <Button size="small" color="secondary" onClick={handleOpenEditModal(i)}>编辑</Button>
                  <Button size="small" className={classes.textDanger}
                          onClick={handleOpenDeleteModal(i)}>删除</Button>
                </TableCell>
              </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4}>
              <Button size="small" color="primary" onClick={handleOpenNewModal}>添加问题</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>

    <Modal disableAutoFocus disableEnforceFocus open={openAnswerModal} onClose={handleCloseModal}>
      {(openAnswerModal && selectedQuestion !== -1) ? (<div className={classes.modalPaper}>
        <Typography variant="h5" component="h2">{questions[selectedQuestion].question} 的回答</Typography>
        <div>
          <ReactMarkdown source={questions[selectedQuestion].answer}/>
        </div>
      </div>) : (<Typography>Error</Typography>)}
    </Modal>

    <Modal disableAutoFocus disableEnforceFocus open={openNewModal} onClose={handleCloseModal}>
      {(openNewModal) ? (<div className={classes.modalPaper}>
        <Typography variant="h5" component="h2">添加问题</Typography>
        <div>
          <FormControl fullWidth>
            <InputLabel>分类</InputLabel>
            <Select value={editModalData.category_id}
                    onChange={handleObjectFieldChange(editModalData, setEditModalData, 'category_id')}>
              {categories.map((value) => (<MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>))}
            </Select>
          </FormControl>
          <TextField fullWidth margin="normal" label="问题"
                     value={editModalData.question}
                     onChange={handleObjectFieldChange(editModalData, setEditModalData, 'question')}/>
          <TextField fullWidth multiline margin="normal" label="回答"
                     value={editModalData.answer}
                     onChange={handleObjectFieldChange(editModalData, setEditModalData, 'answer')}/>
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
      {(openEditModal && selectedQuestion !== -1) ? (<div className={classes.modalPaper}>
        <Typography variant="h5" component="h2">编辑 {questions[selectedQuestion].question}</Typography>
        <div>
          <FormControl fullWidth>
            <InputLabel>分类</InputLabel>
            <Select value={editModalData.category_id}
                    onChange={handleObjectFieldChange(editModalData, setEditModalData, 'category_id')}>
              {categories.map((value) => (<MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>))}
            </Select>
          </FormControl>
          <TextField fullWidth margin="normal" label="问题"
                     value={editModalData.question}
                     onChange={handleObjectFieldChange(editModalData, setEditModalData, 'question')}/>
          <TextField fullWidth multiline margin="normal" label="回答"
                     value={editModalData.answer}
                     onChange={handleObjectFieldChange(editModalData, setEditModalData, 'answer')}/>
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
        {selectedQuestion !== -1 ? (<div>
          <Typography variant="h5" component="h2">删除 {questions[selectedQuestion].question}</Typography>
          <Typography>请确认你是否真的要删除问题 {questions[selectedQuestion].question} ？此操作不可撤销。</Typography>
          <Typography variant="body2">有其他提问方式等情况会导致删除失败。</Typography>
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