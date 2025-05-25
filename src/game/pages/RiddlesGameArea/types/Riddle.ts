export type RiddleConfigItem = {
    id: string;
    riddle: string;
    answer: string;
    spriteInfo: RiddleSpriteInfo;
};

export type RiddleSpriteInfo = {
    id: string;
    sprite: string;
    position: {
        x: number;
        y: number;
    };
};

