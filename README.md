# Elevare Talent — Deployment Package

Your original website, restored exactly as built, with working email forms.
No Netlify required — runs on any Node.js host.

## Structure

```
elevare-talent/
├── server/
│   ├── public/          ← Your original website (HTML, CSS, JS, images)
│   ├── src/             ← Node.js server source (TypeScript)
│   ├── package.json
│   └── build.mjs
└── README.md
```

The server does two things:
1. Serves your original website from the `public/` folder
2. Handles `/api/email/hire` and `/api/email/candidate` for the contact forms

## Deploy

### Required Environment Variables

```
GMAIL_APP_PASSWORD=your_16_char_app_password
GMAIL_USER=elevaretalentagency@gmail.com   (optional — defaults to recipient)
PORT=3000
```

To get a Gmail App Password:
1. Google Account → Security → 2-Step Verification → App Passwords
2. Create one for "Mail" — you get a 16-character code

### Any Node.js Host (Railway, Render, Fly.io, etc.)

```bash
cd server
npm install
npm run build
npm start
```

Set the environment variables in your host's dashboard.

### Local Testing

```bash
cd server
npm install
npm run build
GMAIL_APP_PASSWORD=xxxx PORT=3000 npm start
```

Then open http://localhost:3000
