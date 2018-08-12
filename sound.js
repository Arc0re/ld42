class SoundManager {
  constructor(soundUrls, onComplete) {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;

    this.VOLUME = 0.2; // 20%
    this.context = new window.AudioContext();
    this.gainNode = this.context.createGain();
    this.gainNode.gain.value = this.VOLUME;
    this.gainNode.connect(this.context.destination);
    this.soundUrls = soundUrls;
    this.buffers = [];
    this.onCompleteCallback = onComplete;
    this.loadCount = 0; // when its done, callback
  }

  loadBufferAsync(url, index, name) {
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
            //_this.buffers[index] = buffer;
            _this.buffers[index] = {buffer: buffer, name: name, index: index};
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
      var name = url.split('/')[1].replace('.wav', '');
      this.loadBufferAsync(url, i, name);
    }
  }

  play(soundName) {
    if (!soundsLoaded) return;
    var data = this.buffers.find(obj => { return obj.name === soundName; });
    var source = this.context.createBufferSource();
    source.buffer = data.buffer;
    source.connect(this.gainNode);
    source.start(0);
  }
}