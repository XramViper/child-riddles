import { ForwardedRef, forwardRef, useRef } from "react";
import { useGameInitiator } from "./useGameInitiator";
import { PhaserGameContainerRef } from "./types";
import { useSceneReadyHandler } from "./useSceneReadyHandler";

type Props = {
    handleUpdateActiveScene: (sceneInstance: Phaser.Scene) => void;
};

function PhaserGameComponent(
    props: Props,
    phaserContainerRef: ForwardedRef<PhaserGameContainerRef>
) {
    const { handleUpdateActiveScene } = props;

    const game = useRef<Phaser.Game | null>(null!);

    useGameInitiator(game.current, phaserContainerRef);

    useSceneReadyHandler(
        game.current,
        phaserContainerRef,
        handleUpdateActiveScene
    );

    return <div id="game-container"></div>;
}

export const PhaserGame = forwardRef<PhaserGameContainerRef, Props>(
    PhaserGameComponent
);
