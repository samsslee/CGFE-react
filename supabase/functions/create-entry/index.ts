// @ts-nocheck
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts' 
import { openai } from '../_shared/openai.ts'
import { corsHeaders } from '../_shared/cors.ts'
//import { supabase } from '../_shared/supabase.ts'

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supUrl = Deno.env.get("SUPABASE_URL") as string
const supKey =  Deno.env.get("SUPABASE_ANON_KEY") as string

serve(async (req: ServerRequest) => {

    if(req.method === "OPTIONS"){
        return new Response('ok', {headers: corsHeaders})
    }

    if (req.method !== "POST") {
        return new Response('Method Not Allowed', { status: 405 });
    }
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(supUrl, supKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const {positionTitle, companyName, startDate, endDate, description} = await req.json();

    const descriptions = description.split("\n");
    let embeddings = await embedDescription(descriptions)

    // Get the session or user object
    const { data } = await supabase.auth.getUser()
    const user = data.user
    //add error handling make it better or smth
    if (user == undefined || user.id == undefined){
        return new Response('user not found', {
            headers: {...corsHeaders, "Content-Type": 'application/json'}
        })
    }
    const userId = user.id

    const responses = await supabase.rpc('create_resume_entry',{
        position_title: positionTitle,
        company_name: companyName,
        start_date: startDate,
        end_date: endDate,
        descriptions: descriptions,
        user_id: userId,
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