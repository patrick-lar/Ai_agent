import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { productDescription } = req.body;

  if (!productDescription) {
    return res.status(400).json({ error: 'Product description is required' });
  }

  try {
    // These environment variables will be set in Netlify's deployment settings
    // and will only be accessible server-side
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;

    if (!endpoint || !apiKey || !deploymentName) {
      return res.status(500).json({ 
        error: 'Azure OpenAI credentials not configured. Please set the environment variables in your Netlify deployment settings.' 
      });
    }

    const client = new OpenAIClient(
      endpoint,
      new AzureKeyCredential(apiKey)
    );

    const prompt = `Generate 5 creative, catchy, and memorable taglines for the following product description. 
    Make them short, impactful, and unique. Each tagline should be on a new line.
    
    Product Description: ${productDescription}`;

    const response = await client.getChatCompletions(
      deploymentName,
      [
        { role: "system", content: "You are a creative marketing expert specialized in creating catchy taglines." },
        { role: "user", content: prompt }
      ],
      {
        temperature: 0.8,
        maxTokens: 300,
      }
    );

    // Parse the response to extract individual taglines
    const taglineText = response.choices[0].message.content.trim();
    const taglines = taglineText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('Tagline') && !line.match(/^\d+[\.\)]/))
      .map(line => line.replace(/^["'-]|["'-]$/g, '').trim());

    return res.status(200).json({ taglines });
  } catch (error) {
    console.error('Error generating taglines:', error);
    return res.status(500).json({ error: 'Failed to generate taglines. Please check your Azure OpenAI configuration.' });
  }
}
