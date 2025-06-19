class SimpleFingerprint {
  constructor() {
    this.fingerprint = {};
    this.location = {};
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

  async generateHashSHA256(str) {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  async getLocationInfo() {
    try {
      const res = await fetch("https://ipapi.co/json/");
      if (!res.ok) throw new Error("Failed to fetch location");
      const location = await res.json();
      return {
        ip: location.ip,
        city: location.city,
        region: location.region,
        country: location.country_name,
        latitude: location.latitude,
        longitude: location.longitude,
        org: location.org,
      };
    } catch (e) {
      return { error: "location_unavailable" };
    }
  }

  async generate() {
    const [
      browserInfo,
      screenInfo,
      timezoneInfo,
      canvasFingerprint,
      webglInfo,
      hardwareInfo,
      locationInfo,
    ] = await Promise.all([
      this.getBrowserInfo(),
      this.getScreenInfo(),
      this.getTimezoneInfo(),
      this.getCanvasFingerprint(),
      this.getWebGLInfo(),
      this.getHardwareInfo(),
      this.getLocationInfo(),
    ]);

    this.location = locationInfo;

    this.fingerprint = {
      browser: browserInfo,
      screen: screenInfo,
      timezone: timezoneInfo,
      canvas: canvasFingerprint,
      webgl: webglInfo,
      hardware: hardwareInfo,
    };

    const fingerprintString = JSON.stringify(this.fingerprint);
    this.fingerprint.hash = await this.generateHashSHA256(fingerprintString);

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

  async sendToServer(apiUrl) {
    const cachedHash = sessionStorage.getItem("fingerprint_hash");
    if (cachedHash) {
      this.fingerprint.hash = cachedHash;
      return cachedHash;
    }

    await this.generate();

    try {
      await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...this.fingerprint,location:this.location }),
      });
      sessionStorage.setItem("fingerprint_hash", this.fingerprint.hash);
    } catch (e) {

    }

    return this.fingerprint.hash;
  }
}

export default SimpleFingerprint;
