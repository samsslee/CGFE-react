import React from "react";
import { useState } from "react";
import supabase from "config/supabaseClient";
import DescriptionLine from "./DescriptionLine";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  CardFooter,
} from "reactstrap";

function UpdateEntry({entry, onUpdate}) {


  const [position_title, setPositionTitle] = useState(entry.position_title)
  const [company_name, setCompanyName] = useState(entry.company_name)
  const [start_date, setStartDate] = useState(entry.start_date)
  const [end_date, setEndDate] = useState(entry.end_date)
  const [description_list, setDescriptionList] = useState(entry.description_list)
  const [new_description, setNewDescription] = useState("")
  const [formError, setFormError] = useState(null) //make this function!
  const [isEditing, setIsEditing] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false)

  const addNewDescription = async ()=>{
    if(new_description == ""){
      return
    }
    setButtonsDisabled(true)
    const {data, error} = await supabase.functions.invoke('create-update-description', {
      body: JSON.stringify({
        description: new_description,
        resume_entry_id: entry.id,
        description_id: null
      })
    })
    if (error){ console.error(error)}
    if (data){
      const addedDescription = {description_id: data.data.id, description: data.data.description}
      handleNewDescription(addedDescription)
      setNewDescription("")
    }
    setButtonsDisabled(false)
  }

  const handleNewDescription = (desc) =>{
    setDescriptionList(prev => {
      if (!prev) {
        return [desc]
      } else {
        return [...prev, desc];
      }
    });
  }

  const handleEditEntry = async () => {
    setIsEditing(true)
    setButtonsDisabled(true)
  }

  const handleSaveEntry = async () => {
    setButtonsDisabled(true)
    const { data, error } = await supabase
    .from('resume_entries')
    .update({
      position_title: position_title,
      company_name: company_name,
      start_date: start_date,
      end_date: end_date
    })
    .eq('id', entry.id)
    .select()
    if (error){ //do error handling
      console.error(error)
    }
    // if (data){
    //   console.log(data)
    // }
    setIsEditing(false)
    setButtonsDisabled(false)

  }

  const handleDeleteDescription = (id) =>{
    setDescriptionList(prev => {
      return prev.filter(desc => desc.description_id != id)
    });
  }

  const handleUpdateDescription = (id, newDescription) => {
    setDescriptionList(prev => {
      return prev.map(desc => {
        if (desc.description_id === id) {
          return { ...desc, description: newDescription };
        }
        return desc;
      });
    });
  };

  const handleUpdateFinished = () => {
    onUpdate({
      company_name: company_name,
      position_title: position_title,
      start_date:start_date,
      end_date:end_date,
      description_list: description_list})
  }
  
  const handleResetEditing = () => {
    setPositionTitle(entry.position_title)
    setCompanyName(entry.company_name)
    setStartDate(entry.start_date)
    setEndDate(entry.end_date)
    setIsEditing(false)
    setButtonsDisabled(false)
  }

  return (
      <Card className="card-user">
        <CardHeader> <CardTitle tag="h3">Update This Entry</CardTitle> </CardHeader>
        <CardBody>
          <Form>
            <Row>
              <Col className="pr-1" md="3">
                <FormGroup>
                  <label>Position Title</label>
                  {isEditing ? (                  
                  <Input
                    placeholder="eg. Assistant to the Regional Manager"
                    value={position_title}
                    onChange={(e) => setPositionTitle(e.target.value)}
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
                    onChange={(e) => setCompanyName(e.target.value)}
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
              <Col className="pt-3" md="2">
                <div className="update ml-auto mr-auto">
                  {isEditing ? (
                    <div>
                    <Button
                    onClick={() => handleSaveEntry()}
                    color="primary"
                    >
                      <i className="nc-icon nc-check-2" />
                    </Button>
                    <Button color="secondary" onClick={() => {handleResetEditing()}} className="mr-2">
                      <i className="nc-icon nc-refresh-69" />
                    </Button>
                    </div>
                  ):(
                    <Button color="primary" onClick={()=>{handleEditEntry()}} className="mr-2">
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
                  {description_list.map(desc => (
                    <DescriptionLine
                      key = {desc.description_id}
                      entry_id = {entry.id}
                      description_line = {desc} //includes key and description
                      onDelete = {handleDeleteDescription}
                      onUpdate = {handleUpdateDescription}
                      />
                  ))}
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md="10">
                <FormGroup>
                  <Input
                    placeholder="Add another description bullet"
                    onChange={(e) => setNewDescription(e.target.value)}
                    value={new_description}
                    type="text"
                  />
                </FormGroup>
              </Col>
              <Col md="2" className="d-flex justify-content-end">
                <div className="d-flex">
                  <Button color="primary" onClick={() => {addNewDescription()}}>
                    <i className="nc-icon nc-simple-add" />
                  </Button>
                  <Button color="secondary" onClick={()=>setNewDescription("")}>
                    <i className="nc-icon nc-refresh-69" />
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>{formError && (<p>{formError}</p>)}</Row>
            <CardFooter>
              <Row className="justify-content-center">
                <Button color="secondary" disabled ={buttonsDisabled} onClick = {() => handleUpdateFinished()}> Finish </Button>
              </Row>
            </CardFooter>
        </CardBody>
      </Card>
  )
}

export default UpdateEntry;