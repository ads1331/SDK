import { useState } from 'react';

import Modal from './Modal';
import styles from './VoteWidget.module.sass';

const VoteWidget = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className={styles.voteIcon} onClick={openModal}>
                <span>Голосовать</span>
            </div>
            {isModalOpen && <Modal onClose={closeModal} />}
        </div>
    );
};

export default VoteWidget;
