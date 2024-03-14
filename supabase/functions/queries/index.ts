// @ts-nocheck
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts' 
import 'https://deno.land/x/xhr@0.2.1/mod.ts'
import GPT3Tokenizer from 'https://esm.sh/gpt3-tokenizer@1.1.5'
import { stripIndent, oneLine } from 'https://esm.sh/common-tags@1.8.2'
//open AI
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
const supUrl = Deno.env.get("SUPABASE_URL") as string
const supKey =  Deno.env.get("SUPABASE_ANON_KEY") as string
const supabase = createClient(supUrl,supKey) //from supabase default environment variables


//import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {

    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }

    const apiKey = Deno.env.get('OPENAI_API_KEY')
    const openai = new OpenAI({
        apiKey: apiKey,
    })

    if(req.method === "OPTIONS"){
        return new Response('ok', {headers: corsHeaders})
    }

    const {query} = await req.json();

    const content = query.replace(/\n/g, ' '); //clean up, can probably fix to be more suitable in the future

    //create an embedding for the question

    const embeddingResponse = await openai.embeddings.create({
        input: content,
        model: "text-embedding-ada-002", // Model that creates our embeddings REDO THIS AND PICK ONE OF THE NEWER MODELS
    });

    const { embedding } = embeddingResponse.data[0]


    //get the relevant documents
    //rpc: SQL function in supabase

    const { data: descStatments, error } = await supabase.rpc('match_testembeds',{
        query_embedding: embedding,
        match_threshold: .73,
        match_count: 10
    })

    if (error) {throw error}

    //loop through the relevant documents, limit token count to 1500
    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
    let tokenCount = 0
    let contextText = ''


    for(let i = 0; i<descStatments.length; i++){
        const descStatment = descStatments[i]
        const content = descStatment.content;
        const encoded = tokenizer.encode(content)
        tokenCount += encoded.text.length

        if (tokenCount > 1500){
            break
        }

        contextText += `${content.trim()} ---\n`
    }

    //create prompt (system statement, relevant documents, question)

    const prompt = stripIndent `${oneLine`
        Write a cover letter based on the job description and my experience description. 
        `}

        Job description: """
        ${query}
        """

        Relevant experience description: """
        ${contextText}
        """

    `
    //instead of content, write "contextText"

    //get response from text-davinci-003 model

    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 0,
      });
      
    
    //return the response from the model
    return new Response(JSON.stringify({chatCompletion}), {
        headers: {...corsHeaders, "Content-Type": 'application/json'}
    })
})