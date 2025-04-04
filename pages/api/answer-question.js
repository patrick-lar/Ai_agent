import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { getRelevantDocuments } from "../../lib/store";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question, chatHistory = [] } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
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

    // Get relevant documents for the question
    const relevantDocs = getRelevantDocuments(question);

    // Build the conversation history for context
    const messages = [
      { 
        role: "system", 
        content: `You are a helpful AI assistant that answers questions based on your knowledge.
        Be concise, accurate, and helpful. If you don't know the answer, say so honestly.`
      }
    ];

    // Add relevant knowledge context if available
    if (relevantDocs.length > 0) {
      const relevantContext = relevantDocs
        .map(doc => `[From: ${doc.title || doc.url}]\n${doc.content}`)
        .join('\n\n');
      
      messages.push({
        role: "system",
        content: `Here is some additional context that might help answer the question:\n\n${relevantContext}`
      });
    }

    // Add chat history for context
    chatHistory.forEach(exchange => {
      messages.push({ role: "user", content: exchange.question });
      messages.push({ role: "assistant", content: exchange.answer });
    });

    // Add the current question
    messages.push({ role: "user", content: question });

    const response = await client.getChatCompletions(
      deploymentName,
      messages,
      {
        temperature: 0.7,
        maxTokens: 800,
      }
    );

    const answer = response.choices[0].message.content.trim();
    return res.status(200).json({ answer });
  } catch (error) {
    console.error('Error answering question:', error);
    return res.status(500).json({ error: 'Failed to get an answer. Please check your Azure OpenAI configuration.' });
  }
}
