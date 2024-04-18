import React, { useState } from 'react';
import supabase from 'config/supabaseClient';

import {Button,Input} from "reactstrap";

function DescriptionLine({entryId, descriptionWidSingle, onDelete, onUpdate}) {
  const [isEditing, setIsEditing] = useState(false);
  const [descriptionSingle, setDescriptionSingle] = useState(descriptionWidSingle.description);

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  //RLS
  const handleSaveClick = async () => {
    setIsEditing(false);
    const {data, error} = await supabase.functions.invoke('create-update-description', {
      body: JSON.stringify({
        description: descriptionSingle,
        resumeEntryId: entryId, //this is for RLS, probably
        descriptionId: descriptionWidSingle.description_id
      })
    })

    if(error){console.error(error)}
    //if(data){console.log(data)}
    onUpdate(descriptionWidSingle.description_id, descriptionSingle)
  };
  const handleDeleteClick = async () => {
    setIsEditing(false);
    const { error } = await supabase
      .from('resume_description_embeddings')
      .delete()
      .eq('id', descriptionWidSingle.description_id)
    
    if(error){
      console.error(error)
    }
    onDelete(descriptionWidSingle.description_id)
  };

  const handleCancelClick = () => {
    setDescriptionSingle(descriptionWidSingle.description)
    setIsEditing(false)
  }

  return (
    <div>
      {isEditing ? (
        <div className="d-flex">
          <Input type="text" value={descriptionSingle} onChange={(e) => setDescriptionSingle(e.target.value)} />
          <Button color="secondary" onClick={handleCancelClick} className="ml-2">
            <i className="nc-icon nc-refresh-69" />
          </Button>
          <Button color="primary" onClick={handleSaveClick} className="ml-2">
            <i className="nc-icon nc-check-2" />
          </Button>
        </div>
      ) : (
        <div className="d-flex justify-content-between">
          <p className="mb-0 mr-2">{descriptionSingle}</p>
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
