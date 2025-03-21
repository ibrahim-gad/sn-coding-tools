import React, { useState } from 'react';
import { useSettings } from '../stores/useSettings';
import { defaultFCPrompt, defaultNFCPrompt } from '../lib/defaultPrompts';
import { Box, Button, Card, CardContent, CardHeader, Typography } from '@mui/material';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { AISettingsForm } from '../components/AISettingsForm';

const Settings = () => {
    const { 
        defaultFCPrompt: currentFCPrompt, 
        defaultNFCPrompt: currentNFCPrompt, 
        setDefaultFCPrompt, 
        setDefaultNFCPrompt,
        resetFCPrompt,
        resetNFCPrompt
    } = useSettings();
    const [fcPrompt, setFCPrompt] = useState(currentFCPrompt);
    const [nfcPrompt, setNFCPrompt] = useState(currentNFCPrompt);

    const handleSaveFC = () => {
        setDefaultFCPrompt(fcPrompt);
    };

    const handleSaveNFC = () => {
        setDefaultNFCPrompt(nfcPrompt);
    };

    const handleResetFC = () => {
        resetFCPrompt();
        setFCPrompt(defaultFCPrompt);
    };

    const handleResetNFC = () => {
        resetNFCPrompt();
        setNFCPrompt(defaultNFCPrompt);
    };

    return (
        <div className="w-full pb-6">
            <div className="container mx-auto p-6">
                <header className="mb-4 flex justify-between items-center">
                    <Typography variant="h1" className="!text-2xl !font-bold text-gray-900 dark:text-gray-100">Settings</Typography>
                </header>
                <Box display="flex" flexDirection="column" gap={4} mx="auto">
                    <Card className="bg-white dark:bg-[#1E1E1E] shadow-lg rounded-lg">
                        <CardHeader
                            title="AI Provider Settings"
                            className="text-gray-900 dark:text-gray-100"
                        />
                        <CardContent>
                            <AISettingsForm />
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-[#1E1E1E] shadow-lg rounded-lg">
                        <CardHeader
                            title="Default FC Prompt"
                            className="text-gray-900 dark:text-gray-100"
                        />
                        <CardContent>
                            <MdEditor
                                value={fcPrompt}
                                style={{ height: "500px" }}
                                renderHTML={(text: string) => <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{text}</Markdown>}
                                onChange={({ text }: { text: string }) => setFCPrompt(text)}
                            />
                            <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleResetFC}
                                >
                                    Reset FC Prompt
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveFC}
                                >
                                    Save FC Prompt
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-[#1E1E1E] shadow-lg rounded-lg">
                        <CardHeader
                            title="Default NFC Prompt"
                            className="text-gray-900 dark:text-gray-100"
                        />
                        <CardContent>
                            <MdEditor
                                value={nfcPrompt}
                                style={{ height: "500px" }}
                                renderHTML={(text: string) => <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{text}</Markdown>}
                                onChange={({ text }: { text: string }) => setNFCPrompt(text)}
                            />
                            <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleResetNFC}
                                >
                                    Reset NFC Prompt
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSaveNFC}
                                >
                                    Save NFC Prompt
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            </div>
        </div>
    );
};

export default Settings; 