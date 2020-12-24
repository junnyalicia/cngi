import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {Redirect} from "react-router";
import Typography from "@material-ui/core/Typography";
import CategoryList from "../components/CategoryList";
import Login from "../components/Login";
import Skeleton from "../components/Skeleton";
import QuestionList from "../components/QuestionList";
import QuestionAlternativeList from "../components/QuestionAlternativeList";
import RefreshIndexPage from "../components/RefreshIndexPage";

const routes = [
  {path: "/", name: "Index", component: CategoryList},
  {path: "/questions", name: "Questions", component: QuestionList},
  {path: "/questions/:id", name: "QuestionAlternatives", component: QuestionAlternativeList},
  {path: "/refreshIndex", name: "RefreshIndex", component: RefreshIndexPage},
];

export default function Router() {
  const token = sessionStorage.getItem("token");
  return (
      <BrowserRouter>
        {token !== null ? (<Skeleton>
          <Switch>
            {routes.map((item, index) => {
              return <Route key={index} path={item.path} exact render={props => (<item.component {...props} />)}/>
            })}
            <Typography>无此页面！</Typography>
          </Switch>
        </Skeleton>) : (<Switch>
          <Route exact path="/login" component={Login}/>
          <Redirect to="/login"/>
        </Switch>)}
      </BrowserRouter>
  )
}