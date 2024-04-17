// @ts-nocheck
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts' 
import { openai } from '../_shared/openai.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabase } from '../_shared/supabase.ts'

serve(async (req: { method: string; json: () => PromiseLike<{ position_title: any; company_name: any; start_date: any; end_date: any; description: any; embed_description: any; resume_entry_id: any }> | { position_title: any; company_name: any; start_date: any; end_date: any; description: any; embed_description: any; resume_entry_id: any } }) => {

    if(req.method === "OPTIONS"){
        return new Response('ok', {headers: corsHeaders})
    }

    const {position_title, company_name, start_date, end_date, description} = await req.json();

    const descriptions = description.split("\n");
    let embeddings = await embedDescription(descriptions)

    const responses = await supabase.rpc('create_resume_entry',{
        position_title: position_title,
        company_name: company_name,
        start_date: start_date,
        end_date: end_date,
        descriptions: descriptions,
        embeddings: embeddings //should NEVER be empty
    })

    return new Response(JSON.stringify(responses), {
        headers: {...corsHeaders, "Content-Type": 'application/json'}
    })

})

const embedDescription = async function(descriptions: Array){

    let embeddings = []

    for (let i = 0; i < descriptions.length; i++) {
        let embeddingResponse = await openai.embeddings.create({
            input: descriptions[i],
            model: "text-embedding-ada-002", // Model that creates our embeddings
        });

        let { embedding } = embeddingResponse.data[0]
        embeddings.push(JSON.stringify(embedding))
    }

    return embeddings;

}