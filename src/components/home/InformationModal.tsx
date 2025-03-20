import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface InformationModalProps {
    modalOpen: boolean;
    handleCloseModal: () => void;
    modalContent: string | React.JSX.Element;
}

const InformationModal: React.FC<InformationModalProps> = ({ modalOpen, handleCloseModal, modalContent }) => {
    const renderContent = () => {
        if (typeof modalContent === 'string') {
            return (
                <div className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{modalContent}</ReactMarkdown>
                </div>
            );
        }
        return modalContent;
    };

    return (
        <Dialog 
            open={modalOpen} 
            onClose={handleCloseModal}
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Information</DialogTitle>
            <DialogContent className="mt-2">
                {renderContent()}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseModal}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default InformationModal; 