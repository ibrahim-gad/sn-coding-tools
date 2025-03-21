export enum SystemPromptFormat {
    MARKDOWN = 'markdown',
    TEXT = 'text',
    FULL_XML = 'full-xml',
    FULL_JSON = 'full-json'
}

export interface Prompt {
    id: string;
    format: SystemPromptFormat;
    name: string;
    prompt: string;
    addressee: string;
}
export enum TaskType {
    NFC = 'nfc',
    FC = 'fc'
}
export interface Category {
    id: string;
    name: string;
    taskType: TaskType;
    prompts: Prompt[];
    gid: string;
}

export enum UserPromptFormat {
    MARKDOWN = 'markdown',
    TEXT = 'text',
    XML = 'xml',
    HTML = 'html',
    JSON = 'json'
}

export enum AssistantResponseFormat {
    MARKDOWN = 'markdown',
    TEXT = 'text',
    XML = 'xml',
    HTML = 'html',
    JSON = 'json'
}

export interface PromptData {
    category: string;
    siFormat: SystemPromptFormat;
    addressee: string;
    examplePrompt: string;
    userPromptFormat: UserPromptFormat;
    assistantResponseFormat: AssistantResponseFormat;
    userName: string;
    date: Date | null;
    useTimeInDate: boolean;
    useCase: string;
} 