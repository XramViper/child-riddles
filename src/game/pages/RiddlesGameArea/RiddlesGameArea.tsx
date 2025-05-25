import { EventBus } from "../../EventBus";
import { ProjectScene } from "../../shared";
import { AVAILABLE_SCENES } from "../../shared/ui/ProjectScene/project.config";

export class RiddlesGameArea extends ProjectScene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;

    constructor() {
        super(AVAILABLE_SCENES.RiddlesGameArea);
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor({ r: 255, g: 0, b: 0 });

        this.background = this.add.image(512, 384, "background");
        this.background.setAlpha(0.5);

        this.gameOverText = this.add
            .text(512, 384, "RiddlesGameArea", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("MainMenu");
    }
}

