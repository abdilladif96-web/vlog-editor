# Chat-Based Vlog Editor

This is a Next.js application designed to help YouTubers and Vloggers edit their videos using natural language commands in a chat interface.

## Features

- **Chat Interface**: Interact with an AI assistant to edit videos (e.g., "cut the first 10 seconds", "add captions").
- **Video Preview**: Visual feedback of the video state and applied edits.
- **Project Management**: Organize your vlogs (UI placeholder).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Usage

1. **Play/Pause**: Type "play" or "stop" in the chat, or click the video player.
2. **Edits**: Type commands like:
   - "Cut the intro"
   - "Add captions"
   - "Trim the end"
   The assistant will acknowledge and add the edit to the list.
