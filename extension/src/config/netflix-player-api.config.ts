export const netflix_api_elements = {
    seek: {
        id: "netflix_seek",
        attribute: "seek_to",
        get: function(){return document.getElementById(this.id)}
    },
    current_time: {
        id: "netflix_current_time",
        attribute: "current_time",
        get: function(){return document.getElementById(this.id)}
    },
    duration: {
        id: "netflix_duration",
        attribute: "duration",
        get: function(){return document.getElementById(this.id)}
    }
}