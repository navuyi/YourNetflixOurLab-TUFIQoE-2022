import json
from tkinter import N
from .utils import headers


def test_experiment_post(client):
    data = {
        "started": "2022-05-30T12:09:54",
        "device_id": "106",
        "experiment_type": "alone",
        "video_limit": 3,
        "tester_id": "666912077",
        "urls": [
            "https://www.youtube.com/watch?v=gkvs2MA1cBo",
            "https://www.youtube.com/watch?v=JY-WHSDjb28",
            "https://www.youtube.com/watch?v=PB2UbKYaUcg"
        ]
    }

    # This works fine, just like the javascript object
    res = client.post("/experiment/", data=json.dumps(data), headers=headers)
    data = json.loads(res.data)
    print(data)

    assert res.status_code == 201
    assert data["experiment_id"]
