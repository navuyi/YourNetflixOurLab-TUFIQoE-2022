import sqlite3
import shutil


def create_files():
    try:
        f = open("database.db", "x")
        f = open("database-backup.db", "x")
    except FileExistsError as E:
        print(E)


def confirm():
    """
    Ask user to enter Y or N (case-insensitive).
    :return: True if the answer is Y.
    :rtype: bool
    """
    try:
        answer = ""
        while answer not in ["y", "n"]:
            answer = input(
                "Are you sure to overwirte database file [Y/N]? ").lower()
        return answer == "y"
    except:
        print("")
        print("Aborting...")
        exit()


def backup_database(src_path, dst_path):
    # Create database file backup before making changes
    shutil.copy2(src_path, dst_path)


def init_database(db_path):
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        sql_file = open("init.sql")
        sql_as_string = sql_file.read()

        cursor.executescript(sql_as_string)
        cursor.close()
        conn.close()

    except sqlite3.Error as error:
        print("Error while connecting to sqlite", error)


def main():
    DATABASE_FILE = "./database.db"
    confirmed = confirm()
    if confirmed == False:
        print("Aborting...")
        return

    create_files()
    backup_database(DATABASE_FILE, "./database-backup.db")
    init_database(DATABASE_FILE)
    print("Database modified")


if __name__ == "__main__":
    main()
