import { getDocuments } from '../../lib/store';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get all documents from the knowledge base
    const documents = getDocuments();
    
    // Return only the metadata, not the full content
    const documentMetadata = documents.map(doc => ({
      url: doc.url,
      title: doc.title,
      addedAt: doc.addedAt
    }));
    
    return res.status(200).json({ documents: documentMetadata });
  } catch (error) {
    console.error('Error retrieving documents:', error);
    return res.status(500).json({ error: 'Failed to retrieve documents.' });
  }
}
