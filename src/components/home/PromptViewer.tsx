import { Category, Prompt, PromptData, TaskType } from "../../types/PromptTypes";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from 'remark-breaks';
import { FaCopy, FaEdit, FaSave, FaPlay } from "react-icons/fa";
import { copyToClipboard, extractAvailableData, extractInstructions, formatNamed } from "../../lib/helpers";
import React, { useEffect, useState, useRef } from "react";
import { usePromptsBank } from "../../stores/usePromptsBank";
import { useSettings } from "../../stores/useSettings";
import rehypeRaw from 'rehype-raw';
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Typography } from "@mui/material";
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { streamAIResponse, testAIConnection } from "../../services/aiService";
import { Link as RouterLink } from 'react-router-dom';

interface PromptControllersProps {
    isEditing: boolean;
    handleSave: () => void;
    handleCancel: () => void;
    setIsEditing: (isEditing: boolean) => void;
    prompt: string;
    onRunPrompt: () => void;
    canRunPrompt: boolean;
    isRunning: boolean;
    showApiKeyMessage: boolean;
}

const PromptControllers: React.FC<PromptControllersProps> = ({ 
    isEditing, 
    handleSave,
    handleCancel,
    setIsEditing, 
    prompt, 
    onRunPrompt,
    canRunPrompt,
    isRunning,
    showApiKeyMessage
}) => {
    return (
        <Box display="flex" gap={2} alignItems="center">
            {isEditing ? (
                <>
                    <Button
                        variant="contained"
                        color="success"
                        size="medium"
                        onClick={handleSave}
                        startIcon={<FaSave />}
                    >
                        Save Prompt
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="medium"
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </>
            ) : (
                <>
                {showApiKeyMessage && (
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" color="warning.main">
                                To run the prompt, please configure your API key in
                            </Typography>
                            <Button
                                component={RouterLink}
                                to="/settings"
                                color="warning"
                                size="small"
                                variant="outlined"
                                onClick={() => window.scrollTo(0, 0)}
                            >
                                Settings
                            </Button>
                        </Box>
                    )}
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
                    {canRunPrompt && (
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            onClick={onRunPrompt}
                            startIcon={isRunning ? <CircularProgress size={20} color="inherit" /> : <FaPlay />}
                            disabled={isRunning}
                        >
                            {isRunning ? 'Running...' : 'Run Prompt'}
                        </Button>
                    )}
                </>
            )}
        </Box>
    );
};

