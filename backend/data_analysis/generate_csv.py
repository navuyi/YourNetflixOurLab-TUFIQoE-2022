import csv
import sqlite3
import os

DATABASE_PATH = "../database/database.db"
CSV_DIR_PATH = "./csv"


def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


def db_connect():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = dict_factory
    conn.isolation_level = None  # <-- Auto commit

    cursor = conn.cursor()
    return conn, cursor


def main():
    conn, cursor = db_connect()
    cursor.execute("SELECT * FROM video")
    videos = cursor.fetchall()

    for video in videos:
        # Get video's experiment data
        cursor.execute(f"SELECT tester_id FROM experiment WHERE id={video['experiment_id']}")
        exp_data = cursor.fetchall()[0]

        csv_filename = f"{exp_data['tester_id']}_videoID_{video['id']}.csv"

        # Get video playback data
        cursor.execute(f"SELECT * FROM playback_data WHERE video_id={video['id']}")
        playback_data = cursor.fetchall()

        keys = playback_data[0].keys()
        data = []

        for row in playback_data:
            values = row.values()
            data.append(values)

        with open(os.path.join(CSV_DIR_PATH, csv_filename), "w", encoding="UTF8", newline='') as f:
            writer = csv.writer(f)

            writer.writerow(keys)

            writer.writerows(data)


if __name__ == "__main__":
    main()
