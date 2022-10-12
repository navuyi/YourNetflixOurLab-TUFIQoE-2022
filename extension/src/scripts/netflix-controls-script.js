const seek_element = document.createElement('div');
seek_element.id = "seek_element";
seek_element.addEventListener('click', () => {
    const newTime = Number(document.getElementById('seek_element').getAttribute('timestamp')) * 1000;
    const videoPlayer = window.netflix.appContext.state.playerApp.getAPI().videoPlayer;
    const player = videoPlayer.getVideoPlayerBySessionId(videoPlayer.getAllPlayerSessionIds()[0]);
    player.seek(newTime);
});
(document.body).appendChild(seek_element);

