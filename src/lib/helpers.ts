import { AssistantResponseFormat, PromptData, SystemPromptFormat, UserPromptFormat } from '../types/PromptTypes';
import {toast} from "react-toastify";

export const formatNamed = (template: string, replacements: { [key: string]: string }) => {
    let result = template;
    for (const [key, value] of Object.entries(replacements)) {
        result = result.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
    }
    return result;
};

export const extractInstructions = ({category, siFormat, addressee, userPromptFormat, assistantResponseFormat,}:PromptData) => {
    console.log(category)
    let instructions = "";
    const formatInstructionsMap: { [key in SystemPromptFormat]: string } = {
        [SystemPromptFormat.MARKDOWN]: "- The system prompt is in markdown format.\n",
        [SystemPromptFormat.TEXT]: "- The system prompt is in text format with bullet points if needed, no sub bullet points.\n",
        [SystemPromptFormat.FULL_XML]: "- The system prompt is in full XML format.\n",
        [SystemPromptFormat.FULL_JSON]: "- The system prompt is in full JSON format.\n",
    };

    if (formatInstructionsMap[siFormat]) {
        instructions += formatInstructionsMap[siFormat];
    }
    if (addressee === "assistant") {
        instructions += `- The system prompt should start with "You are an assistant" or something similar.\n`;
    }
    else {
        instructions += "- The system prompt needs to be in 3rd person format, so instead of saying, \"you are an assistant\", say \"the assistant\" or \"An ideal assistant\".\n"
    }
    const userPromptFormatInstructionsMap: { [key in UserPromptFormat]: string } = {
    [UserPromptFormat.MARKDOWN]: "- The llm should expect that the user prompt will be in markdown format.\n",
    [UserPromptFormat.TEXT]: "- The llm should expect that the user prompt will be in plain text format.\n",
    [UserPromptFormat.XML]: "- The llm should expect that the user prompt will be in XML format.\n",
    [UserPromptFormat.HTML]: "- The llm should expect that the user prompt will be in HTML format.\n",
    [UserPromptFormat.JSON]: "- The llm should expect that the user prompt will be in JSON format.\n",
};

    if (userPromptFormatInstructionsMap[userPromptFormat]) {
        instructions += userPromptFormatInstructionsMap[userPromptFormat];
    }
    const assistantResponseFormatInstructionsMap: { [key in AssistantResponseFormat]: string } = {
        [AssistantResponseFormat.MARKDOWN]: "- The llm should provide the response in markdown format unless otherwise instructed by the user.\n",
        [AssistantResponseFormat.TEXT]: "- The llm should provide the response in text format unless otherwise instructed by the user.\n",
        [AssistantResponseFormat.XML]: "- The llm should provide the response in XML format unless otherwise instructed by the user.\n",
        [AssistantResponseFormat.HTML]: "- The llm should provide the response in HTML format unless otherwise instructed by the user.\n",
        [AssistantResponseFormat.JSON]: "- The llm should provide the response in JSON format unless otherwise instructed by the user.\n",
    };

    if (assistantResponseFormatInstructionsMap[assistantResponseFormat]) {
        instructions += assistantResponseFormatInstructionsMap[assistantResponseFormat];
    }

    return instructions;
}

export const extractAvailableData = ({userName, date, useTimeInDate}:PromptData) => {
    let availableData = "";
    if (userName) {
        availableData += `- User name: ${userName}\n`;
    }
    if (date) {
        const dateObj = new Date(date);
        availableData += `- Date: ${dateObj.toDateString()}${useTimeInDate ? ` ${dateObj.toTimeString()}` : ''}\n`;
    }
    return availableData;
}

export const copyToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
        toast.success("Text copied to clipboard");
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
}; 

