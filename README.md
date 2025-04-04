# AI Question Answering System

A Retrieval-Augmented Generation (RAG) web application that uses Azure's GPT-4o model to answer questions based on your knowledge base.

## Features

- Ask questions and get intelligent answers powered by Azure GPT-4o
- Add web pages to your knowledge base by URL
- Conversation history to maintain context
- Retrieval-augmented generation to provide more accurate answers
- Responsive design for all devices

## How It Works

This application uses a RAG (Retrieval-Augmented Generation) approach:

1. **Retrieval**: When you ask a question, the system searches through your knowledge base to find relevant information
2. **Augmentation**: The relevant information is provided as context to the AI model
3. **Generation**: The AI model generates a response based on both its training and the specific context provided

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- An Azure account with access to Azure OpenAI Service
- A deployment of the GPT-4o model in your Azure OpenAI resource

### Configuration

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure your Azure OpenAI credentials in the `.env.local` file:
   ```
   AZURE_OPENAI_API_KEY=your_api_key_here
   AZURE_OPENAI_ENDPOINT=your_endpoint_here
   AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name_here
   ```

### Running the Application

To run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. **Add Knowledge**: Enter URLs of web pages to add to your knowledge base
2. **Ask Questions**: Type your question in the input field and click "Ask Question"
3. **View Answers**: See the AI's response, which is informed by both its training and your knowledge base
4. **Conversation History**: Previous questions and answers are saved for context

## Technologies Used

- Next.js
- React
- Azure OpenAI Service
- Axios for HTTP requests
- Cheerio for web scraping
