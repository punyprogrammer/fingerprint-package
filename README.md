# Simple Fingerprint

A minimal, privacy-aware user fingerprinting library for web applications. Collects a set of device, browser, and system characteristics to generate a consistent, hash-based user identifier.

## Features

- Browser info (user agent, language, platform, cookies)
- Screen info (resolution, color depth, pixel density)
- Timezone detection
- Canvas & WebGL fingerprinting
- Hardware capabilities (CPU cores, RAM, touch support)
- IP-based location enrichment (city & country)
- Lightweight SHA-256 hashing (truncated for brevity)
- Optional server sync with deduplication support

---

## Installation

```bash
npm install @amardeepganguly/simple-fingerprint
```

## Usage

### Basic Usage

```javascript
import SimpleFingerprint from "simple-fingerprint";

const fp = new SimpleFingerprint();

// Get fingerprint hash (16-char truncated SHA-256)
fp.getHash().then((hash) => {
  console.log("Fingerprint hash:", hash);
});

// Get detailed fingerprint data
fp.getData().then((data) => {
  console.log("Fingerprint data:", data);
});
```

### With server submission

```javascript
await fp.sendToServer("https://your-api.com/api/fingerprint");
```

## What it collects

- Browser - userAgent, language, platform, doNotTrack, cookieEnabled
- Screen - screenWidth, screenHeight, colorDepth, pixelDepth
- Timezone - timezone, timezoneOffset
- Canvas - Drawing-based image hash
- WebGL - vendor, renderer, version
- Hardware - hardwareConcurrency, deviceMemory, maxTouchPoints
- Location - city, country (via IP geolocation) not used for generating hash

### Hash Format 
- Uses SHA-256 truncated to 16 hexadecimal characters
- Example: 5a8c3f7e4b29d213 

## Privacy Notice

This library is designed for legitimate use cases such as:

- Analytics and user behavior tracking
- Fraud prevention
- Session management
- A/B testing

Please ensure you comply with privacy regulations (GDPR, CCPA, etc.) and inform users about data collection in your privacy policy.

## License

MIT
