import { Boot } from "./pages/Boot";
import { MainMenu } from "./pages/MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./pages/Preloader";
import { RiddlesGameArea } from "./pages/RiddlesGameArea/RiddlesGameArea";
import { WordReader } from "./pages/WordReader/WordReader";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: "game-container",
    backgroundColor: "#028af8",
    scene: [Boot, Preloader, RiddlesGameArea, WordReader, MainMenu],
};

const StartGame = (parent: string) => {
    return new Game({ ...config, parent });
};

export default StartGame;
