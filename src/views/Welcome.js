import React from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function WelcomePage() {
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h2">Welcome to CoverGen!</CardTitle>
              </CardHeader>
              <CardBody>
                <p>Current Development Phase: Pre-Alpha</p>
                <p>Upcoming features:</p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Save Cover Letter</CardTitle>
              </CardHeader>
              <CardBody>
                <p>Use storage to save cover letters that user has made</p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle tag="h5">AI Resume Visibility</CardTitle>
              </CardHeader>
              <CardBody>
                <p>Choose which entries you want the AI to include when building your resume</p>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default WelcomePage;