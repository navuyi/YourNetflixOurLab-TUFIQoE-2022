
import matplotlib.pyplot as plt
import os
import csv
import pandas as pd
from uuid import uuid4


CSV_DIR = "./csv"
FILES = os.listdir(CSV_DIR)


def load_data(filename, key):
    data_frame = pd.read_csv(os.path.join(CSV_DIR, filename))
    data = data_frame[key]
    del data_frame

    return data


def plot_01(bitrate, vmaf):
    #plt.plot(bitrate, color='r', label='bitrate')
    #plt.plot(vmaf, color='b', label='vmaf')

    # plt.show()

    fig, ax1 = plt.subplots()

    color = 'tab:red'
    ax1.set_xlabel('N')
    ax1.set_ylabel('bitrate', color=color)
    ax1.plot(bitrate, color=color)
    ax1.tick_params(axis='y', labelcolor=color)

    ax2 = ax1.twinx()  # instantiate a second axes that shares the same x-axis

    color = 'tab:blue'
    ax2.set_ylabel('vmaf', color=color)  # we already handled the x-label with ax1
    ax2.plot(vmaf, color=color)
    ax2.tick_params(axis='y', labelcolor=color)

    fig.tight_layout()  # otherwise the right y-label is slightly clipped
    plt.show()
    # plt.savefig(f"{bitrate[150]}.png")


def plot_02(bitrate, playing_vmaf, buffering_vmaf, video_id):
    figure, axis = plt.subplots(3, 1)
    figure.tight_layout(pad=2.0)
    axis[0].plot(bitrate, color='red')
    axis[0].set_title(f"Bitrate | Video ID: {video_id}")

    axis[1].plot(playing_vmaf, color='blue')
    axis[1].set_title("Playing vmaf")

    axis[2].plot(buffering_vmaf, color='green')
    axis[2].set_title("Buffering vmaf")

    plt.savefig(f"{video_id}.png")
    plt.show()


def main():
    for filename in FILES:
        bitrate = load_data(filename, "playing_bitrate_video")
        playing_vmaf = load_data(filename, "playing_vmaf")
        buffering_vmaf = load_data(filename, "buffering_vmaf")
        video_id = load_data(filename, "video_id")[0]
        plot_02(bitrate, playing_vmaf, buffering_vmaf, video_id)


if __name__ == "__main__":
    main()
