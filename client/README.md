# Правила (начало работы)

Клонируете репозиторий на свою локальную машину:

- git clone https://github.com/SergeiKostiaev/SDK.git

Создаете и переходите на ветку(переход автоматический):

- git checkout -b *Название_ветки*

Начинаете разрабатывать!
### Важно! Название ветки совпадает с наименованием фичи/задачей(на англ)

## Закончили разработку

- git add .
- git commit -m "Тут подробное описание, что сделали на анг"
- git push -u origin *Название_ветки* / git push

Не забудьте проверить, что пуш прошел успешно!

Так же на GitHub делаем PullRequest

# Сами Merge не делаем!

## Запуск и тестирование своей части локально

- npm run dev

## Вид заполнения SASS

```sass
@import "../App"

.modalOverlay
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: $overlay
  display: flex
  justify-content: flex-end
  z-index: 1000
  .modalContent
    background-color: $white
    width: 467px
    height: 100%
    padding: 20px
    box-shadow: -4px 0 10px $bxShadow
    position: relative
    display: flex
    flex-direction: column
```
## Компонент UI

- Сам компонент Example.tsx
- Стили для компонента Example.module.tsx

Пример компонента
```tsx
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
```

Используем следующий стек:

Backend
1. Node.Js
2. Rest API
3. БД(MySql)

Frontend
1. React (Vite)
2. TS (для избежания ошибок)
3. SASS(Стили)
4. UI компоненты(если понадобятся)

Общее
1. GIT
2. GitHub
3. Docker(при необходимости)

- десктоп версия

- P.S. (из инета что такое SDK)

Набор инструментов, библиотек, документации и примеров кода, которые предоставляются разработчикам для интеграции определенного функционала в их приложения. SDK упрощает и стандартизирует процесс добавления определенных функций в программные продукты.