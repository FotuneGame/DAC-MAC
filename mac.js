const securityLevels = ["Открытые данные", "Секретно", "Совершенно секретно"];

const users = ["Ivan", "Sergey", "Boris", "Anna"];
const objects = ["Obj1", "Obj2", "Obj3"];

const objectSecurity = {};
const userAccess = {};

for (const obj of objects) {
    objectSecurity[obj] = securityLevels[Math.floor(Math.random() * securityLevels.length)];
}
for (const user of users) {
    userAccess[user] = securityLevels[Math.floor(Math.random() * securityLevels.length)];
}

function printSecurityLevels() {
    console.log("Уровни конфиденциальности объектов (OV):");
    for (const obj of objects) {
        console.log(`${obj}: ${objectSecurity[obj]}`);
    }
    console.log("\nУровни допуска пользователей (UV):");
    for (const user of users) {
        console.log(`${user}: ${userAccess[user]}`);
    }
}

function checkAccess(user) {
    if (user in userAccess) {
        const userLevel = securityLevels.indexOf(userAccess[user]);
        console.log(`\nUser: ${user}`);
        console.log("Идентификация прошла успешно, добро пожаловать в систему.");
        console.log("Перечень доступных объектов:");

        const availableObjects = [];
        for (const obj of objects) {
            const objectLevel = securityLevels.indexOf(objectSecurity[obj]);
            if (userLevel >= objectLevel) {
                availableObjects.push(obj);
            }
        }

        if (availableObjects.length > 0) {
            console.log(availableObjects.join(", "));
        } else {
            console.log("Нет доступных объектов.");
        }
    } else {
        console.log("Идентификация не удалась. Неверный пользователь.");
    }
}

function systemInteraction(rl) {
    rl.question("\nВведите имя пользователя: ", (user) => {
        user = user.trim();
        checkAccess(user);

        function waitForCommand() {
            rl.question("Жду ваших указаний > ", (command) => {
                command = command.trim().toLowerCase();
                if (command === "quit") {
                    console.log(`Работа пользователя ${user} завершена. До свидания.`);
                    systemInteraction(rl);
                } else if (command === "request") {
                    rl.question("К какому объекту хотите осуществить доступ? ", (obj) => {
                        obj = obj.trim();
                        if (!objects.includes(obj)) {
                            console.log("Такого объекта не существует.");
                            return waitForCommand();
                        }

                        const userLevel = securityLevels.indexOf(userAccess[user]);
                        const objectLevel = securityLevels.indexOf(objectSecurity[obj]);
                        if (userLevel >= objectLevel) {
                            console.log(`Операция прошла успешно. Доступ к ${obj} предоставлен.`);
                        } else {
                            console.log(`Отказ в выполнении операции. Недостаточно прав для ${obj}.`);
                        }
                        waitForCommand();
                    });
                } else {
                    console.log("Неверная команда. Введите 'request' для запроса доступа или 'quit' для выхода.");
                    waitForCommand();
                }
            });
        }

        waitForCommand();
    });
}

function start(rl) {
    printSecurityLevels();
    systemInteraction(rl);
}

module.exports = { start };