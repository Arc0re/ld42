class SoundManager {
  constructor(soundNames, onComplete) {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    this.context = new window.AudioContext();
    this.soundUrls = soundNames;
    this.buffers = [];
    this.onCompleteCallback = onComplete;
    this.loadCount = 0; // when its done, callback
  }

  loadBufferAsync(url, index) {
    var _this = this;
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer'; // binary

    request.onload = function () {
      if (request.status === 200) {
        _this.context.decodeAudioData(
          request.response,
          function (buffer) {
            if (!buffer) {
              console.log("Error while decoding audio data: " + url);
              return;
            }
            _this.buffers[index] = buffer;
            // _this.buffers.push(buffer);

            if (++_this.loadCount === _this.soundUrls.length) _this.onCompleteCallback(_this.buffers);
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
    for (var i=0; i<this.soundUrls.length; i++) {
      var url = this.soundUrls[i];
      this.loadBufferAsync(url, i);
    }
  }

  play(soundID) {
    var source = this.context.createBufferSource();
    source.buffer = this.buffers[soundID];
    source.connect(this.context.destination);
    source.start(0);
  }
}