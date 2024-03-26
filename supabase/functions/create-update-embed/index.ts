// @ts-nocheck
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts' 
import { openai } from '../_shared/openai.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabase } from '../_shared/supabase.ts'

serve(async (req: { method: string; json: () => PromiseLike<{ position_title: any; company_name: any; start_date: any; end_date: any; description: any; embed_description: any; resume_entry_id: any }> | { position_title: any; company_name: any; start_date: any; end_date: any; description: any; embed_description: any; resume_entry_id: any } }) => {

    if(req.method === "OPTIONS"){
        return new Response('ok', {headers: corsHeaders})
    }

    const {position_title, company_name, start_date, end_date, description, embed_description, resume_entry_id} = await req.json();

    let embeddings = await embedDescription(description)
    // if(embed_description){
    //     embeddings = await embedDescription(description)
    // }

    console.log(embeddings)

    // return new Response(embeddings.length, {
    //     headers: {...corsHeaders, "Content-Type": 'application/json'}
    // })

    // if (resume_entry_id != null){ //then it must be an update
    //     const { success, error } = await supabase.rpc('update_resume_entry',{
    //         position_title: position_title,
    //         company_name: company_name,
    //         start_date: start_date,
    //         end_date: end_date,
    //         description: description,
    //         embeddings: embeddings, //if its empty array then rpc function shouldn't update
    //         resume_entry_id: resume_entry_id
    //     })

    //     return new Response(success, error, {
    //         headers: {...corsHeaders, "Content-Type": 'application/json'}
    //     })

    // } else {
    const responses = await supabase.rpc('create_resume_entry_test',{
        position_title: position_title,
        company_name: company_name,
        start_date: start_date,
        end_date: end_date,
        description: description,
        embeddings: JSON.stringify(embeddings), //should NEVER be empty
    })

    return new Response( JSON.stringify(responses), {
        headers: {...corsHeaders, "Content-Type": 'application/json'}
    })

    // }

})

const embedDescription = async function(description: string){

    const descriptions = description.split("\n");
    let embeddings = []

    for (let i = 0; i < descriptions.length; i++) {
        let embeddingResponse = await openai.embeddings.create({
            input: descriptions[i],
            model: "text-embedding-ada-002", // Model that creates our embeddings
        });

        let { embedding } = embeddingResponse.data[0]
        embeddings.push(embedding)
    }

    return embeddings;

}