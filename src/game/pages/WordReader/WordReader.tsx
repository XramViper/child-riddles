import { EventBus } from "../../EventBus";
import { ProjectScene, speak } from "../../shared";
import { AVAILABLE_SCENES } from "../../shared/ui/ProjectScene/project.config";
import { syllabifyWord } from "./utils/syllabify";

interface SyllableData {
    text: string;
    startIndex: number;
    endIndex: number;
}

export class WordReader extends ProjectScene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    word: string;
    letters: string[];
    syllables: string[];
    syllableData: SyllableData[];
    
    // UI элементы
    wordText: Phaser.GameObjects.Text | Phaser.GameObjects.Container;
    syllableButtons: Phaser.GameObjects.Text[];
    syllableBackgrounds: Phaser.GameObjects.Rectangle[];
    readAllButton: Phaser.GameObjects.Text;
    backButton: Phaser.GameObjects.Text;
    
    // Состояние анимации
    isReading: boolean = false;
    currentActiveSyllable: number = -1;

    constructor() {
        super(AVAILABLE_SCENES.WordReader);
    }

    init(data: { word: string }) {
        this.word = data.word;
        this.letters = this.word.split("");
        this.syllables = syllabifyWord(this.word, { separator: "·" }).split("·");
        this.syllableData = this.calculateSyllablePositions();
        this.syllableButtons = [];
        this.syllableBackgrounds = [];
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x2c3e50);

        this.createBackground();
        this.createWord();
        this.createSyllableButtons();
        this.createReadAllButton();
        this.createBackButton();

        EventBus.emit("current-scene-ready", this);
    }

    private calculateSyllablePositions(): SyllableData[] {
        const syllableData: SyllableData[] = [];
        let currentIndex = 0;

        this.syllables.forEach((syllable) => {
            const startIndex = currentIndex;
            const endIndex = currentIndex + syllable.length - 1;
            
            syllableData.push({
                text: syllable,
                startIndex,
                endIndex
            });
            
            currentIndex += syllable.length;
        });

        return syllableData;
    }

    private createBackground() {
        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(0.3);
    }

    private createWord() {
        this.wordText = this.add.text(512, 250, this.word, {
            fontFamily: "Arial Black",
            fontSize: 72,
            color: "#ffffff",
            stroke: "#2c3e50",
            strokeThickness: 4,
        });
        this.wordText.setOrigin(0.5);
    }

    private createSyllableButtons() {
        const totalWidth = this.syllables.length * 120 - 20; // 120px per button, 20px gap
        const startX = 512 - totalWidth / 2;

        this.syllables.forEach((syllable, index) => {
            const x = startX + index * 120;
            const y = 400;

            // Создаем фон для слога
            const buttonBg = this.add.rectangle(x, y, 100, 60, 0x3498db, 0.8);
            buttonBg.setStrokeStyle(3, 0x2980b9);

            // Создаем текст слога
            const syllableButton = this.add.text(x, y, syllable, {
                fontFamily: "Arial Black",
                fontSize: 28,
                color: "#ffffff",
            });
            syllableButton.setOrigin(0.5);

            // Делаем кнопку интерактивной
            buttonBg.setInteractive();
            syllableButton.setInteractive();

            const onSyllableClick = () => {
                if (!this.isReading) {
                    this.highlightSyllable(index);
                    this.highlightSyllableButton(index);
                    this.speakSyllable(syllable, index);
                }
            };

            buttonBg.on("pointerdown", onSyllableClick);
            syllableButton.on("pointerdown", onSyllableClick);

            // Добавляем hover эффект
            buttonBg.on("pointerover", () => {
                if (!this.isReading) {
                    buttonBg.setFillStyle(0x3498db, 1);
                }
            });

            buttonBg.on("pointerout", () => {
                if (!this.isReading && this.currentActiveSyllable !== index) {
                    buttonBg.setFillStyle(0x3498db, 0.8);
                }
            });

            this.syllableButtons.push(syllableButton);
            this.syllableBackgrounds.push(buttonBg);
        });
    }

    private createReadAllButton() {
        const buttonBg = this.add.rectangle(512, 520, 300, 60, 0xe74c3c, 0.9);
        buttonBg.setStrokeStyle(3, 0xc0392b);

        this.readAllButton = this.add.text(512, 520, "Читать по слогам", {
            fontFamily: "Arial Black",
            fontSize: 24,
            color: "#ffffff",
        });
        this.readAllButton.setOrigin(0.5);

        buttonBg.setInteractive();
        this.readAllButton.setInteractive();

        const onReadAllClick = () => {
            if (!this.isReading) {
                this.readWordBySyllables();
            }
        };

        buttonBg.on("pointerdown", onReadAllClick);
        this.readAllButton.on("pointerdown", onReadAllClick);

        // Hover эффект
        buttonBg.on("pointerover", () => {
            if (!this.isReading) {
                buttonBg.setFillStyle(0xe74c3c, 1);
            }
        });

        buttonBg.on("pointerout", () => {
            if (!this.isReading) {
                buttonBg.setFillStyle(0xe74c3c, 0.9);
            }
        });
    }

    private createBackButton() {
        const buttonBg = this.add.rectangle(100, 50, 120, 50, 0x95a5a6, 0.9);
        buttonBg.setStrokeStyle(2, 0x7f8c8d);

        this.backButton = this.add.text(100, 50, "Назад", {
            fontFamily: "Arial Black",
            fontSize: 20,
            color: "#ffffff",
        });
        this.backButton.setOrigin(0.5);

        buttonBg.setInteractive();
        this.backButton.setInteractive();

        const onBackClick = () => {
            if (!this.isReading) {
                this.scene.start(AVAILABLE_SCENES.RiddlesGameArea);
            }
        };

        buttonBg.on("pointerdown", onBackClick);
        this.backButton.on("pointerdown", onBackClick);
    }

    private highlightSyllable(syllableIndex: number) {
        this.currentActiveSyllable = syllableIndex;
        const syllableData = this.syllableData[syllableIndex];
        
        // Удаляем старый текст
        this.wordText.destroy();
        
        // Создаем части слова
        const beforeSyllable = this.word.substring(0, syllableData.startIndex);
        const currentSyllable = this.word.substring(syllableData.startIndex, syllableData.endIndex + 1);
        const afterSyllable = this.word.substring(syllableData.endIndex + 1);
        
        // Создаем контейнер для частей слова
        const wordContainer = this.add.container(512, 250);
        
        // Вычисляем позиции для каждой части
        const tempText = this.add.text(0, 0, this.word, {
            fontFamily: "Arial Black",
            fontSize: 72,
        });
        const totalWidth = tempText.width;
        tempText.destroy();
        
        let currentX = -totalWidth / 2;
        
        // Создаем текст до слога
        if (beforeSyllable) {
            const beforeText = this.add.text(currentX, 0, beforeSyllable, {
                fontFamily: "Arial Black",
                fontSize: 72,
                color: "#ffffff",
                stroke: "#2c3e50",
                strokeThickness: 4,
            });
            beforeText.setOrigin(0, 0.5);
            wordContainer.add(beforeText);
            currentX += beforeText.width;
        }
        
        // Создаем подсвеченный слог
        const syllableText = this.add.text(currentX, 0, currentSyllable, {
            fontFamily: "Arial Black",
            fontSize: 72,
            color: "#f39c12",
            stroke: "#e67e22",
            strokeThickness: 6,
        });
        syllableText.setOrigin(0, 0.5);
        wordContainer.add(syllableText);
        currentX += syllableText.width;
        
        // Создаем текст после слога
        if (afterSyllable) {
            const afterText = this.add.text(currentX, 0, afterSyllable, {
                fontFamily: "Arial Black",
                fontSize: 72,
                color: "#ffffff",
                stroke: "#2c3e50",
                strokeThickness: 4,
            });
            afterText.setOrigin(0, 0.5);
            wordContainer.add(afterText);
        }
        
        // Сохраняем ссылку на контейнер как wordText
        this.wordText = wordContainer as any;
        
        // Анимация пульсации для активного слога
        this.tweens.add({
            targets: syllableText,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
    }

    private async speakSyllable(syllable: string, index: number) {
        await speak(syllable);
        
        // Убираем подсветку через небольшую задержку после завершения произношения
        this.time.delayedCall(300, () => {
            if (this.currentActiveSyllable === index) {
                this.resetWordHighlight();
                this.resetSyllableButtons();
            }
        });
    }

    private resetWordHighlight() {
        this.currentActiveSyllable = -1;
        
        // Удаляем старый контейнер/текст
        if (this.wordText) {
            this.wordText.destroy();
        }
        
        // Создаем новый простой текст
        this.wordText = this.add.text(512, 250, this.word, {
            fontFamily: "Arial Black",
            fontSize: 72,
            color: "#ffffff",
            stroke: "#2c3e50",
            strokeThickness: 4,
        });
        this.wordText.setOrigin(0.5);
    }

    private async readWordBySyllables() {
        this.isReading = true;
        this.readAllButton.setText("Читаю...");

        // Читаем по слогам с подсветкой
        for (let i = 0; i < this.syllables.length; i++) {
            this.highlightSyllable(i);
            this.highlightSyllableButton(i);
            await speak(this.syllables[i]);
            
            // Небольшая пауза между слогами
            await new Promise(resolve => {
                this.time.delayedCall(200, resolve);
            });
        }

        // Пауза перед произношением целого слова
        await new Promise(resolve => {
            this.time.delayedCall(500, resolve);
        });

        // Произносим слово целиком с особой подсветкой
        if (this.wordText) {
            this.wordText.destroy();
        }
        
        this.wordText = this.add.text(512, 250, this.word, {
            fontFamily: "Arial Black",
            fontSize: 72,
            color: "#2ecc71",
            stroke: "#27ae60",
            strokeThickness: 6,
        });
        this.wordText.setOrigin(0.5);

        await speak(this.word);

        // Возвращаем в исходное состояние
        await new Promise(resolve => {
            this.time.delayedCall(500, resolve);
        });

        this.resetWordHighlight();
        this.resetSyllableButtons();
        this.readAllButton.setText("Читать по слогам");
        this.isReading = false;
    }

    private highlightSyllableButton(syllableIndex: number) {
        // Сбрасываем все кнопки в обычное состояние
        this.syllableBackgrounds.forEach((bg, index) => {
            if (index !== syllableIndex) {
                bg.setFillStyle(0x3498db, 0.8);
                bg.setStrokeStyle(3, 0x2980b9);
            }
        });

        // Подсвечиваем активную кнопку
        const activeBg = this.syllableBackgrounds[syllableIndex];
        activeBg.setFillStyle(0xf39c12, 1);
        activeBg.setStrokeStyle(4, 0xe67e22);

        // Анимация пульсации для кнопки
        this.tweens.add({
            targets: activeBg,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 150,
            yoyo: true,
            ease: 'Power2'
        });
    }

    private resetSyllableButtons() {
        this.syllableBackgrounds.forEach((bg) => {
            bg.setFillStyle(0x3498db, 0.8);
            bg.setStrokeStyle(3, 0x2980b9);
            bg.setScale(1);
        });
    }

    changeScene() {
        this.scene.start("MainMenu");
    }
}

