class SimpleFingerprint {
  constructor() {
    this.fingerprint = {};
  }

  getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
    };
  }

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

  getTimezoneInfo() {
    return {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
    };
  }

  getCanvasFingerprint() {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 200;
      canvas.height = 50;

      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("Fingerprint test", 2, 15);
      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
      ctx.fillText("Fingerprint test", 4, 17);

      return canvas.toDataURL();
    } catch (e) {
      console.warn("Canvas fingerprinting not supported:", e);
      return "canvas_not_supported";
    }
  }

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
      console.warn("WebGL fingerprinting not supported:", e);
      return "webgl_error";
    }
  }

  getHardwareInfo() {
    return {
      hardwareConcurrency: navigator.hardwareConcurrency || "unknown",
      deviceMemory: navigator.deviceMemory || "unknown",
      maxTouchPoints: navigator.maxTouchPoints || 0,
    };
  }

  generateHash(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  async generate() {
    const browserInfo = this.getBrowserInfo();
    const screenInfo = this.getScreenInfo();
    const timezoneInfo = this.getTimezoneInfo();
    const canvasFingerprint = this.getCanvasFingerprint();
    const webglInfo = this.getWebGLInfo();
    const hardwareInfo = this.getHardwareInfo();

    this.fingerprint = {
      browser: browserInfo,
      screen: screenInfo,
      timezone: timezoneInfo,
      canvas: canvasFingerprint,
      webgl: webglInfo,
      hardware: hardwareInfo,
    };

    const fingerprintString = JSON.stringify(this.fingerprint);
    this.fingerprint.hash = this.generateHash(fingerprintString);

    return this.fingerprint;
  }

  async getHash() {
    if (!this.fingerprint.hash) {
      await this.generate();
    }
    return this.fingerprint.hash;
  }

  async getData() {
    if (!this.fingerprint.hash) {
      await this.generate();
    }
    return this.fingerprint;
  }
}

// Export for both ES Modules and CommonJS
export default SimpleFingerprint;
