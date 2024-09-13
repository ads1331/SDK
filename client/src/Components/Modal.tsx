import styles from './Modal.module.sass';

const Modal = ({ onClose }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <span className={styles.closeIcon} onClick={onClose}>
                    ✖
                </span>
                <h2>Голосование за функции</h2>
                <div className={styles.functionList}>
                    <div className={styles.functionItem}>
                        <p>Функция 1</p>
                        <button>Голосовать</button>
                    </div>
                    <div className={styles.functionItem}>
                        <p>Функция 2</p>
                        <button>Голосовать</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
