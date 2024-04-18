// @ts-nocheck
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts' 
import { openai } from '../_shared/openai.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabase } from '../_shared/supabase.ts'

serve(async (req: { method: string; json: () => PromiseLike<{ positionTitle: any; companyName: any; startDate: any; endDate: any; description: any; embedDescription: any; resumeEntryId: any }> | { positionTitle: any; company_name: any; startDate: any; endDate: any; description: any; embedDescription: any; resumeEntryId: any } }) => {

    if(req.method === "OPTIONS"){
        return new Response('ok', {headers: corsHeaders})
    }

    const {positionTitle, companyName, startDate, endDate, description} = await req.json();

    const descriptions = description.split("\n");
    let embeddings = await embedDescription(descriptions)

    const responses = await supabase.rpc('create_resume_entry',{
        position_title: positionTitle,
        company_name: companyName,
        start_date: startDate,
        end_date: endDate,
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