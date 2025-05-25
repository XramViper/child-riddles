import { EventBus } from "../../EventBus";
import { ProjectScene } from "../../shared";
import { AVAILABLE_SCENES } from "../../shared/ui/ProjectScene/project.config";
import { testRiddles } from "./test_riddles";
import { RiddleConfigItem } from "./types/Riddle";
export class RiddlesGameArea extends ProjectScene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    currentRiddleId: RiddleConfigItem["id"];
    answeredRiddles: RiddleConfigItem["id"][];
    readonly riddles: RiddleConfigItem[];

    constructor() {
        super(AVAILABLE_SCENES.RiddlesGameArea);
        this.riddles = testRiddles;
        this.currentRiddleId = this.riddles[0].id;
        this.answeredRiddles = [];
    }

    init() {
        if (this.isAllRiddlesAnswered()) {
            this.handleAllRiddlesAnswered();
            return;
        }
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor({ r: 255, g: 0, b: 0 });

        this.createBackground();
        this.createRiddles();

        console.log(this.currentRiddleId);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("MainMenu");
    }

    private createBackground() {
        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(0.5);
    }

    private createRiddles() {
        this.riddles.forEach((riddle) => {
            const riddleSprite = this.createRiddleSprite(riddle);
            riddleSprite.setInteractive();
            riddleSprite.on("pointerdown", () => {
                if (!this.isRiddleCorrect(riddle)) {
                    return;
                }
                this.successRiddleClick(riddle);
            });
        });
    }

    private successRiddleClick(riddle: RiddleConfigItem) {
        this.answeredRiddles.push(riddle.id);
        console.log(this.answeredRiddles);
        this.chooseNextRiddle();
        this.navigateToWordReader(riddle.answer);
    }

    private chooseNextRiddle() {
        const nextRiddle = this.riddles.find(
            (riddle) => !this.answeredRiddles.includes(riddle.id)
        );

        if (!nextRiddle) {
            return;
        }

        this.currentRiddleId = nextRiddle.id;
    }

    private isAllRiddlesAnswered() {
        return this.answeredRiddles.length >= this.riddles.length;
    }
    private handleAllRiddlesAnswered() {
        this.scene.start(AVAILABLE_SCENES.WordReader, {
            word: "All riddles answered",
        });
    }

    private isRiddleCorrect(riddle: RiddleConfigItem) {
        return this.currentRiddleId === riddle.id;
    }

    private createRiddleSprite(riddle: RiddleConfigItem) {
        const { x, y } = riddle.spriteInfo.position;
        const riddleItem = this.add.rectangle(x, y, 100, 100, 0xff0000);
        return riddleItem;
    }

    private navigateToWordReader(word: string) {
        this.scene.start(AVAILABLE_SCENES.WordReader, { word });
    }
}

