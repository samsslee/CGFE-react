import React, { useState } from 'react';
import supabase from 'config/supabaseClient';

import {Button,Input} from "reactstrap";

function DescriptionLine({entry_id, description_line, onDelete, onUpdate}) {
  const [isEditing, setIsEditing] = useState(false);
  const [descriptionLine, setDescription] = useState(description_line.description);

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  //RLS
  const handleSaveClick = async () => {
    setIsEditing(false);
    const {data, error} = await supabase.functions.invoke('create-update-description', {
      body: JSON.stringify({
        description: descriptionLine,
        resume_entry_id: entry_id, //this is for RLS
        description_id: description_line.description_id
      })
    })

    if(error){console.error(error)}
    //if(data){console.log(data)}
    onUpdate(description_line.description_id, descriptionLine)
  };
  const handleDeleteClick = async () => {
    setIsEditing(false);
    const { error } = await supabase
      .from('resume_description_embeddings')
      .delete()
      .eq('id', description_line.description_id)
    
    if(error){
      console.error(error)
    }
    onDelete(description_line.description_id)
  };

  const handleCancelClick = () => {
    setDescription(description_line.description)
    setIsEditing(false)
  }

  return (
    <div>
      {isEditing ? (
        <div className="d-flex">
          <Input type="text" value={descriptionLine} onChange={(e) => setDescription(e.target.value)} />
          <Button color="primary" onClick={handleSaveClick} className="ml-2">
            <i className="nc-icon nc-check-2" />
          </Button>
          <Button color="secondary" onClick={handleCancelClick} className="ml-2">
            <i className="nc-icon nc-refresh-69" />
          </Button>
        </div>
      ) : (
        <div className="d-flex justify-content-between">
          <p className="mb-0 mr-2">{descriptionLine}</p>
          <div className="d-flex">
            <Button color="primary" onClick={handleUpdateClick} className="mr-2">
              <i className="nc-icon nc-ruler-pencil" />
            </Button>
            <Button color="danger" onClick={handleDeleteClick}>
              <i className="nc-icon nc-simple-remove" />
            </Button>
            </div>
        </div>
      )}
    </div>
  );
}

export default DescriptionLine;
