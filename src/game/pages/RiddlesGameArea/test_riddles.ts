import { RiddleConfigItem } from "./types/Riddle";

export const testRiddles: RiddleConfigItem[] = [
    {
        id: "1",
        riddle: "Висит груша, нельзя скушать",
        answer: "лампочка",
        spriteInfo: {
            id: "1",
            sprite: "lamp",
            position: {
                x: 100,
                y: 100,
            },
        },
    },

    {
        id: "2",
        riddle: "Вторая загадка",
        answer: "Ответ 2",
        spriteInfo: {
            id: "2",
            sprite: "lamp",
            position: {
                x: 300,
                y: 300,
            },
        },
    },
    {
        id: "3",
        riddle: "Третья загадка",
        answer: "Ответ 3",
        spriteInfo: {
            id: "3",
            sprite: "lamp",
            position: {
                x: 500,
                y: 500,
            },
        },
    },

    {
        id: "4",
        riddle: "Четвертая загадка",
        answer: "Ответ 4",
        spriteInfo: {
            id: "4",
            sprite: "lamp",
            position: {
                x: 700,
                y: 700,
            },
        },
    },
];

