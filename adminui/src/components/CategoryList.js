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
  Typography,
} from "@material-ui/core";
import {useStyles} from "./common/styles";


export default function CategoryList() {
  const classes = useStyles();
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState(-1);
  const [openNewModal, setOpenNewModal] = React.useState(false);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [editModalCatName, setEditModalCatName] = React.useState(null);
  const [editModalParentCat, setEditModalParentCat] = React.useState(null);
  const [modalErrorMessage, setModalErrorMessage] = React.useState(null);

  const handleCloseNewModal = () => {
    setModalErrorMessage(null);
    setOpenNewModal(false);
  };
  const handleOpenEditModal = (index) => () => {
    setSelectedCategory(index);
    setEditModalCatName(categories[index].name);
    setEditModalParentCat(categories[index].parent !== null ? categories[index].parent : -1);
    setModalErrorMessage(null);
    setOpenEditModal(true);
  };
  const handleCloseEditModal = () => {
    setSelectedCategory(-1);
    setEditModalCatName(null);
    setEditModalParentCat(null);
    setModalErrorMessage(null);
    setOpenEditModal(false);
  };
  const handleOpenDeleteModal = (index) => () => {
    setSelectedCategory(index);
    setModalErrorMessage(null);
    setOpenDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setSelectedCategory(-1);
    setModalErrorMessage(null);
    setOpenDeleteModal(false);
  };
  const handleFieldChange = (f) => (e) => f(e.target.value);

  const handleNewModal = () => {
    axiosInstance.put('/categories/', {
      name: editModalCatName,
      parent: editModalParentCat !== -1 ? editModalParentCat : null,
    }).then(() => {
      // eslint-disable-next-line
      location.reload();
    }).catch((e) => setModalErrorMessage(e.message !== undefined ? e.message : JSON.stringify(e)));
  };
  const handleEditModal = () => {
    axiosInstance.post('/categories/' + categories[selectedCategory].id, {
      name: editModalCatName,
      parent: editModalParentCat !== -1 ? editModalParentCat : null,
    }).then(() => {
      // eslint-disable-next-line
      location.reload();
    }).catch((e) => setModalErrorMessage(e.message !== undefined ? e.message : JSON.stringify(e)));
  };
  const handleDeleteModal = () => {
    axiosInstance.delete('/categories/' + categories[selectedCategory].id).then(() => {
      // eslint-disable-next-line
      location.reload();
    }).catch((e) => setModalErrorMessage(JSON.stringify(e.message)));
  };

  React.useEffect(() => {
    axiosInstance.get('/categories/').then(resp => setCategories(resp.data.data))
  }, []);

  return (<div>
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>名称</TableCell>
            <TableCell>上级分类</TableCell>
            <TableCell>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.parent ? (categories.filter((v) => (v.id === row.parent))[0].name) : "Root"}</TableCell>
                <TableCell>
                  <Button size="small" color="primary" onClick={handleOpenEditModal(index)}>
                    编辑
                  </Button>
                  <Button size="small" onClick={handleOpenDeleteModal(index)}>
                    <span className={classes.textDanger}>删除</span>
                  </Button>
                </TableCell>
              </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={4}>
              <Button size="small" color="primary" onClick={() => setOpenNewModal(true)}>添加分类</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>

    <Modal disableAutoFocus disableEnforceFocus open={openNewModal} onClose={handleCloseNewModal}>
      <div className={classes.modalPaper}>
        <Typography variant="h5" component="h2">添加分类</Typography>
        <div>
          <TextField fullWidth margin="normal" label="分类名称"
                     value={editModalCatName} onChange={handleFieldChange(setEditModalCatName)}/>
          <FormControl fullWidth>
            <InputLabel id="newModalParentCategoryLabel">上级分类</InputLabel>
            <Select labelId="newModalParentCategoryLabel" id="newModalParentCategory"
                    value={editModalParentCat} onChange={handleFieldChange(setEditModalParentCat)}>
              <MenuItem value={-1}>Root</MenuItem>
              {categories.map((value) => (<MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <Button variant="contained" color="primary" onClick={handleNewModal}>
              提交
            </Button>
          </FormControl>
        </div>
        {modalErrorMessage !== null ? (
            <Paper className={classes.errorsPaper}><Typography>{modalErrorMessage}</Typography></Paper>
        ) : null}
      </div>
    </Modal>

    <Modal disableAutoFocus disableEnforceFocus open={openEditModal} onClose={handleCloseEditModal}>
      <div className={classes.modalPaper}>
        {selectedCategory !== -1 ? (<div>
          <Typography variant="h5" component="h2">编辑分类 {categories[selectedCategory].name}</Typography>
          <div>
            <TextField fullWidth margin="normal" label="分类名称"
                       value={editModalCatName} onChange={handleFieldChange(setEditModalCatName)}/>
            <FormControl fullWidth>
              <InputLabel id="editModalParentCategoryLabel">上级分类</InputLabel>
              <Select labelId="editModalParentCategoryLabel" id="editModalParentCategory"
                      value={editModalParentCat} onChange={handleFieldChange(setEditModalParentCat)}>
                <MenuItem value={-1}>Root</MenuItem>
                {categories.filter(v => v.id !== categories[selectedCategory].id).map((value) => (
                    <MenuItem key={value.id} value={value.id}>{value.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Button variant="contained" color="primary" onClick={handleEditModal}>
                提交修改
              </Button>
            </FormControl>
          </div>
          {modalErrorMessage !== null ? (
              <Paper className={classes.errorsPaper}>
                <Typography>{modalErrorMessage}</Typography>
              </Paper>
          ) : null}
        </div>) : (<Typography>Error!</Typography>)}
      </div>
    </Modal>

    <Modal disableAutoFocus disableEnforceFocus open={openDeleteModal} onClose={handleCloseDeleteModal}>
      <div className={classes.modalPaper}>
        {selectedCategory !== -1 ? (<div>
          <Typography variant="h5" component="h2">删除 {categories[selectedCategory].name}</Typography>
          <Typography>请确认你是否真的要删除分类 {categories[selectedCategory].name} ？此操作不可撤销。</Typography>
          <Typography variant="body2">有子分类、分类下有问题等情况会导致删除失败。</Typography>
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
        </div>) : (<Typography>Error!</Typography>)}
      </div>
    </Modal>
  </div>);
}