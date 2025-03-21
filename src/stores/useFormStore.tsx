import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PromptData } from '../types/PromptTypes';
import { SystemPromptFormat, UserPromptFormat, AssistantResponseFormat } from '../types/PromptTypes';

interface FormState {
    formData: {
        category: string;
        siFormat: string;
        addressee: string;
        examplePrompt: string;
        userPromptFormat: string;
        assistantResponseFormat: string;
        userName: string;
        date: Date | null;
        useTimeInDate: boolean;
        useCase: string;
    };
    promptData: PromptData | null;
    setFormData: (data: FormState['formData']) => void;
    setPromptData: (data: PromptData | null) => void;
    resetForm: () => void;
}

const initialFormData = {
    category: '',
    siFormat: SystemPromptFormat.MARKDOWN,
    addressee: 'assistant',
    examplePrompt: '',
    userPromptFormat: UserPromptFormat.MARKDOWN,
    assistantResponseFormat: AssistantResponseFormat.MARKDOWN,
    userName: '',
    date: null,
    useTimeInDate: true,
    useCase: '',
};

export const useFormStore = create<FormState>()(
    persist(
        (set) => ({
            formData: initialFormData,
            promptData: null,
            setFormData: (data) => set({ formData: data }),
            setPromptData: (data) => set({ promptData: data }),
            resetForm: () => set({ formData: initialFormData, promptData: null }),
        }),
        {
            name: 'sn-coding-tools-form-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
); 