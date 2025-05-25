export function speak(text: string): Promise<void> {
    return new Promise((resolve) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        utterance.onend = () => {
            resolve();
        };

        utterance.onerror = () => {
            resolve(); // Resolve даже при ошибке, чтобы не блокировать выполнение
        };

        synth.speak(utterance);
    });
}
