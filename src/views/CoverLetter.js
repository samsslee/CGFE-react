import React from "react";
import supabase from "config/supabaseClient";
import { useState, useEffect } from "react";

import { Input, Button, Form, Card, Row, Col, CardBody, FormGroup } from "reactstrap";

import Collapsible from "components/Wrappers/Collapsible";
import Switch from "react-switch";

function CoverLetter() {

  const [jobDescription, setJobDescription] = useState('')
  const [hiringCompany, setHiringCompany] = useState('')
  const [positionTitle, setPositionTitle] = useState('')
  const [characteristics, setCharacteristics] = useState(["sample skill a","sample skill b"])
  const [toggleStates, setToggleStates] = useState([]);

  useEffect(() => {
    // Initialize toggle states when characteristics change
    setToggleStates(Array(characteristics.length).fill(true));
  }, [characteristics]);

  
  const handleSubmit = async (e)=>{
    e.preventDefault()
    const {data, error} = await supabase.functions.invoke('job-desc-analysis', {
        body: JSON.stringify({query: jobDescription})
    })
    if(error){
      console.log(error)
    }
    console.log(data)
    console.log(data.Skills_and_Key_Characteristics_of_Candidate)
    setHiringCompany(data.Company_Name)
    setPositionTitle(data.Job_Title)
    setCharacteristics(data.Skills_and_Key_Characteristics_of_Candidate)
    setToggleStates(Array(characteristics.length).fill(true))
  }


  // Function to handle toggle switch change
  const handleToggleChange = (index) => {
    const newToggleStates = [...toggleStates];
    newToggleStates[index] = !newToggleStates[index];
    setToggleStates(newToggleStates);
  };
  
    return (
      <>
        <div className="content">
          <Collapsible label="Job Description">
            <Form onSubmit={handleSubmit}>
            <Input
                  id = "job-description"
                  placeholder="Paste Job Description"
                  onChange={(e) => setJobDescription(e.target.value)}
                  value={jobDescription}
                  type="textarea"
                  style={{ 
                    minHeight: "200px",
                    padding: "10px"
                  }}
                  />
              <Button
                className="btn-round"
                color="primary"
                type="submit">
                  Analyze
              </Button>
            </Form>
          </Collapsible>
          <Collapsible label="Adjust Parameters">
                <Form>
                  <FormGroup>
                  <Row>
                    <Col md='4'>
                    <label>Hiring Company</label>
                      <Input defaultValue={hiringCompany}/>
                    </Col>
                    <Col md='4'>
                    <label>Position Title</label>
                      <Input defaultValue={positionTitle}/>
                    </Col>
                  </Row>
                  </FormGroup>
                  <FormGroup>
                  <Row>
                    {characteristics.map((characteristic, index) => (
                      <Col key={index} md={{ size: 6, offset: 3 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p>{characteristic}</p>
                        <Switch
                          checked={toggleStates[index]}
                          onChange={() => handleToggleChange(index)}
                        />
                        </div>
                      </Col>

                    ))}
                  </Row>
                  </FormGroup>
                  <FormGroup>
                    <Row>
                    <Col md='12'>
                      <Input
                        id = "final-notes"
                        placeholder="Anything else you want the AI to know?"
                        type="textarea"
                        style={{ 
                          minHeight: "100px",
                          padding: "10px"
                        }}
                      />
                    </Col>
                  </Row>
                  </FormGroup>
                  
                  <Button>
                      Generate
                  </Button>
                </Form>
          </Collapsible>
          <Card>
            <CardBody>
              <h4>Cover Letter</h4>
              <p>here is the cover letter!</p>
            </CardBody>
          </Card>              
        </div>
      </>
    );
  }
  
  export default CoverLetter;