import json
from tkinter import N
from .utils import headers


def test_bitrate_post(client):
    data = dict(
        video_id=1,
        value=3900,
        previous=1260,
        timestamp="2022-06-10T11:37:49.715"
    )

    # This works fine, just like the javascript object
    res = client.post("/bitrate/", data=json.dumps(data), headers=headers)
    data = json.loads(res.data)
    print(data)

    assert res.status_code == 201
