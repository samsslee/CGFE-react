import React from "react";
import { useState } from "react";
import supabase from "config/supabaseClient";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function AddEntry({onCreate}) {

  const [positionTitle, setPositionTitle] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [descriptionBox, setDescription] = useState('')
  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e)=>{
    e.preventDefault() //consider not using a form submit

    if(!positionTitle || !companyName || !startDate || !descriptionBox ||!endDate){
      setFormError('Please fill out all the required fields')
      return
    }
    
    const {data, error} = await supabase.functions.invoke('create-entry', {
      body: JSON.stringify({
        positionTitle: positionTitle,
        companyName: companyName,
        startDate: startDate,
        endDate: endDate,
        description: descriptionBox,
      })
    })

    //console.log(data.data, error, data.error)

    if(error){
      console.error(error)
      setFormError("there is an error with saving the data to the DB")
    }
    //need to deal with whether or not this error logging works.

    if(data.data){ //these are underscores because they will match the DB data
      let newEntry = {
        id: data.data.id, 
        position_title: data.data.position_title,
        company_name: data.data.company_name,
        start_date: data.data.start_date,
        end_date: data.data.end_date,
        descriptionWids: data.data.descriptions
      }

      setFormError(null)
      onCreate(newEntry)
      resetForm()
    }

  }

  const resetForm = () =>{
    setPositionTitle('')
    setCompanyName('')
    setStartDate('')
    setEndDate('')
    setDescription('')
  }


  return (
      <Card className="card-user">
        <CardHeader>
          <CardTitle tag="h5">Add Another Entry</CardTitle>
        </CardHeader>

        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col className="pr-1" md="4">
                <FormGroup>
                  <label>Position Title</label>
                  <Input
                    placeholder="eg. Assistant to the Regional Manager"
                    value={positionTitle}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    type="text"
                  />
                </FormGroup>
              </Col>
              <Col className="px-1" md="4">
                <FormGroup>
                  <label>Company Name</label>
                  <Input
                    placeholder="ABC Company name"
                    onChange={(e) => setCompanyName(e.target.value)}
                    value={companyName}
                    type="text"
                  />
                </FormGroup>
              </Col>
              <Col className="pl-1" md="2">
                  <FormGroup>
                    <label>Start Date</label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </FormGroup>
              </Col>
              <Col className="pl-1" md="2">
                  <FormGroup>
                    <label>End Date</label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label>Description</label>
                  <Input
                    type="textarea"
                    value={descriptionBox}
                    placeholder="Increased Revenue by 40%"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <div className="update ml-auto mr-auto">
                <Button
                  className="btn-round"
                  color="primary"
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </Row>
            <Row>{formError && (<p>{formError}</p>)}</Row>

          </Form>
        </CardBody>
      </Card>
  )
}

export default AddEntry;