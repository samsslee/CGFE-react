import { Button, Card, Row, Col, CardBody, Input } from "reactstrap";
import { useState } from "react";

const Collapsible =({label, children})=>{
    const [open, setOPen] = useState(true);

    const toggle = () => {
        setOPen(!open);
      };

    return (
        <Card>
            <CardBody>
                <Row>
                    <Col className="pl-3" md="10">
                        <h4>{label}</h4>
                    </Col>
                    <Col className="pr-3 d-flex justify-content-end" md="2">
                        <Button outline
                        onClick={toggle}
                        color="Secondary"
                        >
                        <i className={`nc-icon ${open ? 'nc-minimal-up' : 'nc-minimal-down'}`} />
                        </Button>
                    </Col>
                </Row>
                {open && <div>
                    {children}
                    </div>}
            </CardBody>
        
      </Card>
    );
}
export default Collapsible;