import { Button, Card, Row, Col, CardBody, Input } from "reactstrap";
import { useState } from "react";

const Collapsible =(props)=>{
    const [open, setOPen] = useState(true);

    const toggle = () => {
        setOPen(!open);
      };

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col className="pl-1" md="10">
                        <h4>{props.label}</h4>
                    </Col>
                    <Col className="pr-1 d-flex justify-content-end" md="2">
                        <Button outline
                        onClick={toggle}
                        className="btn-round"
                        color="Secondary"
                        >
                        <i className={`nc-icon ${open ? 'nc-minimal-up' : 'nc-minimal-down'}`} />
                        </Button>
                    </Col>
                </Row>
                {open && <div>
                    <Input
                        id = "job-description"
                        name="text"
                        type="textarea"
                        />
                    <Button>
                        Analyze
                    </Button>
                    </div>}
            </CardBody>
        
      </Card>
    );
}
export default Collapsible;