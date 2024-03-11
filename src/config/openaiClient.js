import OpenAI from 'openai';
//this needs to be dealt with in the future install it in the BE
const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_KEY,
    dangerouslyAllowBrowser: true
  });

export default openai
