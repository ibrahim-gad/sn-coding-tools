import React, { useState, useEffect } from 'react';
import {
    SystemPromptFormat,
    UserPromptFormat,
    AssistantResponseFormat,
    Prompt,
    PromptData
} from '../../types/PromptTypes';
import { usePromptsBank } from '../../stores/usePromptsBank';
import { useFormStore } from '../../stores/useFormStore';
import { Switch, Select, MenuItem, TextField, FormControl, Button, FormControlLabel, FormGroup, Box, IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { formHelpText } from '../../lib/help-texts';
import InformationModal from "./InformationModal";
import { Visibility } from "@mui/icons-material";
import { TaskType } from '../../types/PromptTypes';
import { ReactNode } from 'react';

interface MainFormProps {
    formSubmitHandler: (data: PromptData) => void;
}

const MainForm: React.FC<MainFormProps> = ({ formSubmitHandler }) => {
    const { promptBank } = usePromptsBank();
    const { formData, setFormData, resetForm } = useFormStore();
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<ReactNode>('');

    const isFormValid = () => {
        return formData.category && formData.siFormat && formData.addressee && formData.examplePrompt && formData.userPromptFormat && formData.assistantResponseFormat && formData.useCase;
    };

    const handleOpenModal = (content: ReactNode) => {
        setModalContent(content);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalContent('');
    };

    const handleOpenExamplePromptModal = () => {
        const selectedPrompt = prompts.find(prompt => prompt.id === formData.examplePrompt);
        console.log(selectedPrompt);
        if (selectedPrompt) {
            setModalContent(selectedPrompt.prompt);
            setModalOpen(true);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        formSubmitHandler({
            ...formData,
            siFormat: formData.siFormat as SystemPromptFormat,
            userPromptFormat: formData.userPromptFormat as UserPromptFormat,
            assistantResponseFormat: formData.assistantResponseFormat as AssistantResponseFormat,
            date: formData.date, // Now we know this is not null
        });
    };

    useEffect(() => {
        if (formData.category) {
            const selectedCategory = promptBank.find(cat => cat.id === formData.category);
            setPrompts(selectedCategory ? selectedCategory.prompts.filter(item => item.format === formData.siFormat && item.addressee === formData.addressee) : []);
        } else {
            setPrompts([]);
        }
    }, [formData.category, formData.siFormat, formData.addressee, promptBank]);

    useEffect(() => {
        const selectedPrompt = prompts.find(prompt => prompt.id === formData.examplePrompt);
        if (prompts.length > 0 && !selectedPrompt && formData.examplePrompt) {
            setFormData({ ...formData, examplePrompt: '' });
        }
    }, [prompts, setFormData]);

    return (
        <form className="space-y-4 p-4 bg-white dark:bg-[#1E1E1E] shadow-lg rounded-lg" onSubmit={handleSubmit}>
            <header className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Generate Prompt</h2>
            </header>
            <Box className="bg-gray-200 p-2 pb-6 dark:bg-[#2D2D2D]" display="flex" gap={2} flexDirection="column">
                <Box display="flex" gap={2}>
                    <FormControl fullWidth>
                        <label className="text-gray-900 dark:text-gray-100 h-10 flex items-center">
                            Area *
                        </label>
                        <Select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as string })}
                            className="bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-gray-100"
                        >
                            {promptBank.map(cat => (
                                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <label className="text-gray-900 dark:text-gray-100 h-10 flex items-center">
                            SI Format *
                        </label>
                        <Select
                            value={formData.siFormat}
                            onChange={(e) => setFormData({ ...formData, siFormat: e.target.value as SystemPromptFormat })}
                            className="bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-gray-100"
                        >
                            {Object.values(SystemPromptFormat).map(format => (
                                <MenuItem key={format} value={format}>{format}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <label className="text-gray-900 dark:text-gray-100">
                            Addressee *
                            <IconButton className="text-gray-900 dark:text-gray-100" onClick={() => handleOpenModal(formHelpText.addressee)}>
                                <InfoIcon />
                            </IconButton>
                        </label>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.addressee === 'third-person'}
                                        onChange={() => setFormData({ ...formData, addressee: formData.addressee === 'assistant' ? 'third-person' : 'assistant' })}
                                        name="addressee"
                                        color="primary"
                                    />
                                }
                                label="Addressee as a 3rd person"
                                className="text-gray-900 dark:text-gray-100"
                            />
                        </FormGroup>
                    </FormControl>
                </Box>
                <FormControl fullWidth>
                    <label className="text-gray-900 dark:text-gray-100">
                        Example SI *
                        <IconButton className="text-gray-900 dark:text-gray-100" onClick={() => handleOpenModal(formHelpText.examplePrompt)}>
                            <InfoIcon />
                        </IconButton>
                        {formData.examplePrompt && (
                            <IconButton className="text-gray-900 dark:text-gray-100" onClick={handleOpenExamplePromptModal}>
                                <Visibility />
                            </IconButton>
                        )}
                    </label>
                    <Select
                        value={formData.examplePrompt}
                        onChange={(e) => setFormData({ ...formData, examplePrompt: e.target.value as string })}
                        className="bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-gray-100"
                    >
                        {prompts.map(prompt => (
                            <MenuItem key={prompt.id} value={prompt.id}>{prompt.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            <Box display="flex" gap={2}>
                <FormControl fullWidth>
                    <label className="text-gray-900 dark:text-gray-100 h-10 flex items-center">
                        User Prompt Format *
                    </label>
                    <Select
                        value={formData.userPromptFormat}
                        onChange={(e) => setFormData({ ...formData, userPromptFormat: e.target.value as UserPromptFormat })}
                        className="bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-gray-100"
                    >
                        {Object.values(UserPromptFormat).map(format => (
                            <MenuItem key={format} value={format}>{format}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <label className="text-gray-900 dark:text-gray-100 h-10 flex items-center">
                        Assistant Response Format *
                    </label>
                    <Select
                        value={formData.assistantResponseFormat}
                        onChange={(e) => setFormData({ ...formData, assistantResponseFormat: e.target.value as AssistantResponseFormat })}
                        className="bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-gray-100"
                    >
                        {Object.values(AssistantResponseFormat).map(format => (
                            <MenuItem key={format} value={format}>{format}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
            {formData.category && promptBank.find(cat => cat.id === formData.category)?.taskType !== TaskType.NFC && (
                <>
                    <Box display="flex" gap={2}>
                        <FormControl fullWidth>
                            <label className="text-gray-900 dark:text-gray-100 h-10 flex items-center">
                                Date (Optional)
                            </label>
                            <TextField
                                fullWidth
                                type="datetime-local"
                                value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value ? new Date(e.target.value) : null })}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                className="bg-white dark:bg-[#1E1E1E] text-gray-900 dark:!text-gray-100"
                            />
                        </FormControl>
                        <FormControl fullWidth>
                            <label className="text-gray-900 dark:text-gray-100 h-10 flex items-center">
                                Time (Optional)
                            </label>
                            <Box display="flex" alignItems="center" flex={1}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.useTimeInDate}
                                                onChange={() => setFormData({ ...formData, useTimeInDate: !formData.useTimeInDate })}
                                                name="useTimeInDate"
                                                color="primary"
                                            />
                                        }
                                        label="Use time in date"
                                        className="text-gray-900 dark:text-gray-100"
                                    />
                                </FormGroup>
                            </Box>
                        </FormControl>
                    </Box>
                    <FormControl fullWidth>
                        <label className="text-gray-900 dark:text-gray-100 h-10 flex items-center">
                            User Name (Optional)
                        </label>
                        <TextField
                            fullWidth
                            value={formData.userName}
                            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                            className="bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-gray-100"
                        />
                    </FormControl>
                </>
            )}
            <FormControl fullWidth>
                <label className="text-gray-900 dark:text-gray-100 h-10 flex items-center">
                    Use Case *
                    <IconButton className="text-gray-900 dark:text-gray-100" onClick={() => handleOpenModal(formHelpText.useCase)}>
                        <InfoIcon />
                    </IconButton>
                </label>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.useCase}
                    onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                    className="bg-white dark:bg-[#1E1E1E] text-gray-900 dark:text-gray-100"
                />
            </FormControl>
            <Box display="flex" justifyContent="flex-end" sx={{ mt: 3 }} gap={2}>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={resetForm}
                >
                    Reset Form
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid()}
                >
                    Generate Prompt
                </Button>
            </Box>
            <InformationModal modalOpen={modalOpen} handleCloseModal={handleCloseModal} modalContent={modalContent} />
        </form>
    );
};

export default MainForm; 