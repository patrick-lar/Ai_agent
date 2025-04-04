import axios from 'axios';
import cheerio from 'cheerio';
import { addDocument } from '../../lib/store';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Fetch the content from the URL
    const response = await axios.get(url);
    const html = response.data;
    
    // Use cheerio to parse the HTML and extract text content
    const $ = cheerio.load(html);
    
    // Remove script and style elements
    $('script, style').remove();
    
    // Get the page title
    const title = $('title').text() || url;
    
    // Extract text from the body
    const content = $('body').text()
      .replace(/\s+/g, ' ')  // Replace multiple whitespace with single space
      .trim();
    
    // Create a document object
    const document = {
      url,
      title,
      content: content.substring(0, 10000), // Limit content length
      addedAt: new Date().toISOString()
    };
    
    // Add to knowledge base using the shared store
    addDocument(document);
    
    return res.status(200).json({ 
      document: {
        url: document.url,
        title: document.title,
        addedAt: document.addedAt
      },
      message: 'Document added successfully' 
    });
  } catch (error) {
    console.error('Error adding document:', error);
    return res.status(500).json({ error: 'Failed to add document. Please check the URL and try again.' });
  }
}
