import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [productDescription, setProductDescription] = useState('');
  const [taglines, setTaglines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productDescription.trim()) {
      setError('Please enter a product description');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/generate-taglines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productDescription }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate taglines');
      }
      
      setTaglines(data.taglines);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Creative Tagline Generator</title>
        <meta name="description" content="Generate creative taglines for your products using Azure's GPT-4o" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Creative Tagline Generator
        </h1>

        <p className={styles.description}>
          Enter your product description and get creative taglines powered by Azure GPT-4o
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <textarea
            className={styles.textarea}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Enter your product description here..."
            rows={5}
          />
          
          <button 
            type="submit" 
            className={styles.button}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Taglines'}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        {taglines.length > 0 && (
          <div className={styles.results}>
            <h2>Generated Taglines:</h2>
            <ul className={styles.taglineList}>
              {taglines.map((tagline, index) => (
                <li key={index} className={styles.taglineItem}>{tagline}</li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Powered by Azure OpenAI GPT-4o</p>
      </footer>
    </div>
  );
}
