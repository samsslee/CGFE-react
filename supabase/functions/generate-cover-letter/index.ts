// @ts-nocheck
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts' 
import { stripIndent, oneLine } from 'https://esm.sh/common-tags@1.8.2'
import { supabase } from '../_shared/supabase.ts'
import { openai } from '../_shared/openai.ts'
import { corsHeaders } from '../_shared/cors.ts'
import GPT3Tokenizer from 'https://esm.sh/gpt3-tokenizer@1.1.5'


serve(async (req: { method: string; json: () => PromiseLike<{ hiringCompany: any; positionTitle: any; characteristics: any; additionalInfo: any }> | { hiringCompany: any; positionTitle: any; characteristics: any; additionalInfo: any } }) => {

    if(req.method === "OPTIONS"){
        return new Response('ok', {headers: corsHeaders})
    }

    const {hiringCompany, positionTitle, characteristics, additionalInfo} = await req.json();
    //FIX CAMEL CASE TO SNAKE CASE


    // implement some sort of sanitizing check here maybe like no profanity or whatever
    //clean up, can probably fix to be more suitable in the future

    const relevantExperience = await compileRelevantExperience(positionTitle, characteristics)

    const prompt = stripIndent `${oneLine`
        Use or include the following information about me to write my cover letter for
        the position of ${positionTitle} at the company ${hiringCompany}.
    `}

        My relevant work experience: """
        ${relevantExperience}
        """

        I have these key skills and characteristics listed in the job posting: """
        ${characteristics}
        """

        Additional info if any: """
        ${additionalInfo}
        """

    `
    //TODO: write function to make sure response is robust and clean

    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 0,
    });

    return new Response(JSON.stringify(chatCompletion.choices[0].message.content), {
        headers: {...corsHeaders, "Content-Type": 'application/json'}
    })

})


const compileRelevantExperience = async(positionTitle: string, characteristics: any)=>{

    const content = positionTitle + " with the following skills and characteristics: " + characteristics

    //create an embedding for the question
    const embeddingResponse = await openai.embeddings.create({
        input: content,
        model: "text-embedding-ada-002", // Model that creates our embeddings REDO THIS AND PICK ONE OF THE NEWER MODELS
    });

    const { embedding } = embeddingResponse.data[0]

    //get the relevant documents
    //rpc: SQL function in supabase

    const { data: descStatments, error } = await supabase.rpc('match_resume_description_embeddings',{
        query_embedding: embedding,
        match_threshold: .7, //TODO: this needs to be adjusted in the future
        match_count: 10
    })

    if (error) {throw error} //do error handling

    //loop through the relevant documents, limit token count to 1500
    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })
    let tokenCount = 0
    const relevantResume = {}
    let relevantExperience = ''

    for(let i = 0; i<descStatments.length; i++){
        const descStatment = descStatments[i]
        const description = descStatment.description.trim();
        const resumeEntryId = JSON.stringify(descStatment.resume_entry_id)
        const encoded = tokenizer.encode(description)
        tokenCount += encoded.text.length

        if (tokenCount > 1500){
            break
        }

        if (relevantResume[resumeEntryId] == undefined){
            relevantResume[resumeEntryId] = ''.concat("As a ", descStatment.position_title, " at ", descStatment.company_name, ": ", description)
        } else {
            relevantResume[resumeEntryId].concat(", ", description)
        }
    }

    for (let id in relevantResume){
        relevantExperience += relevantResume[id] + "---\n"
    }

    return relevantExperience
}