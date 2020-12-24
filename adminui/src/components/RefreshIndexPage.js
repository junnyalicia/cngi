import React from "react";
import {useStyles} from "./common/styles";
import {Button, Paper, Typography} from "@material-ui/core";
import axiosInstance from "./common/AxiosInstance";


export default function RefreshIndexPage() {
  const classes = useStyles();
  const [requestState, setRequestState] = React.useState(0);
  const [message, setMessage] = React.useState("");

  const handleRefresh = () => {
    setRequestState(1);
    axiosInstance.get('/admin/reconstruct-es-index').then((resp) => {
      setRequestState(2);
      setMessage(resp.data.message);
    }).catch((error) => {
      setRequestState(3);
      if (error.response) {
        setMessage(`Server responded with ${error.response.status}: ` + JSON.stringify(error.response.data))
      } else if (error.request) {
        setMessage('Request made but no response received: ' + JSON.stringify(error.request))
      } else {
        console.log('Something happened in setting up the request that triggered an Error: ', error.message);
      }
    });
  }

  return (<div>
    <Paper className={classes.paper}>
      <Typography component="p">修改分类和问题后，需要刷新索引才能生效。</Typography>
      <Typography component="p">请在修改数据后尽快刷新索引。索引与数据库不一致可能导致用户使用时出现错误。</Typography>
      <Typography component="p">该操作会消耗较多时间。</Typography>
      <Typography component="p">
        <Button variant="contained" color="primary" onClick={handleRefresh}>刷新索引</Button>
      </Typography>
      {requestState === 0 ? "" : (
          requestState === 1 ? (
              <Paper className={classes.infoPaper}>
                <Typography>请求中，请稍等……</Typography>
              </Paper>
          ) : (
              requestState === 2 ? (
                  <Paper className={classes.successPaper}>
                    <Typography>{message}</Typography>
                  </Paper>
              ) : (
                  <Paper className={classes.errorsPaper}>
                    <Typography>{message}</Typography>
                  </Paper>
              )
          )
      )}
    </Paper>
  </div>);
}