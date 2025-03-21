import React, { useEffect, useState } from 'react';
import { useSettings, AIProvider } from '../stores/useSettings';
import { fetchAvailableModels, AIModel } from '../services/aiService';
import { Box, FormControl, InputLabel, Select, MenuItem, TextField, Typography, FormHelperText, SelectChangeEvent, Button } from '@mui/material';

export const AISettingsForm: React.FC = () => {
    const { 
        aiProvider, 
        aiModel, 
        apiKey,
        setAISettings
    } = useSettings();

    // Local state for form values
    const [formState, setFormState] = useState({
        provider: aiProvider,
        model: aiModel,
        key: apiKey
    });

    const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Reset form state when global state changes
    useEffect(() => {
        setFormState({
            provider: aiProvider,
            model: aiModel,
            key: apiKey
        });
    }, [aiProvider, aiModel, apiKey]);

    useEffect(() => {
        const loadModels = async () => {
            if (!formState.key) return;
            
            setIsLoading(true);
            setError(null);
            try {
                const models = await fetchAvailableModels(formState.provider, formState.key);
                setAvailableModels(models);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch models');
            } finally {
                setIsLoading(false);
            }
        };

        loadModels();
    }, [formState.provider, formState.key]);

    const handleProviderChange = (e: SelectChangeEvent) => {
        const newProvider = e.target.value as AIProvider;
        setFormState(prev => ({
            ...prev,
            provider: newProvider,
            // Reset model when provider changes
            model: newProvider === 'gemini' ? 'models/gemini-2.0-flash' : ''
        }));
    };

    const handleModelChange = (e: SelectChangeEvent) => {
        setFormState(prev => ({
            ...prev,
            model: e.target.value
        }));
    };

    const handleAPIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({
            ...prev,
            key: e.target.value
        }));
    };

    const handleSave = () => {
        setAISettings(
            formState.provider,
            formState.model,
            formState.key
        );
    };

    const hasChanges = 
        formState.provider !== aiProvider || 
        formState.model !== aiModel || 
        formState.key !== apiKey;

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <FormControl fullWidth variant="outlined">
                <InputLabel id="ai-provider-label">AI Provider</InputLabel>
                <Select
                    labelId="ai-provider-label"
                    value={formState.provider}
                    onChange={handleProviderChange}
                    label="AI Provider"
                >
                    <MenuItem value="gemini">Gemini</MenuItem>
                    <MenuItem value="openai">OpenAI</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined">
                <TextField
                    label="API Key"
                    type="password"
                    value={formState.key}
                    onChange={handleAPIKeyChange}
                    placeholder={`Enter your ${formState.provider} API key`}
                    variant="outlined"
                    helperText={
                        !formState.key 
                            ? `Please enter your ${formState.provider} API key to load available models` 
                            : formState.provider === 'openai' 
                                ? 'Get your API key from OpenAI dashboard' 
                                : 'Get your API key from Google Cloud Console'
                    }
                    FormHelperTextProps={{
                        sx: { 
                            color: !formState.key ? 'warning.main' : 'text.secondary',
                            '& a': {
                                color: 'primary.main',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }
                        }
                    }}
                />
            </FormControl>

            <FormControl fullWidth variant="outlined" error={!!error}>
                <InputLabel id="ai-model-label">AI Model</InputLabel>
                <Select
                    labelId="ai-model-label"
                    value={formState.model}
                    onChange={handleModelChange}
                    label="AI Model"
                    disabled={isLoading || !formState.key}
                >
                    {!formState.key ? (
                        <MenuItem value="">
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography color="warning.main">
                                    Enter API key to load available models
                                </Typography>
                            </Box>
                        </MenuItem>
                    ) : isLoading ? (
                        <MenuItem value="">
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography>Loading models...</Typography>
                            </Box>
                        </MenuItem>
                    ) : availableModels.length === 0 && !error ? (
                        <MenuItem value="">
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography color="text.secondary">
                                    No models available
                                </Typography>
                            </Box>
                        </MenuItem>
                    ) : (
                        availableModels.map((model) => (
                            <MenuItem key={model.id} value={model.id}>
                                <Box>
                                    <Typography variant="body1">{model.name}</Typography>
                                    {model.description && (
                                        <Typography variant="caption" color="textSecondary">
                                            {model.description}
                                        </Typography>
                                    )}
                                </Box>
                            </MenuItem>
                        ))
                    )}
                </Select>
                {error && <FormHelperText error>{error}</FormHelperText>}
                {!error && !formState.key && (
                    <FormHelperText>
                        Models will be loaded automatically when you enter a valid API key
                    </FormHelperText>
                )}
            </FormControl>

            <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={!hasChanges || !formState.key || !formState.model}
                >
                    Save Changes
                </Button>
            </Box>
        </Box>
    );
}; 