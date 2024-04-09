import React, { useState } from 'react';

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

function DescriptionLine({description_line}) {
  const [isEditing, setIsEditing] = useState(false);
  const [descriptionLine, setDescription] = useState(description_line.description);

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
  };
  const handleDeleteClick = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <div className="d-flex">
          <Input type="text" value={descriptionLine} onChange={(e) => setDescription(e.target.value)} />
          <Button color="primary" onClick={handleSaveClick} className="ml-2">Save</Button>
        </div>
      ) : (
        <div className="d-flex justify-content-between">
          <p className="mb-0 mr-2">{descriptionLine}</p>
          <div className="d-flex">
            <Button color="info" onClick={handleUpdateClick} className="mr-2">
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
