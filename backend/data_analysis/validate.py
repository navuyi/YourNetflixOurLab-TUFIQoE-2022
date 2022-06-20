import numpy as np
import pandas as pd
import os
import datetime
import matplotlib.pyplot as plt
CSV_DIR = "./csv"
FILENAMES = os.listdir(CSV_DIR)
DATETIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%f"

MAX_TIMEDELTA = 1.5
MIN_TIMEDELTA = 0.5


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
        if(delta.total_seconds() > MAX_TIMEDELTA or delta.total_seconds() < MIN_TIMEDELTA):
            print(f"{next} - {current} = {delta}")
            pass

        deltas.append(delta.total_seconds())

    arr = np.array(deltas)
    return arr
    #print(f"{np.max(arr)} at index {np.argmax(arr)}")
    #print(np.where(arr > MAX_TIMEDELTA))
    #print(np.where(arr < MIN_TIMEDELTA))


def plot_deltas(arr):
    plt.plot(arr)
    plt.ylabel('N')
    plt.show()


def main():
    for filename in FILENAMES:
        timestamps, filename = load_timestamps(filename)
        print(f"Validating file {filename}")
        arr = validate_timestamps(timestamps)
        plot_deltas(arr)


if __name__ == "__main__":
    main()
