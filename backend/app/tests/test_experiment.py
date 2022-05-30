import json
from .utils import headers


def test_experiment_post(client):
    data = {
        "raz": "Raaaz",
        "dwa": "dDWaaa"
    }
    
    # This works fine, just like the javascript object 
    res = client.post("/experiment/", data=json.dumps(data), headers=headers)
    print(json.loads(res.data)["raz"])
    assert res.status_code == 201

