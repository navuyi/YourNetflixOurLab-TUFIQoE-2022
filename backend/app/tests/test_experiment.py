import json
from .utils import headers


def test_experiment_post(client):
    data = {
        "started": "2022-05-30T12:09:54",
        "tester_id": "666912077",
        "settings": '{"bitrate_interval":300,"assessment_interval":150,"description":"","title":"This is my config for development purposes - Breaking bad","videos":[{"bitrate_vmaf_map":[{"bitrate":80,"vmaf":36},{"bitrate":100,"vmaf":43},{"bitrate":134,"vmaf":51},{"bitrate":211,"vmaf":62},{"bitrate":333,"vmaf":71},{"bitrate":592,"vmaf":80},{"bitrate":1034,"vmaf":86},{"bitrate":2038,"vmaf":90},{"bitrate":2702,"vmaf":91},{"bitrate":3950,"vmaf":92}],"description":"Lorem ipsum1","name":"Breaking bad","scenario":[{"bitrate":80,"vmaf":36,"vmaf_diff":11,"vmaf_template":25},{"bitrate":3950,"vmaf":92,"vmaf_diff":3,"vmaf_template":95},{"bitrate":211,"vmaf":62,"vmaf_diff":3,"vmaf_template":65},{"bitrate":80,"vmaf":36,"vmaf_diff":11,"vmaf_template":25},{"bitrate":592,"vmaf":80,"vmaf_diff":0,"vmaf_template":80},{"bitrate":3950,"vmaf":92,"vmaf_diff":3,"vmaf_template":95}],"url":"https://www.netflix.com/watch/70196262","vmaf_template_scenario":[25,95,65,25,80,95]},{"bitrate_vmaf_map":[{"bitrate":87,"vmaf":41},{"bitrate":107,"vmaf":47},{"bitrate":153,"vmaf":57},{"bitrate":237,"vmaf":68},{"bitrate":365,"vmaf":76},{"bitrate":636,"vmaf":84},{"bitrate":1039,"vmaf":88},{"bitrate":1998,"vmaf":92},{"bitrate":2655,"vmaf":93},{"bitrate":3896,"vmaf":94}],"description":"Lorem ipsum2","name":"Breaking bad","scenario":[{"bitrate":153,"vmaf":57,"vmaf_diff":3,"vmaf_template":60},{"bitrate":3896,"vmaf":94,"vmaf_diff":1,"vmaf_template":95},{"bitrate":636,"vmaf":84,"vmaf_diff":1,"vmaf_template":85},{"bitrate":87,"vmaf":41,"vmaf_diff":11,"vmaf_template":30},{"bitrate":3896,"vmaf":94,"vmaf_diff":1,"vmaf_template":95}],"url":"https://www.netflix.com/watch/70196263?trackId=200257858","vmaf_template_scenario":[60,95,85,30,95]},{"bitrate_vmaf_map":[{"bitrate":80,"vmaf":37},{"bitrate":100,"vmaf":44},{"bitrate":132,"vmaf":52},{"bitrate":203,"vmaf":63},{"bitrate":313,"vmaf":71},{"bitrate":543,"vmaf":80},{"bitrate":955,"vmaf":86},{"bitrate":1960,"vmaf":89},{"bitrate":2630,"vmaf":90},{"bitrate":3891,"vmaf":91}],"description":"Lorem ipsum3","name":"Breaking bad","scenario":[{"bitrate":203,"vmaf":63,"vmaf_diff":3,"vmaf_template":60},{"bitrate":203,"vmaf":63,"vmaf_diff":2,"vmaf_template":65},{"bitrate":313,"vmaf":71,"vmaf_diff":1,"vmaf_template":70},{"bitrate":543,"vmaf":80,"vmaf_diff":0,"vmaf_template":80},{"bitrate":2630,"vmaf":90,"vmaf_diff":0,"vmaf_template":90},{"bitrate":3891,"vmaf":91,"vmaf_diff":4,"vmaf_template":95}],"url":"https://www.netflix.com/watch/70196264","vmaf_template_scenario":[60,65,70,80,90,95]}]}',
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


def test_experiment_patch(client):
    data = {
        "experiment_id": 1,
        "ended": "2023-05-30T19:00:00",
    }

    # This works fine, just like the javascript object
    res = client.patch("/experiment/", data=json.dumps(data), headers=headers)
    data = json.loads(res.data)

    assert res.status_code == 201
    