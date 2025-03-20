import { Category, Prompt, PromptData, TaskType } from "../../types/PromptTypes";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { defaultFCPrompt, defaultNFCPrompt } from "../../lib/defaultPrompts";
import { FaCopy, FaEdit, FaSave } from "react-icons/fa";
import { copyToClipboard, extractAvailableData, extractInstructions, formatNamed } from "../../lib/helpers";
import React, { useEffect, useState } from "react";
import { usePromptsBank } from "../../stores/usePromptsBank";
import rehypeRaw from 'rehype-raw';
import { Box, Button, Card, CardContent, CardHeader } from "@mui/material";
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

interface PromptControllersProps {
    isEditing: boolean;
    handleSave: () => void;
    setIsEditing: (isEditing: boolean) => void;
    prompt: string;
}

const PromptControllers: React.FC<PromptControllersProps> = ({ isEditing, handleSave, setIsEditing, prompt }) => {
    return (
        <Box display="flex" gap={2}>
            {isEditing ? (
                <Button
                    variant="contained"
                    color="info"
                    size="medium"
                    onClick={handleSave}
                    startIcon={<FaSave />}
                >
                    Save Prompt
                </Button>
            ) : (
                <>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="medium"
                        onClick={() => setIsEditing(true)}
                        startIcon={<FaEdit />}
                    >
                        Edit Prompt
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        size="medium"
                        onClick={() => copyToClipboard(prompt)}
                        startIcon={<FaCopy />}
                    >
                        Copy Prompt
                    </Button>
                </>
            )}
        </Box>
    );
};

const PromptViewer = ({ promptData }: { promptData: PromptData }) => {
    const { promptBank } = usePromptsBank();
    const [prompt, setPrompt] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const examplePromptCategory: Category | undefined = promptBank.find(cat => cat.id === promptData.category);
        const examplePromptText = examplePromptCategory?.prompts?.find((item: Prompt) => item.id === promptData.examplePrompt)?.prompt || '';
        const taskType: TaskType = examplePromptCategory?.taskType || TaskType.NFC;
        const dynamicReplacement = {
            "instructions": extractInstructions(promptData),
            "scenario": promptData.scenario,
            "example": examplePromptText,
            "data": extractAvailableData(promptData),
        };
        const defaultPrompt = taskType === TaskType.FC ? defaultFCPrompt : defaultNFCPrompt;
        setPrompt(formatNamed(defaultPrompt, dynamicReplacement));
    }, [promptData, promptBank]);

    const handleSave = () => {
        setIsEditing(false);
    };

    return (
        <Card className="bg-white dark:bg-[#1E1E1E] shadow-lg rounded-lg">
            <CardHeader
                title="Prompt"
                className="text-gray-900 dark:text-gray-100"
                action={<PromptControllers isEditing={isEditing} handleSave={handleSave} setIsEditing={setIsEditing} prompt={prompt} />}
            />
            <CardContent className="text-gray-900 dark:text-gray-100">
                {isEditing ? (
                    <MdEditor
                        value={prompt}
                        style={{ height: "750px" }}
                        renderHTML={(text: string) => <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{text}</Markdown>}
                        onChange={({ text }: { text: string }) => setPrompt(text)}
                    />
                ) : (
                    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {prompt}
                    </Markdown>
                )}
                <Box display="flex" justifyContent="end" mt={2}>
                    <PromptControllers isEditing={isEditing} handleSave={handleSave} setIsEditing={setIsEditing} prompt={prompt} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default PromptViewer; 