// Load Firebase as soon as possible.
import firebase from "./firebase";

import * as React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Dashboard from "./dashboard/Dashboard";
import ErrorPage from "./ErrorPage";
import Header from "./header/Header";
import Landing from "./landing/Landing";
import { Kanban } from "./pages/Kanban";
import { Tree } from "./pages/Tree";
import Chatbot from "./chatbot/Chatbot";
import * as routes from "./constants/routes";

import "./App.css";

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

// Allows props to be passed via <Routes>
const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest);
      }}
    />
  );
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
      avatar: null,
      displayName: null
    };
    this.observeAuthChange();
  }

  observeAuthChange() {
    firebase.onAuthStateChanged(authUser => {
      this.setState({
        authUser,
        displayName: firebase.getDisplayName(),
        avatar: firebase.getAvatar()
      });
    });
  }

  render() {
    return (
      <Router>
        <Switch>
          <PropsRoute
            exact
            path="/"
            component={Landing}
            authUser={this.state.authUser}
            displayName={this.state.displayName}
          />
          <Route path="/*">
            <Header
              authUser={this.state.authUser}
              displayName={this.state.displayName}
            ></Header>
            <Switch>
              <PropsRoute
                path="/dashboard"
                component={Dashboard}
                authUser={this.state.authUser}
              ></PropsRoute>
              <PropsRoute
                exact={true}
                path={routes.KANBAN + "/:parentID"}
                component={Kanban}
                authUser={this.state.authUser}
              />
              <PropsRoute
                exact={true}
                path={routes.TREE + "/:parentID"}
                component={Tree}
                authUser={this.state.authUser}
              />
              <Route
                path="*"
                component={ErrorPage}
                authUser={this.state.authUser}
              ></Route>
            </Switch>
            <Chatbot />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
