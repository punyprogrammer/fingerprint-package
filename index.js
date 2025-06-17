// index.js
class SimpleFingerprint {
  constructor() {
    this.fingerprint = {};
  }

  // Get basic browser information
  getBrowserInfo() {
    const ua = navigator.userAgent;
    return {
      userAgent: ua,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
    };
  }

  // Get screen information
  getScreenInfo() {
    return {
      screenWidth: screen.width,
      screenHeight: screen.height,
      availWidth: screen.availWidth,
      availHeight: screen.availHeight,
      colorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
    };
  }

  // Get timezone information
  getTimezoneInfo() {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
    };
  }

  // Get canvas fingerprint (basic)
  getCanvasFingerprint() {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 200;
      canvas.height = 50;

      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("Fingerprint test", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("Fingerprint test", 4, 17);

      return canvas.toDataURL();
    } catch (e) {
      return "canvas_not_supported";
    }
  }

  // Get WebGL information
  getWebGLInfo() {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

      if (!gl) return "webgl_not_supported";

      return {
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
      };
    } catch (e) {
      return "webgl_error";
    }
  }

  // Get audio context fingerprint
  getAudioFingerprint() {
    return new Promise((resolve) => {
      try {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const analyser = audioContext.createAnalyser();
        const gainNode = audioContext.createGain();
        const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(10000, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);

        oscillator.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(gainNode);
        gainNode.connect(audioContext.destination);

        scriptProcessor.onaudioprocess = function (bins) {
          const data = bins.inputBuffer.getChannelData(0);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            sum += Math.abs(data[i]);
          }
          resolve(sum.toString());
          audioContext.close();
        };

        oscillator.start(0);
        setTimeout(() => {
          oscillator.stop();
        }, 100);
      } catch (e) {
        resolve("audio_not_supported");
      }
    });
  }

  // Get hardware concurrency
  getHardwareInfo() {
    return {
      hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
      deviceMemory: navigator.deviceMemory || "unknown",
      maxTouchPoints: navigator.maxTouchPoints || 0,
    };
  }

  // Generate hash from string
  generateHash(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Generate complete fingerprint
  async generate() {
    const browserInfo = this.getBrowserInfo();
    const screenInfo = this.getScreenInfo();
    const timezoneInfo = this.getTimezoneInfo();
    const canvasFingerprint = this.getCanvasFingerprint();
    const webglInfo = this.getWebGLInfo();
    const audioFingerprint = await this.getAudioFingerprint();
    const hardwareInfo = this.getHardwareInfo();

    this.fingerprint = {
      browser: browserInfo,
      screen: screenInfo,
      timezone: timezoneInfo,
      canvas: canvasFingerprint,
      webgl: webglInfo,
      audio: audioFingerprint,
      hardware: hardwareInfo,
      timestamp: Date.now(),
    };

    // Generate a hash of the fingerprint
    const fingerprintString = JSON.stringify(this.fingerprint);
    this.fingerprint.hash = this.generateHash(fingerprintString);

    return this.fingerprint;
  }

  // Get just the hash
  async getHash() {
    if (!this.fingerprint.hash) {
      await this.generate();
    }
    return this.fingerprint.hash;
  }

  // Get full fingerprint data
  async getData() {
    if (!this.fingerprint.hash) {
      await this.generate();
    }
    return this.fingerprint;
  }
}

// Export for different module systems
if (typeof module !== "undefined" && module.exports) {
  module.exports = SimpleFingerprint;
} else if (typeof define === "function" && define.amd) {
  define([], function () {
    return SimpleFingerprint;
  });
} else {
  window.SimpleFingerprint = SimpleFingerprint;
}
