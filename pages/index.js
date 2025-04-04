import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [documents, setDocuments] = useState([]);

  // Load existing documents when the page loads
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch('/api/get-documents');
        const data = await response.json();
        if (response.ok) {
          setDocuments(data.documents || []);
        }
      } catch (err) {
        console.error('Error fetching documents:', err);
      }
    };

    fetchDocuments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/answer-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question,
          chatHistory: chatHistory.slice(-5), // Send last 5 exchanges for context
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get an answer');
      }
      
      setAnswer(data.answer);
      
      // Add this exchange to chat history
      setChatHistory([
        ...chatHistory, 
        { 
          question, 
          answer: data.answer 
        }
      ]);
      
      // Clear the question input
      setQuestion('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    
    if (!documentUrl.trim()) {
      setError('Please enter a document URL');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/add-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: documentUrl }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add document');
      }
      
      setDocuments([...documents, data.document]);
      setDocumentUrl('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>AI Question Answering System</title>
        <meta name="description" content="Ask questions and get answers using Azure GPT-4o" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          AI Question Answering System
        </h1>

        <p className={styles.description}>
          Ask questions and get intelligent answers powered by Azure GPT-4o
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Add Knowledge</h2>
            <form onSubmit={handleAddDocument} className={styles.form}>
              <input
                className={styles.input}
                type="text"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                placeholder="Enter URL to add to knowledge base"
              />
              
              <button 
                type="submit" 
                className={styles.button}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add Document'}
              </button>
            </form>

            {documents.length > 0 && (
              <div className={styles.documents}>
                <h3>Knowledge Sources:</h3>
                <ul>
                  {documents.map((doc, index) => (
                    <li key={index}>{doc.title || doc.url}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className={styles.card}>
            <h2>Ask a Question</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
              <textarea
                className={styles.textarea}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question here..."
                rows={3}
              />
              
              <button 
                type="submit" 
                className={styles.button}
                disabled={loading}
              >
                {loading ? 'Thinking...' : 'Ask Question'}
              </button>
            </form>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {chatHistory.length > 0 && (
          <div className={styles.chatContainer}>
            <h2>Conversation History</h2>
            <div className={styles.chatHistory}>
              {chatHistory.map((exchange, index) => (
                <div key={index} className={styles.exchange}>
                  <div className={styles.question}>
                    <strong>Q:</strong> {exchange.question}
                  </div>
                  <div className={styles.answer}>
                    <strong>A:</strong> {exchange.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Powered by Azure OpenAI GPT-4o</p>
      </footer>
    </div>
  );
}
