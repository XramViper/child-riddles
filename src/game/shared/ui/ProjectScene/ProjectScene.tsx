import { Scene } from "phaser";
import { AVAILABLE_SCENES } from "./project.config";

export class ProjectScene extends Scene {
    constructor(sceneName: AVAILABLE_SCENES) {
        super(sceneName);
    }
}

