import {Link, Typography} from "@material-ui/core";
import React from "react";

export default function Copyright() {
  return (
      <Typography variant="body2" color="textSecondary">
        &copy; {" "}
        <Link href="https://www.nwafu.edu.cn/">西北农林科技大学</Link>
        <Link href="https://nic.nwafu.edu.cn/">网络与教育技术中心</Link>
        {" "}
        {new Date().getFullYear()} 保留所有权利.<br/>
        <small>由
          <Link color="inherit" href="https://www.ipv6.edu.cn/">赛尔网络下一代互联网技术创新项目</Link>
          NGII20180616资助
        </small>
      </Typography>
  );
}