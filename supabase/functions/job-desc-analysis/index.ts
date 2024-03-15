// @ts-nocheck
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts' 
import { stripIndent, oneLine } from 'https://esm.sh/common-tags@1.8.2'
import { openai } from '../_shared/openai.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {

    if(req.method === "OPTIONS"){
        return new Response('ok', {headers: corsHeaders})
    }

    const {query} = await req.json();
    const jobDescClean = query.replace(/\n/g, ' '); //clean up, can probably fix to be more suitable in the future


    const prompt = stripIndent `${oneLine`
    Return a JSON object with three key value pairs like so: {"Company_Name": "", "Job_Title": "", "Skills_and_Key_Characteristics_of_Candidiate":[comma, separated, list]"}
    Fill in the blanks based on the Job Description Below. Do not return anything other than a JSON object.
    `}

    Job description: """
    ${jobDescClean}
    """

    `

    //write function to make sure response is robust and clean

    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 512,
        temperature: 0,
    });

    return new Response(chatCompletion.choices[0].message.content, {
        headers: {...corsHeaders, "Content-Type": 'application/json'}
    })

})