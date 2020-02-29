import * as React from "react";
import { firebase } from "./";
import { FirebaseContext } from "./context";

interface InterfaceProps {
  authUser?: any;
}

interface InterfaceState {
  authUser?: any;
}

export const withAuthentication = (Component: any) => {
  class WithAuthentication extends React.Component<
    InterfaceProps,
    InterfaceState
  > {
    constructor(props: any) {
      super(props);

      this.state = {
        authUser: null
      };
    }

    public componentDidMount() {
      firebase.auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setState(() => ({ authUser }))
          : this.setState(() => ({ authUser: null }));
      });
    }

    public render() {
      const { authUser } = this.state;

      return (
        <FirebaseContext.Provider value={authUser}>
          <Component />
        </FirebaseContext.Provider>
      );
    }
  }
  return WithAuthentication;
};