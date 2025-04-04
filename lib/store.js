// Simple in-memory data store for the knowledge base
// In a production application, this would be replaced with a database

// Knowledge base to store documents
let knowledgeBase = [];

export function addDocument(document) {
  knowledgeBase.push(document);
  return document;
}

export function getDocuments() {
  return knowledgeBase;
}

export function getRelevantDocuments(query) {
  // Simple relevance function - in a real RAG system, this would use embeddings and vector search
  if (knowledgeBase.length === 0) {
    return [];
  }
  
  // Convert query to lowercase for case-insensitive matching
  const lowerQuery = query.toLowerCase();
  
  // Score documents based on term frequency
  return knowledgeBase
    .map(doc => {
      const lowerContent = doc.content.toLowerCase();
      const queryTerms = lowerQuery.split(/\s+/).filter(term => term.length > 3);
      
      // Calculate a simple relevance score based on term frequency
      let score = 0;
      queryTerms.forEach(term => {
        // Count occurrences of the term in the document
        const regex = new RegExp(term, 'g');
        const matches = lowerContent.match(regex);
        if (matches) {
          score += matches.length;
        }
      });
      
      return { ...doc, score };
    })
    .filter(doc => doc.score > 0)  // Only include documents with some relevance
    .sort((a, b) => b.score - a.score)  // Sort by relevance score (descending)
    .slice(0, 3);  // Take top 3 most relevant documents
}
