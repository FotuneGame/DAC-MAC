const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function chooseModel() {
    console.log("\nВыберите модель информационной безопасности для запуска:");
    console.log("1 — Дискреционная модель (DAC)");
    console.log("2 — Мандатная модель (MAC)");
    console.log("3 — Выход");

    rl.question("\nВаш выбор (1/2/3): ", (choice) => {
        choice = choice.trim();

        if (choice === "1") {
            console.log("\nЗапуск Дискреционной модели (DAC)...\n");
            const dac = require('./dac.js');
            dac.start(rl);
        } else if (choice === "2") {
            console.log("\nЗапуск Мандатной модели (MAC)...\n");
            const mac = require('./mac.js');
            mac.start(rl);
        } else if (choice === "3") {
            console.log("Выход из программы.");
            rl.close();
        } else {
            console.log("Неверный выбор. Пожалуйста, введите 1, 2 или 3.");
            chooseModel();
        }
    });
}

// Обработка завершения
rl.on('close', () => {
    console.log("\nДо свидания!");
    process.exit(0);
});

// Старт
chooseModel();