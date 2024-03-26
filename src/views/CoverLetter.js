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
  const [characteristics, setCharacteristics] = useState(["3 years of javascript experience","leadership skills"])
  const [toggleStates, setToggleStates] = useState([true, true]);
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [coverLetter, setCoverLetter] = useState('test')

  useEffect(() => {
    // Initialize toggle states when characteristics change
    setToggleStates(Array(characteristics.length).fill(true));
  }, [characteristics]);

  
  const handleSubmitAnalyze = async (e)=>{
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
    //setToggleStates(Array(characteristics.length).fill(true))
  }

  // Function to handle toggle switch change
  const handleToggleChange = (index) => {
    const newToggleStates = [...toggleStates];
    newToggleStates[index] = !newToggleStates[index];
    setToggleStates(newToggleStates);
  };

  const handleSubmitGenerate = async (e)=>{
    e.preventDefault()

    const relevantCharacteristics = characteristics.filter((char, index) => {
      return toggleStates[index];
    });

    console.log(hiringCompany, positionTitle, relevantCharacteristics, additionalInfo)

    const {data, error} = await supabase.functions.invoke('generate-cover-letter', {
      body: JSON.stringify({
        hiringCompany: hiringCompany,
        positionTitle: positionTitle,
        characteristics: relevantCharacteristics,
        additionalInfo: additionalInfo
      })
    })

    if(error){
      console.log(error)
    }
    console.log(data)
    setCoverLetter(data)

  }
  
    return (
      <>
        <div className="content">
          <Collapsible label="Job Description">
            <Form id="paste-job-description" onSubmit={handleSubmitAnalyze}>
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
                <Form id="adjust-parameters" onSubmit={handleSubmitGenerate}>
                  <FormGroup>
                  <Row>
                    <Col md='4'>
                    <label>Hiring Company</label>
                      <Input value={hiringCompany} onChange={(e) => setHiringCompany(e.target.value)}/>
                    </Col>
                    <Col md='4'>
                    <label>Position Title</label>
                      <Input value={positionTitle} onChange={(e) => setPositionTitle(e.target.value)}/>
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
                        id = "additional-info"
                        placeholder="Anything else you want the AI to know?"
                        value={additionalInfo}
                        onChange={(e) => {setAdditionalInfo(e.target.value)}}
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
              <p id="cover-letter">
                {coverLetter}
              </p>
            </CardBody>
          </Card>              
        </div>
      </>
    );
  }
  
  export default CoverLetter;