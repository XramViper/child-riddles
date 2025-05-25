import { ForwardedRef, useLayoutEffect } from "react";
import StartGame from "../game/main";
import { PhaserGameContainerRef } from "./types";

export const useGameInitiator = (
    game: Phaser.Game | null,
    phaserContainerRef: ForwardedRef<PhaserGameContainerRef>
) => {
    useLayoutEffect(() => {
        if (game === null) {
            game = StartGame("game-container");

            if (typeof phaserContainerRef === "function") {
                phaserContainerRef({ game: game, scene: null });
            } else if (phaserContainerRef) {
                phaserContainerRef.current = {
                    game: game,
                    scene: null,
                };
            }
        }

        return () => {
            if (game) {
                game.destroy(true);
                if (game !== null) {
                    game = null;
                }
            }
        };
    }, [phaserContainerRef]);
};

