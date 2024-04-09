import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "config/supabaseClient";
import DescriptionLine from "./DescriptionLine";

// reactstrap components
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function UpdateEntry({entry}) {

  const navigate = useNavigate()

  const [position_title, setPosition] = useState(entry.position_title)
  const [company_name, setCompany] = useState(entry.company_name)
  const [start_date, setStartDate] = useState(entry.start_date)
  const [end_date, setEndDate] = useState(entry.end_date)
  const [description_list, setDescription] = useState(entry.description_list)
  const [formError, setFormError] = useState(null)
  const [isEditing, setIsEditing] = useState(false);


  // useEffect(()=>{
  //   // YOU DONT NEED TO DO THE REFETCHING BUT FIX IT LATER SEE RESUMEENTRY.JS FOR MORE NOTES
  //   const fetchEntry = async()=>{

  //     const {data, error} = await supabase
  //     .from('resume_entries')
  //     .select()
  //     .eq('id', entryid)
  //     .single()
      
  //     if(error){
  //       console.log(error)
  //       //need to handle error and navivation for redirecting out of this if there is an error
  //     }
  //     if(data){
  //       setPosition(data.position_title)
  //       setCompany(data.company_name)
  //       setStartDate(data.start_date)
  //       setEndDate(data.end_date)
  //       setDescription(data.description)
  //     }
    
  //   }
  //   fetchEntry()

  // },[entryid])


  const handleSubmit = async (e)=>{
    e.preventDefault()

    // if(!position_title || !company_name || !start_date || !description){
    //   setFormError('Please fill out all the required fields')
    //   return
    // }

    // const {data, error} = await supabase
    //   .from('resume_entries')
    //   .update([{position_title, company_name, start_date, end_date, description}])
    //   .eq('id', entry.id)
    //   .select()

    // if(error){
    //   console.log(error)
    //   setFormError("there is an error with saving the data to the DB")
    // }

    // if(data){
    //   console.log(data)
    //   setFormError(null)
    //   navigate('/')
    // }

  }


  return (
      <Card className="card-user">
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col className="pr-1" md="4">
                <FormGroup>
                  <label>Position Title</label>
                  {isEditing ? (                  
                  <Input
                    placeholder="eg. Assistant to the Regional Manager"
                    value={position_title}
                    onChange={(e) => setPosition(e.target.value)}
                    type="text"
                  />):(
                    <p>{position_title}</p>
                  )}

                </FormGroup>
              </Col>
              <Col className="px-1" md="3">
                <FormGroup>
                  <label>Company Name</label>
                  {isEditing ? (
                  <Input
                    placeholder="ABC Company"
                    onChange={(e) => setCompany(e.target.value)}
                    value={company_name}
                    type="text"
                  />
                  ):(
                    <p>{company_name}</p>
                  )}
                </FormGroup>
              </Col>
              <Col className="pl-1" md="2">
                  <FormGroup>
                    <label>Start Date</label>
                    {isEditing ? (
                      <Input
                      id="startDate"
                      type="date"
                      value={start_date}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    ):(
                      <p>{start_date}</p>
                    )}
                    
                  </FormGroup>
              </Col>
              <Col className="pl-1" md="2">
                  <FormGroup>
                    <label>End Date</label>
                    {isEditing ? (
                      <Input
                      id="endDate"
                      type="date"
                      value={end_date}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    ):(
                      <p>{end_date}</p>
                    )}
                  </FormGroup>
              </Col>
              <Col className="pt-3" md="1">
                <div className="update ml-auto mr-auto">
                  {isEditing ? (
                    <Button
                    onClick={() => setIsEditing(false)}
                    className="btn-round"
                    color="primary"
                    // type="submit"
                    >
                      Save
                    </Button>
                  ):(
                    <Button color="info" onClick={()=>{setIsEditing(true)}} className="mr-2">
                    <i className="nc-icon nc-ruler-pencil" />
                  </Button>
                  )}
                </div>
              </Col>
            </Row>
            </Form>
            <Row>
              <Col md="12">
                <FormGroup>
                  <label>Description</label>
                  {description_list.map(description => (
                    <DescriptionLine
                      key = {description.description_id}
                      description_line = {description}
                      />
                  ))}
                  {/* you need an on change for the description line */}
                  {/* <Input
                    type="textarea"
                    value={description_list}
                    placeholder="Increased Revenue by 40%"
                    onChange={(e) => setDescription(e.target.value)}
                  /> */}
                </FormGroup>
              </Col>
            </Row>
            <Row>{formError && (<p>{formError}</p>)}</Row>
        </CardBody>
      </Card>
  )
}

export default UpdateEntry;