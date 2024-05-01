import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  Form,
  Row,
  Col,
  Modal, ModalBody
} from "reactstrap";

import { useState, useEffect } from "react";
import UpdateEntry from "./UpdateEntry";
import supabase from "config/supabaseClient";

function ResumeEntry({ entry: initialEntry, onDelete }) {

    const [updateEntryModal, setModal] = useState(false);
    const toggle = () => setModal(!updateEntryModal);

    const [entry, setEntry] = useState(initialEntry);
    const [concatenatedDescriptions, setConcatenatedDescriptions] = useState('');

    useEffect(() => {
        setConcatenatedDescriptions(entry.resume_descriptions
          .map((description) => description.description)
          .join('\n')
          );
    }, [entry]);

    const handleDelete = async () =>{
        const {data, error} = await supabase
            .from('resume_entries')
            .delete()
            .eq('entry_id', entry.entry_id)
            .select()

        if(error){
            console.error(error)
        }

        if(data){
            //console.log(data)
            onDelete(entry.entry_id)
        }
    }

    const handleUpdateData = async(updatedEntry) =>{

      setEntry((prevEntry) => {
        const newEntry = {...prevEntry, ...updatedEntry};
        return newEntry;
      });
      console.log(entry)
      toggle()
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

                  <Modal size='xl' isOpen={updateEntryModal} toggle={toggle} backdrop={false}>
                        <ModalBody>
                            <UpdateEntry entry = {{
                              entryId: entry.entry_id,
                              positionTitle: entry.position_title,
                              companyName: entry.company_name,
                              startDate: entry.start_date,
                              endDate: entry.end_date,
                              resumeDescriptions: entry.resume_descriptions
                            }} onUpdate={handleUpdateData}/>
                        </ModalBody>
                    </Modal>
                </div>
              </Row>
            </Form>
          </CardBody>
        </Card>
    )
}

export default ResumeEntry