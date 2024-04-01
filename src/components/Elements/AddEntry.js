import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "config/supabaseClient";

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
} from "reactstrap";

function AddEntry() {

  const navigate = useNavigate()

  const [position_title, setPositionTitle] = useState('')
  const [company_name, setCompanyName] = useState('')
  const [start_date, setStartDate] = useState('')
  const [end_date, setEndDate] = useState('')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e)=>{
    e.preventDefault()

    if(!position_title || !company_name || !start_date || !description){
      setFormError('Please fill out all the required fields')
      return
    }
    
    const {data, error} = await supabase.functions.invoke('create-update-embed', {
      body: JSON.stringify({
        position_title: position_title,
        company_name: company_name,
        start_date: start_date,
        end_date: end_date,
        description: description,
        embed_description:true,
        resume_entry_id:null
      })
    })

    if(error){
      console.log(error)
      setFormError("there is an error with saving the data to the DB")
    }

    if(data){
      console.log(data)
      setFormError(null)
      navigate('/')
    }

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
                    value={position_title}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    type="text"
                  />
                </FormGroup>
              </Col>
              <Col className="px-1" md="4">
                <FormGroup>
                  <label>Company Name</label>
                  <Input
                    placeholder="ABC Company_name"
                    onChange={(e) => setCompanyName(e.target.value)}
                    value={company_name}
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
                      value={start_date}
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
                      value={end_date}
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
                    value={description}
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