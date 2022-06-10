import json
from .utils import headers


def test_assessment_post(client):

    data = dict(
        video_id=1,
        value=5,
        description="Znakomita",
        started="2022-06-10T11:32:05.215",
        timestamp="2022-06-10T11:37:49.715",
        duration=5.05
    )

    # This works fine, just like the javascript object
    res = client.post("/assessment/", data=json.dumps(data), headers=headers)
    print(json.loads(res.data))
    assert res.status_code == 201
