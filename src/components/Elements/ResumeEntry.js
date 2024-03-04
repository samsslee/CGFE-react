import React from "react";

// reactstrap components
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
  Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";

import { useState } from "react";
import UpdateEntry from "./UpdateEntry";
import supabase from "config/supabaseClient";
import { useNavigate } from "react-router-dom";


function ResumeEntry({entry}) {
    const navigate = useNavigate()

    const [updateEntryModal, setModal] = useState(false);
    const toggle = () => setModal(!updateEntryModal);

    const handleDelete = async () =>{
        const {data, error} = await supabase
            .from('resume_entries')
            .delete()
            .eq('id', entry.id)
            .select()

        if(error){
            console.log(error)
        }

        if(data){
            console.log(data)
            navigate('/')
        }
    }

    return (
        <Card className="card-user">
          <CardBody>
            <Form>
              <Row>
                <Col className="pr-1" md="4">
                    <label>Position Title</label>
                    <p>{entry.position}</p>
                </Col>
                <Col className="px-1" md="4">
                    <label>Company Name</label>
                    <p>{entry.company}</p>
                </Col>
                <Col className="pl-1" md="2">
                      <label>Start Date</label>
                      <p>{entry.start_date}</p>
                </Col>
                <Col className="pl-1" md="2">
                      <label>End Date</label>
                      <p>{entry.end_date}</p>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                    <label>Description</label>
                    <p>{entry.description}</p>
                </Col>
              </Row>
              <Row>
                <div className="update ml-auto mr-auto">
                  <Button
                    className="btn-round"
                    color="primary"
                    onClick={toggle}
                  >
                    <i className="nc-icon nc-ruler-pencil" /> Edit
                  </Button>

                  <Button
                    className="btn-round"
                    color="primary"
                    onClick={handleDelete}
                  >
                    <i className="nc-icon nc-simple-remove" /> Delete
                  </Button>

                  <Modal size='xl' isOpen={updateEntryModal} toggle={toggle} {...entry}>
                        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                        <ModalBody>
                            <UpdateEntry entryid = {entry.id}/>
                            {/* MAKE THIS PASS THROUGH EVERYTHING SO YOU DONT HAVE TO REFETCH */}
                        </ModalBody>
                        <ModalFooter>
                        <Button color="primary" onClick={toggle}>
                            Do Something
                        </Button>{' '}
                        <Button color="secondary" onClick={toggle}>
                            Cancel
                        </Button>
                        </ModalFooter>
                    </Modal>
                </div>
              </Row>
            </Form>
          </CardBody>
        </Card>
    )
}

export default ResumeEntry