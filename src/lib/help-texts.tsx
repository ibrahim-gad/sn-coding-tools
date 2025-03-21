import { ReactNode } from 'react';

interface FormHelpText {
    addressee: ReactNode;
    useCase: ReactNode;
    examplePrompt: string;
    toolPurpose: string;
    systemPromptValidity: string;
}

const addressee = (
    <div className="text-gray-900 dark:text-gray-100">
    The addressee of the prompt:
        <ul className="list-disc list-inside">
            <li><strong>OFF:</strong> The SI is addressed to the assistant, i.e You are an assistant integrated in...</li>
            <li><strong>ON:</strong> The SI is addressed to a 3rd person, i.e An ideal assistant integrated in...</li>
        </ul>
    </div>
)

const useCase = (
    <div className="text-gray-900 dark:text-gray-100">
    The use case of the new SI:
        <ul className="list-disc list-inside">
            <li>This is the most important piece of information.</li>
            <li>Use the <strong>Domain</strong>, <strong>Subdomain</strong>, as a base for this, taxonomies can be mentioned, but as part of the assistant abilities, not the only abilities.</li>
            <li><strong>Don't just copy paste the scenario from the labeling tool.</strong></li>
            <li>Make this suitable for multiple conversations, not specific to one conversation, but suitable for a <strong>class</strong> of conversations. (Remember: you still have to do variants)</li>
        </ul>
    </div>
)

export const formHelpText: FormHelpText = {
    addressee,
    useCase,
    examplePrompt: 'Select an example prompt to use as a template.',
    toolPurpose: 'This tool helps you generate System Instructions (SI) for AI tasks. It provides templates and examples to create consistent and effective prompts.',
    systemPromptValidity: 'A good SI should be clear, specific, and include all necessary context for the AI to understand and complete the task effectively.'
}; 