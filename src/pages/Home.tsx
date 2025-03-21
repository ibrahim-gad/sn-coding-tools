import MainForm from "../components/home/MainForm";
import PromptViewer from "../components/home/PromptViewer";
import { usePromptsBank } from "../stores/usePromptsBank";
import { useFormStore } from "../stores/useFormStore";
import { Button } from "@mui/material";
import SyncIcon from '@mui/icons-material/Sync';

const Home = () => {
    const { syncPrompts, loading } = usePromptsBank();
    const { promptData, setPromptData } = useFormStore();

    return (
        <div className="w-full pb-6">
            <div className="container mx-auto p-6 gap-2 flex flex-col">
                <header className="mb-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create SI for SFT Coding tasks</h1>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={syncPrompts}
                        disabled={loading}
                        startIcon={<SyncIcon className={loading ? "animate-spin" : ""} />}
                    >
                        {loading ? "Syncing..." : "Sync Prompts"}
                    </Button>
                </header>
                <MainForm formSubmitHandler={setPromptData} />
                {promptData && <PromptViewer promptData={promptData} />}
            </div>
        </div>
    );
};

export default Home; 