import numpy as np
import pandas as pd
import os
import datetime

CSV_DIR = "./csv"
FILENAMES = os.listdir(CSV_DIR)
DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%f"


def load_timestamps(filename):
    data_frame = pd.read_csv(os.path.join(CSV_DIR, filename))
    timestamps = data_frame["timestamp"]
    del data_frame

    return timestamps, filename


def validate_timestamps(tstps):
    timestamps = np.array(tstps)
    deltas = []
    for index in range(len(timestamps)-1):
        current = datetime.datetime.strptime(timestamps[index], DATETIME_FORMAT)
        next = datetime.datetime.strptime(timestamps[index+1], DATETIME_FORMAT)
        delta = next - current

        #print(f"{next} - {current} = {delta}")
        # print(delta.total_seconds())
        if(delta.total_seconds() > 2 or delta.total_seconds() < 0.5):
            print(f"{next} - {current} = {delta}")
            pass

        deltas.append(delta.total_seconds())

    arr = np.array(deltas)
    #print(f"{np.max(arr)} at index {np.argmax(arr)}")
    print(np.where(arr > 2))


def main():
    for filename in FILENAMES:
        timestamps, filename = load_timestamps(filename)
        print(f"Validating file {filename}")
        validate_timestamps(timestamps)


if __name__ == "__main__":
    main()
