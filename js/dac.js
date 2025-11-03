const permissionsDict = {
    0: "Полный запрет",
    1: "Передача прав",
    2: "Запись",
    3: "Запись, Передача прав",
    4: "Чтение",
    5: "Чтение, Передача прав",
    6: "Чтение, Запись",
    7: "Полный доступ"
};

const users = ["Ivan", "Sergey", "Boris", "Anna"];
const objects = ["Obj1", "Obj2", "Obj3", "Obj4"];

const adminUser = users[Math.floor(Math.random() * users.length)];

const userPermissions = {};
for (const user of users) {
    userPermissions[user] = {};
    for (const obj of objects) {
        userPermissions[user][obj] = Math.floor(Math.random() * 8);
    }
}
for (const obj of objects) {
    userPermissions[adminUser][obj] = 7;
}

function printAccessMatrix() {
    console.log("\nМатрица прав доступа:");
    const header = " ".repeat(20) + objects.map(obj => obj.padEnd(25)).join("");
    console.log(header);
    console.log("-".repeat(header.length));
    for (const user of users) {
        const row = user.padEnd(20) + objects.map(obj =>
            permissionsDict[userPermissions[user][obj]].padEnd(25)
        ).join("");
        console.log(row);
    }
}

function checkUserPermissions(user) {
    if (user in userPermissions) {
        console.log(`\nUser: ${user}`);
        console.log("Идентификация прошла успешно, добро пожаловать в систему");
        console.log("Перечень Ваших прав:");
        for (const obj of objects) {
            console.log(`${obj}: ${permissionsDict[userPermissions[user][obj]]}`);
        }
    } else {
        console.log("Идентификация не удалась. Неверный пользователь.");
    }
}

function canPerformAction(user, action, obj) {
    const perms = userPermissions[user][obj];
    if (action === "read") return (perms & 4) !== 0;
    if (action === "write") return (perms & 2) !== 0;
    if (action === "grant") return (perms & 1) !== 0;
    return false;
}

function handleGrant(rl, user, callback) {
    if (!canPerformAction(user, "grant", objects[0])) {
        console.log("Отказ в выполнении операции. У Вас нет прав для ее осуществления");
        return callback();
    }

    rl.question("Право на какой объект передается? ", (obj) => {
        obj = obj.trim();
        if (!objects.includes(obj)) {
            console.log("Неверный объект.");
            return callback();
        }
        if (!canPerformAction(user, "grant", obj)) {
            console.log("Отказ в выполнении операции. У Вас нет прав для ее осуществления");
            return callback();
        }

        rl.question("Какое право передается? (read, write, grant) ", (permission) => {
            permission = permission.trim().toLowerCase();
            if (!["read", "write", "grant"].includes(permission)) {
                console.log("Неверное право.");
                return callback();
            }

            rl.question("Какому пользователю передается право? ", (recipient) => {
                recipient = recipient.trim();
                if (!users.includes(recipient)) {
                    console.log("Неверный пользователь.");
                    return callback();
                }

                const permissionBits = { read: 4, write: 2, grant: 1 };
                const newPerm = userPermissions[recipient][obj] | permissionBits[permission];
                userPermissions[recipient][obj] = newPerm;
                console.log("Операция прошла успешно");
                callback();
            });
        });
    });
}

function systemInteraction(rl) {
    rl.question("\nВведите имя пользователя: ", (user) => {
        user = user.trim();
        if (!users.includes(user)) {
            console.log("Неверный пользователь.");
            return systemInteraction(rl);
        }

        checkUserPermissions(user);

        function waitForCommand() {
            rl.question("Жду ваших указаний > ", (command) => {
                command = command.trim().toLowerCase();
                if (command === "quit") {
                    console.log(`Работа пользователя ${user} завершена. До свидания.`);
                    systemInteraction(rl);
                } else if (["read", "write"].includes(command)) {
                    rl.question("Над каким объектом производится операция? ", (obj) => {
                        obj = obj.trim();
                        if (!objects.includes(obj)) {
                            console.log("Неверный объект.");
                            return waitForCommand();
                        }
                        if (canPerformAction(user, command, obj)) {
                            console.log("Операция прошла успешно");
                        } else {
                            console.log("Отказ в выполнении операции. У Вас нет прав для ее осуществления");
                        }
                        waitForCommand();
                    });
                } else if (command === "grant") {
                    handleGrant(rl, user, waitForCommand);
                } else {
                    console.log("Неверная команда. Введите 'quit' для выхода.");
                    waitForCommand();
                }
            });
        }

        waitForCommand();
    });
}

// Экспорт функции запуска с передачей rl
function start(rl) {
    console.log(`Администратор: ${adminUser}`);
    printAccessMatrix();
    systemInteraction(rl);
}

module.exports = { start };