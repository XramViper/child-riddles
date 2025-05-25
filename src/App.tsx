import { useCallback, useRef, useState } from "react";
import { PhaserGameContainerRef, PhaserGame } from "./PhaserGame";
import { SceneController } from "./examples/SceneController";

function App() {
    // The sprite can only be moved in the MainMenu Scene
    const [canMoveSprite, setCanMoveSprite] = useState(true);

    //  References to the PhaserGame component (game and scene are exposed)
    const phaserRef = useRef<PhaserGameContainerRef | null>(null);

    // Event emitted from the PhaserGame component
    const onUpdateActiveScene = useCallback((scene: Phaser.Scene) => {
        setCanMoveSprite(scene.scene.key !== "MainMenu");
    }, []);

    return (
        <div id="app">
            <PhaserGame
                ref={phaserRef}
                handleUpdateActiveScene={onUpdateActiveScene}
            />

            <SceneController ref={phaserRef} canMoveSprite={canMoveSprite} />
        </div>
    );
}

export default App;
