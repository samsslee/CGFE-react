import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  Form,
  Row,
  Col,
  Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";

import { useState, useEffect } from "react";
import UpdateEntry from "./UpdateEntry";
import supabase from "config/supabaseClient";
import { useNavigate } from "react-router-dom";


function ResumeEntry({entry, onDelete}) {
    const navigate = useNavigate()

    const [updateEntryModal, setModal] = useState(false);
    const toggle = () => setModal(!updateEntryModal);

    const [concatenatedDescriptions, setConcatenatedDescriptions] = useState('');

    useEffect(() => {

      //description_list is when it's been cleaned after we heard the response back from the db when we created
      //description embeddings collection is when it came straight from the DB
        const fetchDescriptions = async () => {
            if (entry.resume_description_embeddingsCollection && entry.resume_description_embeddingsCollection.edges) {
              let descriptions_array = []
              entry.description_list = []
              entry.resume_description_embeddingsCollection.edges.map(desc => {
                descriptions_array.push(desc.node.description)
                entry.description_list.push({description_id:desc.node.id, description: desc.node.description})
              });
              setConcatenatedDescriptions(descriptions_array.join('\n'));
            } else if (entry.description_list && !entry.resume_description_embeddingsCollection){
              let descriptions_array = entry.description_list.map(description => description.description)
              setConcatenatedDescriptions(descriptions_array.join('\n'))
            } else {
              entry.description_list = [{description_id:"", description:""}]
            }
        };

        fetchDescriptions();
    }, [entry]);


    const handleDelete = async () =>{
        const {data, error} = await supabase
            .from('resume_entries')
            .delete()
            .eq('id', entry.id)
            .select()

        if(error){
            console.error(error)
        }

        if(data){
            console.log(data)
            onDelete(entry.id)
        }
    }

    return (
        <Card className="card-user">
          <CardBody>
            <Form>
              <Row>
                <Col className="pr-1" md="4">
                    <label>Position Title</label>
                    <p>{entry.position_title}</p>
                </Col>
                <Col className="px-1" md="4">
                    <label>Company Name</label>
                    <p>{entry.company_name}</p>
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
                    <p>{concatenatedDescriptions}</p>
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

                  <Modal size='xl' isOpen={updateEntryModal} toggle={toggle}>
                        <ModalHeader toggle={toggle}>Update This Entry</ModalHeader>
                        <ModalBody>
                            <UpdateEntry entry = {{
                              id: entry.id,
                              position_title: entry.position_title,
                              company_name: entry.company_name,
                              start_date: entry.start_date,
                              end_date: entry.end_date,
                              description_list: entry.description_list
                            }}/>
                        </ModalBody>
                        <ModalFooter>
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