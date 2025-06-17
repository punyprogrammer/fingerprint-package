# Simple Fingerprint

A minimalistic user fingerprinting library for web applications that collects basic browser and device characteristics.

## Installation

```bash
npm install simple-fingerprint
```

## Usage

### Basic Usage

```javascript
const SimpleFingerprint = require("simple-fingerprint");

const fp = new SimpleFingerprint();

// Get fingerprint hash
fp.getHash().then((hash) => {
  console.log("Fingerprint hash:", hash);
});

// Get full fingerprint data
fp.getData().then((data) => {
  console.log("Full fingerprint:", data);
});
```

### Browser Usage

```html
<script src="path/to/simple-fingerprint.js"></script>
<script>
  const fp = new SimpleFingerprint();

  fp.getHash().then((hash) => {
    console.log("Fingerprint hash:", hash);
  });
</script>
```

## What it collects

- Browser information (user agent, language, platform)
- Screen resolution and color depth
- Timezone information
- Canvas fingerprint
- WebGL renderer information
- Audio context fingerprint
- Hardware information (CPU cores, memory, touch points)

## Privacy Notice

This library is designed for legitimate use cases such as:

- Analytics and user behavior tracking
- Fraud prevention
- Session management
- A/B testing

Please ensure you comply with privacy regulations (GDPR, CCPA, etc.) and inform users about data collection in your privacy policy.

## License

MIT
