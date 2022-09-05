import { useState } from "react";


const useDeviceID = () => {

    const [deviceID, setDeviceID] = useState(1)



    return {
        deviceID,
        setDeviceID
    }
}

export default useDeviceID