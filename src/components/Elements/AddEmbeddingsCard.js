import React from "react";
import supabase from "config/supabaseClient";
import { useState } from "react";
import openai from "config/openaiClient";

import { Button, Card, Form, Input } from "reactstrap";


function EmbeddingsCard(){

    const [content, setContent] = useState('')

    const handleSubmit = async (e)=>{
        e.preventDefault()
        const embeddingResponse = await openai.embeddings.create({
            input: content,
            model: "text-embedding-ada-002", // Model that creates our embeddings
        });
    
        const { embedding } = embeddingResponse.data[0]
    
        //Store the embedding and the text in our supabase DB
        const {data, error} = await supabase
            .from('testembeds')
            .insert({content, embedding})
            .select()

        if (error){  
            console.log(error)
        }
        if (data){
            //console.log(data)
        }
        setContent('')
    }


    return (
        <Card>
            <p>Enter Embeddings Here</p>
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
                    Create Embedding
                </Button>
            </Form>
        </Card>
    )
}

export default EmbeddingsCard;