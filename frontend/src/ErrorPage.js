import * as React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./App.css";

class ErrorPage extends React.Component {
  render() {
    return (
      <div className="error-page">
        <h2>
          Oops... this page doesn't appear to exist or you don't have permission
          to view it
        </h2>
        <p />
        <Link to="/">
          <Button type="primary" size={"large"}>
            Return to Landing
          </Button>
        </Link>
      </div>
    );
  }
}

export default ErrorPage;
