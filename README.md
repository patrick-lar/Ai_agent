# Creative Tagline Generator

A web application that uses Azure's GPT-4o model to generate creative taglines for product descriptions.

## Features

- Simple and intuitive user interface
- Powered by Azure OpenAI GPT-4o
- Generates multiple creative taglines for any product description
- Responsive design

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

### Deployment

This application can be easily deployed to Netlify or other hosting platforms.

## How It Works

1. Enter a product description in the text area
2. Click "Generate Taglines"
3. The application sends the description to the Azure OpenAI API
4. GPT-4o generates creative taglines based on the description
5. The taglines are displayed on the page

## Technologies Used

- Next.js
- React
- Azure OpenAI Service
- CSS Modules
