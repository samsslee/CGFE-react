// @ts-nocheck
import { serve } from 'https://deno.land/std@0.170.0/http/server.ts' 
import { openai } from '../_shared/openai.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { supabase } from '../_shared/supabase.ts'

serve(async (req: { method: string; json: () => PromiseLike<{ description: any; resumeEntryId: any; descriptionId: any; }> | { description: any; resumeEntryId: any; descriptionId: any; }; }) => {
    if (req.method === "OPTIONS") {
        return new Response('ok', { headers: corsHeaders });
    }

    const { description, resumeEntryId, descriptionId } = await req.json();

    const embedding = await embedDescription(description);
    // Need some failure handling if the embedding fails we need to return/abort or try again.

    let data: any;
    let error: any;

    //need try catches everywhere!!!
    if (descriptionId == null) { //then create a new one
        const { data: newData, error: newError } = await supabase
            .from('resume_description_embeddings')
            .insert([
                { resume_entry_id: resumeEntryId, embedding: embedding, description: description },
            ])
            .select('id, description, resume_entry_id',) // Selecting specific columns
            .single()
        data = newData;
        error = newError;
    } else {
        const { data: updatedData, error: updatedError } = await supabase
            .from('resume_description_embeddings')
            .update({ description: description, embedding: embedding })
            .eq('id', descriptionId)
            .select('id, description, resume_entry_id') // Selecting specific columns
            .single()
        data = updatedData;
        error = updatedError;
    }

    return new Response(JSON.stringify({ data, error }), {
        headers: { ...corsHeaders, "Content-Type": 'application/json' }
    });
});

const embedDescription = async function(description: Array){

    let embeddingResponse = await openai.embeddings.create({
        input: description,
        model: "text-embedding-ada-002", // Model that creates our embeddings
    });

    let { embedding } = embeddingResponse.data[0]

    return embedding;

}