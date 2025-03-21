import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { defaultFCPrompt, defaultNFCPrompt } from '../lib/defaultPrompts';
import { toast } from 'react-toastify';

export type AIProvider = 'gemini' | 'openai';

interface SettingsState {
    defaultFCPrompt: string;
    defaultNFCPrompt: string;
    aiProvider: AIProvider;
    aiModel: string;
    apiKey: string;
    setDefaultFCPrompt: (prompt: string) => void;
    setDefaultNFCPrompt: (prompt: string) => void;
    setAIProvider: (provider: AIProvider) => void;
    setAIModel: (model: string) => void;
    setAPIKey: (key: string) => void;
    setAISettings: (provider: AIProvider, model: string, key: string) => void;
    resetToDefaults: () => void;
    resetFCPrompt: () => void;
    resetNFCPrompt: () => void;
}

export const useSettings = create<SettingsState>()(
    persist(
        (set) => ({
            defaultFCPrompt,
            defaultNFCPrompt,
            aiProvider: 'gemini',
            aiModel: 'models/gemini-2.0-flash',
            apiKey: '',
            setDefaultFCPrompt: (prompt) => {
                set({ defaultFCPrompt: prompt });
                toast.success('FC prompt updated successfully');
            },
            setDefaultNFCPrompt: (prompt) => {
                set({ defaultNFCPrompt: prompt });
                toast.success('NFC prompt updated successfully');
            },
            setAIProvider: (provider) => {
                set({ aiProvider: provider });
                // Reset model when provider changes
                set({ aiModel: provider === 'gemini' ? 'models/gemini-2.0-flash' : '' });
            },
            setAIModel: (model) => {
                set({ aiModel: model });
            },
            setAPIKey: (key) => {
                set({ apiKey: key });
            },
            setAISettings: (provider, model, key) => {
                set({ 
                    aiProvider: provider,
                    aiModel: model,
                    apiKey: key
                });
                toast.success('AI settings updated successfully');
            },
            resetToDefaults: () => {
                set({
                    defaultFCPrompt,
                    defaultNFCPrompt,
                    aiProvider: 'gemini',
                    aiModel: 'models/gemini-2.0-flash',
                    apiKey: ''
                });
                toast.success('Settings reset to defaults');
            },
            resetFCPrompt: () => {
                set({ defaultFCPrompt });
                toast.success('FC prompt reset to default');
            },
            resetNFCPrompt: () => {
                set({ defaultNFCPrompt });
                toast.success('NFC prompt reset to default');
            },
        }),
        {
            name: 'sn-coding-tools-settings-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
); 