import json
from .utils import headers


def test_video_post(client):
    data = {
        "started": "2022-05-30T12:09:54",
        "experiment_id": 2,
        "url": "https://www.youtube.com/watch?v=gkvs2MA1cBo"
    }

    # This works fine, just like the javascript object
    res = client.post("/video/", data=json.dumps(data), headers=headers)
    print(json.loads(res.data))
    assert res.status_code == 201


def test_video_update(client):
    data = dict(
        ended="2022-06-09T17:05:47.277",
        video_id=1
    )
    res = client.patch("/video/", data=json.dumps(data), headers=headers)
    print(json.loads(res.data))
    assert res.status_code == 201
