import React from "react";
import supabase from "config/supabaseClient";
import { useState } from "react";

import { Button, Card, Form, Input } from "reactstrap";
import { SupabaseClient } from "@supabase/supabase-js";

function QueryCard(){

    const [content, setContent] = useState('')

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const {data} = await supabase.functions.invoke('queries', {
            body: JSON.stringify({query: content})
        })
        console.log({data})
    }

    return (
        <Card>
            <Form onSubmit={handleSubmit}>
            <Input
                placeholder="Some Text Descriptions"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                type="text"
                />
                <Button
                className="btn-round"
                color="primary"
                type="submit"
                >
                    Query
                </Button>
            </Form>
            
        </Card>
    )
}
export default QueryCard;