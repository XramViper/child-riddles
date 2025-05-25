import { EventBus } from "../../EventBus";
import { ProjectScene, speak } from "../../shared";
import { AVAILABLE_SCENES } from "../../shared/ui/ProjectScene/project.config";
import { syllabifyWord } from "./utils/syllabify";

export class WordReader extends ProjectScene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    word: string;
    letters: string[];
    syllables: string[];

    constructor() {
        super(AVAILABLE_SCENES.WordReader);
    }

    init(data: { word: string }) {
        this.word = data.word;
        this.letters = this.word.split("");
        this.syllables = syllabifyWord(this.word, { separator: "·" }).split(
            "·"
        );
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        this.createBackground();
        this.createWord();
        this.goBackButton();
        this.createButtonToReadWordBySyllables();

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("MainMenu");
    }

    private createBackground() {
        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(0.5);
    }

    private createWord() {
        const word = this.add.text(512, 384, this.word, {
            fontFamily: "Arial Black",
            fontSize: 64,
            color: "#ffffff",
        });
    }

    private goBackButton() {
        const button = this.add.text(0, 0, "Back", {
            fontFamily: "Arial Black",
            fontSize: 32,
            color: "#ffffff",
        });

        button.setInteractive();
        button.on("pointerdown", () => {
            this.scene.start(AVAILABLE_SCENES.RiddlesGameArea);
        });
    }

    private createButtonToReadWordBySyllables() {
        const { syllables } = this;

        const button = this.add.text(0, 100, "Read by syllables", {
            fontFamily: "Arial Black",
            fontSize: 32,
            color: "#ffffff",
        });

        button.setInteractive();
        button.on("pointerdown", () => {
            syllables.forEach((syllable) => {
                speak(syllable);
            });
        });
    }
}

