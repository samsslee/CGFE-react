// @ts-nocheck
import 'https://deno.land/x/xhr@0.2.1/mod.ts'
import OpenAI from 'https://deno.land/x/openai@v4.24.0/mod.ts'
const apiKey = Deno.env.get('OPENAI_API_KEY')
export const openai = new OpenAI({apiKey: apiKey})