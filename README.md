# PlayWriter App

PlayWriter App is a Next.js application that allows users to create a play script, assign voices to characters, and generate a single MP3 file with all the lines spoken by the assigned voices using the Eleven Labs Voice API.

## Prerequisites

- Node.js (version 14.x or later)
- npm or yarn
- ffmpeg (Ensure ffmpeg is installed and accessible in your system's PATH)

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-username/playwriter-app.git
cd playwriter-app
```

### Install Dependencies

#### Using npm

```bash
npm install
```

#### Using yarn

```bash
yarn install
```

### Environment Variables

Create a `.env.local` file in the root of your project and add your Eleven Labs API key:

```bash
NEXT_PUBLIC_XI_API_KEY=your_eleven_labs_api_key
```

### Run the Development Server

```bash
npm run dev
```

or

```bash
yarn dev
```

Open your browser and navigate to `http://localhost:3000` to see the application.

## Usage

1. Add lines to the play script by typing the character name, selecting the gender, and inputting the line.
2. Click "Add New Line" to add up to 5 lines.
3. Click "Submit" to generate the play script and create a single MP3 file with all the lines spoken by the assigned voices.

## File Structure

```
playwriter-app/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   └── PlayWriter.js
│   ├── pages/
│   │   ├── api/
│   │   │   ├── generateAudio.js
│   │   │   └── saveScript.js
│   │   └── index.js
│   ├── styles/
│   │   └── Home.module.css
├── .env.local
├── .gitignore
├── README.md
├── next.config.js
├── package.json
├── package-lock.json
└── yarn.lock
```

## Additional Notes

- Ensure `ffmpeg` is installed and accessible in your system's PATH. You can verify the installation by running `ffmpeg -version` in your terminal.
- If you encounter any issues, check the server and client logs for detailed error messages.

