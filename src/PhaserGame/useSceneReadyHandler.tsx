import { EventBus } from "../game/EventBus";
import { useEffect, ForwardedRef } from "react";
import { PhaserGameContainerRef } from "./types";

export const useSceneReadyHandler = (
    game: Phaser.Game | null,
    phaserContainerRef: ForwardedRef<PhaserGameContainerRef>,
    handleUpdateActiveScene: (sceneInstance: Phaser.Scene) => void
) => {
    useEffect(() => {
        EventBus.on("current-scene-ready", (sceneInstance: Phaser.Scene) => {
            handleUpdateActiveScene(sceneInstance);

            if (typeof phaserContainerRef === "function") {
                phaserContainerRef({
                    game: game,
                    scene: sceneInstance,
                });
            } else if (phaserContainerRef) {
                phaserContainerRef.current = {
                    game: game,
                    scene: sceneInstance,
                };
            }
        });
        return () => {
            EventBus.removeListener("current-scene-ready");
        };
    }, [handleUpdateActiveScene]);
};

