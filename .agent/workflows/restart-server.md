---
description: Restarts the Next.js development server by killing port 3000 first
---
// turbo
fuser -k 3000/tcp || true; npm run vg dev
