import MainForm from "../components/home/MainForm";
import Instructions from "../components/home/Instructions";
import PromptViewer from "../components/home/PromptViewer";
import { useState } from "react";
import { PromptData } from "../types/PromptTypes";
import { usePromptsBank } from "../stores/usePromptsBank";
import { Button } from "@mui/material";
import SyncIcon from '@mui/icons-material/Sync';
import { styled } from '@mui/material/styles';

const StyledButton = styled(Button)(({ theme }) => ({
    '&.Mui-disabled': {
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.26)',
    }
}));

const Home = () => {
    const [promptData, setPromptData] = useState<PromptData | null>(null);
    const { syncPrompts, loading } = usePromptsBank();
    const formSubmitHandler = (data: PromptData) => {
        setPromptData(data);
    };

    return (
        <div className="w-full pb-6">
            <div className="container mx-auto p-6">
                <header className="mb-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create SI for SFT Coding tasks</h1>
                    <StyledButton
                        variant="contained"
                        color="primary"
                        onClick={syncPrompts}
                        disabled={loading}
                        startIcon={<SyncIcon className={loading ? "animate-spin" : ""} />}
                    >
                        {loading ? "Syncing..." : "Sync Prompts"}
                    </StyledButton>
                </header>
                <Instructions />
            </div>
            <div className="container mx-auto p-6">
                <MainForm formSubmitHandler={formSubmitHandler} />
            </div>
            <div className="container mx-auto p-6">
                {promptData && <PromptViewer promptData={promptData} />}
            </div>
        </div>
    );
};

export default Home; 