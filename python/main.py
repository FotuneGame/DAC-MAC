import random

# ========================
# ДИСКРЕЦИОННАЯ МОДЕЛЬ (DAC)
# ========================

permissions_dict = {
    0: "Полный запрет",
    1: "Передача прав",
    2: "Запись",
    3: "Запись, Передача прав",
    4: "Чтение",
    5: "Чтение, Передача прав",
    6: "Чтение, Запись",
    7: "Полный доступ"
}

def run_dac():
    users = ["Ivan", "Sergey", "Boris", "Anna"]  # 4 пользователя
    objects = ["Obj1", "Obj2", "Obj3", "Obj4"]  # 4 объекта

    admin_user = random.choice(users)
    print(f"Администратор: {admin_user}")

    # Инициализация матрицы доступа
    user_permissions = {}
    for user in users:
        user_permissions[user] = {}
        for obj in objects:
            user_permissions[user][obj] = random.randint(0, 7)
    # Админ — полные права
    for obj in objects:
        user_permissions[admin_user][obj] = 7

    def print_access_matrix():
        print("\nМатрица прав доступа:")
        header = " " * 20 + "".join(f"{obj:<25}" for obj in objects)
        print(header)
        print("-" * len(header))
        for user in users:
            row = f"{user:<20}" + "".join(
                f"{permissions_dict[user_permissions[user][obj]]:<25}" for obj in objects
            )
            print(row)

    def check_user_permissions(user):
        if user in user_permissions:
            print(f"\nUser: {user}")
            print("Идентификация прошла успешно, добро пожаловать в систему")
            print("Перечень Ваших прав:")
            for obj in objects:
                print(f"{obj}: {permissions_dict[user_permissions[user][obj]]}")
        else:
            print("Идентификация не удалась. Неверный пользователь.")

    def can_perform_action(user, action, obj):
        perms = user_permissions[user][obj]
        if action == "read":
            return (perms & 4) != 0
        elif action == "write":
            return (perms & 2) != 0
        elif action == "grant":
            return (perms & 1) != 0
        return False

    def handle_grant(user):
        # Проверка наличия права передачи хотя бы на один объект (упрощённо)
        if not any(can_perform_action(user, "grant", obj) for obj in objects):
            print("Отказ в выполнении операции. У Вас нет прав для ее осуществления")
            return

        obj = input("Право на какой объект передается? ").strip()
        if obj not in objects:
            print("Неверный объект.")
            return

        if not can_perform_action(user, "grant", obj):
            print("Отказ в выполнении операции. У Вас нет прав для ее осуществления")
            return

        permission = input("Какое право передается? (read, write, grant) ").strip().lower()
        if permission not in ["read", "write", "grant"]:
            print("Неверное право.")
            return

        recipient = input("Какому пользователю передается право? ").strip()
        if recipient not in users:
            print("Неверный пользователь.")
            return

        permission_bits = {"read": 4, "write": 2, "grant": 1}
        new_perm = user_permissions[recipient][obj] | permission_bits[permission]
        user_permissions[recipient][obj] = new_perm
        print("Операция прошла успешно")

    def system_interaction():
        while True:
            user = input("\nВведите имя пользователя: ").strip()
            if user not in users:
                print("Неверный пользователь.")
                continue

            check_user_permissions(user)

            while True:
                command = input("Жду ваших указаний > ").strip().lower()
                if command == "quit":
                    print(f"Работа пользователя {user} завершена. До свидания.")
                    return
                elif command in ["read", "write"]:
                    obj = input("Над каким объектом производится операция? ").strip()
                    if obj not in objects:
                        print("Неверный объект.")
                        continue
                    if can_perform_action(user, command, obj):
                        print("Операция прошла успешно")
                    else:
                        print("Отказ в выполнении операции. У Вас нет прав для ее осуществления")
                elif command == "grant":
                    handle_grant(user)
                else:
                    print("Неверная команда. Введите 'quit' для выхода.")

    # Запуск DAC
    print_access_matrix()
    system_interaction()


# ========================
# МАНДАТНАЯ МОДЕЛЬ (MAC)
# ========================

def run_mac():
    security_levels = ["Открытые данные", "Секретно", "Совершенно секретно"]

    # Увеличено количество пользователей (как в JS-коде)
    users = ["Ivan", "Sergey", "Boris", "Anna", "Vlad", "Max", "Grisha", "Anton", "Evgeny", "Olga"]
    objects = ["Obj1", "Obj2", "Obj3"]

    object_security = {obj: random.choice(security_levels) for obj in objects}
    user_access = {user: random.choice(security_levels) for user in users}

    def print_security_levels():
        print("Уровни конфиденциальности объектов (OV):")
        for obj, level in object_security.items():
            print(f"{obj}: {level}")
        print("\nУровни допуска пользователей (UV):")
        for user, level in user_access.items():
            print(f"{user}: {level}")

    def check_access(user):
        if user in user_access:
            user_level = security_levels.index(user_access[user])
            print(f"\nUser: {user}")
            print("Идентификация прошла успешно, добро пожаловать в систему.")
            print("Перечень доступных объектов:")

            available_objects = []
            for obj, level in object_security.items():
                object_level = security_levels.index(level)
                if user_level >= object_level:
                    available_objects.append(obj)

            if available_objects:
                print(", ".join(available_objects))
            else:
                print("Нет доступных объектов.")
        else:
            print("Идентификация не удалась. Неверный пользователь.")

    def system_interaction():
        while True:
            user = input("\nВведите имя пользователя: ").strip()
            check_access(user)

            while True:
                command = input("Жду ваших указаний > ").strip().lower()
                if command == "quit":
                    print(f"Работа пользователя {user} завершена. До свидания.")
                    return
                elif command == "request":
                    obj = input("К какому объекту хотите осуществить доступ? ").strip()
                    if obj not in objects:
                        print("Такого объекта не существует.")
                        continue

                    user_level = security_levels.index(user_access[user])
                    object_level = security_levels.index(object_security[obj])
                    if user_level >= object_level:
                        print(f"Операция прошла успешно. Доступ к {obj} предоставлен.")
                    else:
                        print(f"Отказ в выполнении операции. Недостаточно прав для {obj}.")
                else:
                    print("Неверная команда. Введите 'request' для запроса доступа или 'quit' для выхода.")

    # Запуск MAC
    print_security_levels()
    system_interaction()


# ========================
# ГЛАВНОЕ МЕНЮ
# ========================

def main():
    while True:
        print("\nВыберите модель информационной безопасности для запуска:")
        print("1 — Дискреционная модель (DAC)")
        print("2 — Мандатная модель (MAC)")
        print("3 — Выход")

        choice = input("\nВаш выбор (1/2/3): ").strip()

        if choice == "1":
            print("\nЗапуск Дискреционной модели (DAC)...\n")
            run_dac()
        elif choice == "2":
            print("\nЗапуск Мандатной модели (MAC)...\n")
            run_mac()
        elif choice == "3":
            print("Выход из программы.")
            break
        else:
            print("Неверный выбор. Пожалуйста, введите 1, 2 или 3.")

if __name__ == "__main__":
    main()