const PromptViewer = ({ promptData }: { promptData: PromptData }) => {
    const { promptBank } = usePromptsBank();
    const { defaultFCPrompt, defaultNFCPrompt, aiProvider, aiModel, apiKey } = useSettings();
    const [prompt, setPrompt] = useState<string>("");
    const [originalPrompt, setOriginalPrompt] = useState<string>("");
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [canRunPrompt, setCanRunPrompt] = useState<boolean>(false);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [response, setResponse] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [showApiKeyMessage, setShowApiKeyMessage] = useState<boolean>(false);
    const responseRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkAIConnection = async () => {
            if (!aiProvider || !aiModel || !apiKey) {
                setCanRunPrompt(false);
                setShowApiKeyMessage(true);
                return;
            }
            
            const isValid = await testAIConnection(aiProvider, apiKey);
            setCanRunPrompt(isValid);
            setShowApiKeyMessage(!isValid);
        };
        checkAIConnection();
    }, [aiProvider, aiModel, apiKey]);

    useEffect(() => {
        const examplePromptCategory: Category | undefined = promptBank.find(cat => cat.id === promptData.category);
        const examplePromptText = examplePromptCategory?.prompts?.find((item: Prompt) => item.id === promptData.examplePrompt)?.prompt || '';
        const taskType: TaskType = examplePromptCategory?.taskType || TaskType.NFC;
        const dynamicReplacement = {
            "instructions": extractInstructions(promptData),
            "useCase": promptData.useCase,
            "example": examplePromptText,
            "data": taskType === TaskType.FC ? extractAvailableData(promptData) : '',
        };
        const defaultPrompt = taskType === TaskType.FC ? defaultFCPrompt : defaultNFCPrompt;
        const formattedPrompt = formatNamed(defaultPrompt, dynamicReplacement);
        setPrompt(formattedPrompt);
        setOriginalPrompt(formattedPrompt);
    }, [promptData, promptBank, defaultFCPrompt, defaultNFCPrompt]);

    const handleSave = () => {
        setOriginalPrompt(prompt);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setPrompt(originalPrompt);
        setIsEditing(false);
    };

    const handleRunPrompt = async () => {
        setIsRunning(true);
        setError(null);
        setResponse("");

        setTimeout(() => {
            responseRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);

        await streamAIResponse(
            aiProvider,
            aiModel,
            apiKey,
            prompt,
            {
                onToken: (token) => {
                    setResponse(prev => prev + token);
                },
                onError: (err) => {
                    setError(err);
                    setIsRunning(false);
                },
                onComplete: () => {
                    setIsRunning(false);
                }
            }
        );
    };

    const markdownComponents = {
        code({ node, inline, className, children, ...props }: any) {
            return (
                <code
                    className={`${className} whitespace-pre-wrap break-all`}
                    {...props}
                >
                    {children}
                </code>
            );
        },
        pre({ children }: any) {
            return (
                <pre className="whitespace-pre-wrap break-all">
                    {children}
                </pre>
            );
        }
    };

    return (
        <>
            <Card className="bg-white dark:bg-[#1E1E1E] shadow-lg rounded-lg mb-4">
                <CardHeader
                    title="Prompt"
                    className="text-gray-900 dark:text-gray-100"
                    action={
                        <PromptControllers 
                            isEditing={isEditing} 
                            handleSave={handleSave}
                            handleCancel={handleCancel}
                            setIsEditing={setIsEditing} 
                            prompt={prompt}
                            onRunPrompt={handleRunPrompt}
                            canRunPrompt={canRunPrompt}
                            isRunning={isRunning}
                            showApiKeyMessage={showApiKeyMessage}
                        />
                    }
                />
                <CardContent className="text-gray-900 dark:text-gray-100">
                    {isEditing ? (
                        <MdEditor
                            value={prompt}
                            style={{ height: "500px" }}
                            renderHTML={(text: string) => (
                                <Markdown 
                                    remarkPlugins={[remarkGfm]} 
                                    rehypePlugins={[rehypeRaw]}
                                    components={markdownComponents}
                                >
                                    {text}
                                </Markdown>
                            )}
                            onChange={({ text }: { text: string }) => setPrompt(text)}
                        />
                    ) : (
                        <Markdown 
                            remarkPlugins={[remarkGfm]} 
                            rehypePlugins={[rehypeRaw]}
                            components={markdownComponents}
                        >
                            {prompt}
                        </Markdown>
                    )}
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <PromptControllers 
                            isEditing={isEditing} 
                            handleSave={handleSave}
                            handleCancel={handleCancel}
                            setIsEditing={setIsEditing} 
                            prompt={prompt}
                            onRunPrompt={handleRunPrompt}
                            canRunPrompt={canRunPrompt}
                            isRunning={isRunning}
                            showApiKeyMessage={showApiKeyMessage}
                        />
                    </Box>
                </CardContent>
            </Card>

            {(response || error || isRunning) && (
                <Card ref={responseRef} className="bg-gray-100 dark:bg-[#2D2D2D] shadow-lg rounded-lg">
                    <CardHeader
                        title="AI Response"
                        className="text-gray-900 dark:text-gray-100"
                        action={
                            response && !error && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    size="small"
                                    onClick={() => copyToClipboard(response)}
                                    startIcon={<FaCopy />}
                                >
                                    Copy Response
                                </Button>
                            )
                        }
                    />
                    <CardContent className="text-gray-900 dark:text-gray-100">
                        {error ? (
                            <Typography color="error">{error}</Typography>
                        ) : (
                            <article className="prose prose-sm md:prose-base lg:prose-lg dark:prose-invert max-w-none">
                                <Markdown 
                                    remarkPlugins={[remarkGfm, remarkBreaks]} 
                                    rehypePlugins={[rehypeRaw]}
                                    components={markdownComponents}
                                >
                                    {response}
                                </Markdown>
                            </article>
                        )}
                    </CardContent>
                </Card>
            )}
        </>
    );
};

export default PromptViewer; 