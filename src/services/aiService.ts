import { AIProvider } from '../stores/useSettings';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface AIModel {
    id: string;
    name: string;
    description?: string;
}

interface OpenAIModelsResponse {
    data: Array<{
        id: string;
        description: string;
    }>;
}

interface GeminiModelsResponse {
    models: Array<{
        name: string;
        version: string;
        displayName: string;
        description: string;
    }>;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/models';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models';
const OPENAI_CHAT_URL = 'https://api.openai.com/v1/chat/completions';
const GEMINI_CHAT_URL = 'https://generativelanguage.googleapis.com/v1';

async function fetchOpenAIModels(apiKey: string): Promise<AIModel[]> {
    const response = await axios.get<OpenAIModelsResponse>(OPENAI_API_URL, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });

    // Filter for only GPT models and format them
    return response.data.data
        .filter(model => model.id.includes('gpt'))
        .map(model => ({
            id: model.id,
            name: model.id.toUpperCase(),
            description: model.description
        }));
}

async function fetchGeminiModels(apiKey: string): Promise<AIModel[]> {
    const response = await axios.get<GeminiModelsResponse>(`${GEMINI_API_URL}?key=${apiKey}`);

    // Filter for Gemini models and format them
    return response.data.models
        .filter(model => model.name.includes('gemini'))
        .map(model => ({
            id: model.name,
            name: model.displayName,
            description: model.description
        }));
}

export const fetchAvailableModels = async (provider: AIProvider, apiKey: string): Promise<AIModel[]> => {
    if (!apiKey) {
        throw new Error('API key is required');
    }

    try {
        switch (provider) {
            case 'gemini':
                return await fetchGeminiModels(apiKey);
            case 'openai':
                return await fetchOpenAIModels(apiKey);
            default:
                return [];
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                throw new Error('Invalid API key');
            } else if (error.response?.status === 403) {
                throw new Error('Access forbidden. Please check your API key permissions');
            }
            throw new Error(`Failed to fetch models: ${error.response?.data?.error?.message || error.message}`);
        }
        throw error;
    }
};

export interface StreamCallbacks {
    onToken: (token: string) => void;
    onError: (error: string) => void;
    onComplete: () => void;
}

export async function streamAIResponse(
    provider: AIProvider,
    model: string,
    apiKey: string,
    prompt: string,
    callbacks: StreamCallbacks
) {
    try {
        if (provider === 'openai') {
            const response = await fetch(OPENAI_CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: prompt }],
                    stream: true,
                }),
            });

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('Failed to create stream reader');
            }

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.includes('[DONE]')) continue;
                    if (!line.startsWith('data:')) continue;

                    try {
                        const json = JSON.parse(line.replace('data: ', ''));
                        const token = json.choices[0]?.delta?.content;
                        if (token) {
                            callbacks.onToken(token);
                        }
                    } catch (e) {
                        console.error('Failed to parse streaming response:', e);
                    }
                }
            }
        } else if (provider === 'gemini') {
            const genAI = new GoogleGenerativeAI(apiKey);
            const genModel = genAI.getGenerativeModel({ model: model });

            const result = await genModel.generateContentStream(prompt);
            
            for await (const chunk of result.stream) {
                const text = chunk.text();
                if (text) {
                    callbacks.onToken(text);
                }
            }
        }

        callbacks.onComplete();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            callbacks.onError(error.response?.data?.error?.message || error.message);
        } else {
            callbacks.onError(error instanceof Error ? error.message : 'Unknown error occurred');
        }
    }
}

export async function testAIConnection(provider: AIProvider, apiKey: string): Promise<boolean> {
    try {
        await fetchAvailableModels(provider, apiKey);
        return true;
    } catch (error) {
        return false;
    }
} 