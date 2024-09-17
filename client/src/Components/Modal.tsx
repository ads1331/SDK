import { useState, useEffect } from 'react';
import { getFunctions, voteForPost } from '../../api/posts.js';
import styles from './Modal.module.sass';

const Modal = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [isVoteSuccess, setIsVoteSuccess] = useState(false);
    const [categories, setCategories] = useState([]);
    const [features, setFeatures] = useState([]);
    const [emailError, setEmailError] = useState('');

    // Загрузка категорий
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getFunctions();
                setCategories(data);
            } catch (error) {
                console.error('Ошибка при загрузке категорий:', error);
            }
        };

        fetchCategories();
    }, []);

    // Загрузка всех фич
    useEffect(() => {
        const fetchFeatures = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/features');
                if (!response.ok) {
                    throw new Error('Ошибка при загрузке фич');
                }
                const data = await response.json();
                setFeatures(data);
            } catch (error) {
                console.error('Ошибка при загрузке фич:', error);
            }
        };

        fetchFeatures();
    }, []);

    // Фильтрация фич по выбранной категории
    const filteredFeatures = features.filter(feature => feature.id_functions === selectedCategory?.id);

    // Переход к следующему шагу
    const goToNextStep = () => {
        setStep(step + 1);
    };

    const goToPreviousStep = () => {
        setStep(step - 1);
    };

    // Обработка голосования
    const handleVote = async (feature) => {
        try {
            const userId = 2;  // Заменить на динамически или придумать как будет идти учет пользователя
            // Получаем IP
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            const ip = data.ip;

            const voteData = {
                id_functions: feature.id_functions,
                id_user: userId,
                id_vote: 2,
                ip
            };

            const result = await voteForPost(voteData);

            if (result) {
                console.log('Голос успешно отправлен');
                setIsVoteSuccess(true);  // успех голосования
                setStep(4);
            } else {
                throw new Error('Ошибка при голосовании');
            }
        } catch (error) {
            console.error('Ошибка при голосовании:', error);
        }

        setTimeout(() => {
            onClose();
        }, 5000);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);

        // Валидация email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailPattern.test(emailValue)) {
            setEmailError('');
        } else {
            setEmailError('Указан неверный Емейл');
        }
    };


    const isFormValid = () => {
        return name.trim() !== '' && emailError === '';
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <span className={styles.closeIcon} onClick={onClose}>
                    ✖
                </span>

                {step === 1 && (
                    <>
                        <h2 className={styles.welc_title}>Голосование</h2>
                        <p className={styles.welc_about}>Введите свое имя и E-mail</p>
                        <div className={styles.formGroupInpt}>
                            <div className={styles.formGroup}>
                                <label>Имя</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                    placeholder="Иван"
                                    className={styles.inpt_name}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={handleEmailChange}
                                    placeholder="Введите ваш email"
                                    className={styles.inpt_name}
                                />
                                {emailError && <p className={`${styles.error} ${emailError ? styles.show : ''}`}>{emailError}</p>}
                            </div>
                        </div>

                        {isFormValid() && (
                            <div className={styles.nextButtonContainer}>
                                <button className={styles.nextButton} onClick={() => setStep(step + 1)}>
                                    Далее
                                </button>
                            </div>
                        )}
                    </>
                )}

                {step === 2 && (
                    <>
                        <h2 className={styles.welc_title}>Голосование</h2>
                        <p className={styles.welc_about}>Выберите функционал для голосования</p>
                        <div className={styles.functionList}>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <div
                                        key={category.id}
                                        className={`${styles.functionItem} ${selectedCategory?.id === category.id ? styles.selectedItem : ''}`}
                                        onClick={() => setSelectedCategory(category)}
                                    >
                                        <p>{category.title}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Нет доступных категорий для голосования.</p>
                            )}
                        </div>

                        {selectedCategory && (
                            <div className={styles.nextButtonContainer}>
                                <button className={styles.nextButton} onClick={goToNextStep}>
                                    Далее
                                </button>
                                <button className={styles.prevButton} onClick={goToPreviousStep} disabled={step === 1}>
                                    Назад
                                </button>
                            </div>
                        )}
                    </>
                )}

                {step === 3 && selectedCategory && (
                    <>
                        <h2 className={styles.welc_title}>Голосование за: {selectedCategory.title}</h2>
                        <p className={styles.welc_about}>Оставьте свой голос за понравившуюся вам функцию</p>
                        <div className={styles.featureList}>
                            {filteredFeatures.length > 0 ? (
                                filteredFeatures.map((feature) => (
                                    <div key={feature.id} className={styles.featureItem}>
                                        <div className={styles.about_feature}>
                                            <p>{feature.title}</p>
                                            <p className={styles.about_title}>{feature.description}</p>
                                        </div>
                                        <button onClick={() => handleVote(feature)}>
                                            Голосовать
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>Нет доступных функций для голосования.</p>
                            )}
                        </div>

                        <div className={styles.buttonContainer}>
                            <button className={styles.prevButton} onClick={goToPreviousStep}>
                                Назад
                            </button>
                        </div>
                    </>
                )}

                {step === 4 && isVoteSuccess && (
                    <div className={styles.voteSuccess}>
                        <h2>Голосование</h2>
                        <p>Ваш голос отправлен!</p>
                        <img src="./check.png" alt="check"/>
                        <p>Окно закроется автоматически...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
