import * as React from "react";
import { withRouter } from "react-router-dom";
import * as routes from "../../constants/routes";
import { firebase } from "./";
import { FirebaseContext } from "./context";

interface InterfaceProps {
  history?: any;
}

export const withAuthorization = (condition: any) => (Component: any) => {
  class WithAuthorization extends React.Component<InterfaceProps, {}> {
    public componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.history.push(routes.SIGN_IN);
        }
      });
    }

    public render() {
      return (
        <FirebaseContext.Consumer>
          {authUser => (authUser ? <Component /> : null)}
        </FirebaseContext.Consumer>
      );
    }
  }

  return withRouter(WithAuthorization as any);
};