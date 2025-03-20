import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import InformationModal from './InformationModal';
import { formHelpText } from "../../lib/help-texts";

const Instructions = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState<string|React.JSX.Element>('');

    const handleOpenModal = (content: string|React.JSX.Element) => {
        setModalContent(content);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalContent('');
    };

    return (
        <section className="bg-white dark:bg-[#1E1E1E] shadow-lg rounded-lg p-6">
            <header className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Instructions</h2>
            </header>
            <main>
                <ul className="list-disc list-inside text-gray-900 dark:text-gray-100">
                    <li>
                        Understand how this tool can help you.
                        <IconButton className="text-gray-900 dark:text-gray-100" onClick={() => handleOpenModal(formHelpText.toolPurpose)}>
                            <InfoIcon />
                        </IconButton>
                    </li>
                    <li>
                        How to know if the produced SI is good or not.
                        <IconButton className="text-gray-900 dark:text-gray-100" onClick={() => handleOpenModal(formHelpText.systemPromptValidity)}>
                            <InfoIcon />
                        </IconButton>
                    </li>
                </ul>
            </main>
            <InformationModal modalOpen={modalOpen} handleCloseModal={handleCloseModal} modalContent={modalContent} />
        </section>
    );
};

export default Instructions; 