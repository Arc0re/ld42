class SoundManager {
  constructor(urlList, onComplete) {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    this.context = new window.AudioContext();
    this.urls = urlList;
    this.buffers = [];
    this.onCompleteCallback = onComplete;
    this.loadCount = 0; // when its done, callback
  }

  loadBufferAsync(url, index) {
    var self = this;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer'; // binary

    request.onload = function () {
      if (request.status == 200) {
        self.context.decodeAudioData(
          request.response,
          function (buffer) {
            if (!buffer) {
              console.log("Error while decoding audio data: " + url);
              return;
            }
            self.buffers[index] = buffer;
            if (++self.loadCount === self.urls.length) self.onCompleteCallback(self.buffers);
          },
          function (error) {
            console.log("Error while loading audio data: ", error);
          }
        );
      } else {
        console.log("Failed to load sounds : " + request.statusText);
      }
    };

    request.onerror = function (error) {
      console.log("Error while loading audio data: ", error);
    };
    request.send();
  }

  loadAllSounds() {
    for (var i=0; i<this.urls.length; i++) {
      var url = this.urls[i];
      var soundName = url.split("/")[1].replace(".wav", "");
      console.log("loading " + soundName);
      this.loadBufferAsync(url, soundName);
    }
  }

  play(soundName) {
    var source = this.context.createBufferSource();
    source.buffer = this.buffers[soundName];
    source.connect(this.context.destination);
    source.start(0);
  }
}