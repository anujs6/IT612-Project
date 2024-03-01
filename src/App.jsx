import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ApiCalendar from "react-google-calendar-api";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
  Container,
  Jumbotron,
} from "reactstrap";

const config = {
  clientId: "<CLIENT_ID>",
  apiKey: "AIzaSyDlNlDnL8Hq8vozPbFrp9V8dH0ueRNsJcA",
  scope: "https://www.googleapis.com/auth/calendar",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
};

const apiCalendar = new ApiCalendar(config);

function App() {
  return (
    <Container>
      <Jumbotron>
        <h1>Task Scheduler</h1>
        <Row>
          <Col></Col>
        </Row>
      </Jumbotron>
    </Container>
  );
}

export default App;
