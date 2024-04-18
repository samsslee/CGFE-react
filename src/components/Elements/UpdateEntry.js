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


  const [positionTitle, setPositionTitle] = useState(entry.positionTitle)
  const [companyName, setCompanyName] = useState(entry.companyName)
  const [startDate, setStartDate] = useState(entry.startDate)
  const [endDate, setEndDate] = useState(entry.endDate)
  const [descriptionWids, setDescriptionList] = useState(entry.descriptionWids)
  const [newDescription, setNewDescription] = useState("")
  const [formError, setFormError] = useState(null) //make this function!
  const [isEditing, setIsEditing] = useState(false);
  const [buttonsDisabled, setButtonsDisabled] = useState(false)

  //Update Entry: add another description line to the the entry
  const addNewDescription = async ()=>{
    if(newDescription == ""){
      return
    }
    setButtonsDisabled(true)
    const {data, error} = await supabase.functions.invoke('create-update-description', {
      body: JSON.stringify({
        description: newDescription,
        resumeEntryId: entry.id,
        descriptionId: null
      })
    })
    if (error){ console.error(error)}
    if (data){
      const addedDescription = {description_id: data.data.id, description: data.data.description}
      //underscore description_id to match database format
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
      position_title: positionTitle,
      company_name: companyName,
      start_date: startDate,
      end_date: endDate
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
      companyName: companyName,
      positionTitle: positionTitle,
      startDate:startDate,
      endDate:endDate,
      descriptionWids: descriptionWids})
  }
  
  const handleResetEditing = () => {
    setPositionTitle(entry.positionTitle)
    setCompanyName(entry.companyName)
    setStartDate(entry.startDate)
    setEndDate(entry.endDate)
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
                    value={positionTitle}
                    onChange={(e) => setPositionTitle(e.target.value)}
                    type="text"
                  />):(
                    <p>{positionTitle}</p>
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
                    value={companyName}
                    type="text"
                  />
                  ):(
                    <p>{companyName}</p>
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
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    ):(
                      <p>{startDate}</p>
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
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    ):(
                      <p>{endDate}</p>
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
                  {descriptionWids.map(desc => (
                    <DescriptionLine
                      key = {desc.description_id}
                      entryId = {entry.id}
                      descriptionWidSingle = {desc} //includes key and description
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
                    value={newDescription}
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