# Discord-myBot

Discord-myBot is a Discord bot designed to enhance the interactivity of Discord servers. Built on Node.js, this bot can perform a variety of tasks ranging from greeting members to providing weather updates.

## Getting Started

Follow these instructions to get your instance of discord-myBot up and running on your server.

### Prerequisites

- Node.js
- npm (Node Package Manager)

### Installation

1. Clone this repository to your local machine.
```bash
git clone https://github.com/MarikaBBB/discord-myBot
```
2. Install dependencies by running:
``` bash
npm install
```
3. Create a `.env` file in the project root and add your API keys and Discord token:
``` bash
DISCORD_TOKEN=your_discord_bot_token
OPENAI_API_KEY=your_openai_api_key
GIPHY_API_KEY=your_giphy_api_key
WEATHER_API_KEY=your_openweathermap_api_key
MEME_API_URL=https://api.imgflip.com/get_memes
```

## Usage

Run the bot with:
```bash
node index.js
````
Or use:
```bash
npm run dev
```
for development mode with hot reloading.

## Available Commands

Here are some of the commands you can use in Discord:

- `/help`: List all commands or info about a specific command
-  `/greet`: Greets the user 
- `/echo [message]`: Echoes your message 
- `/gif [term]`: Get a random GIF or search a specific term  
- `/joke`: Get a random joke 
- `/meme`: Get a random meme 
- `/ping`: Responds with Pong! 
- `/userinfo`: Get your Discord user info 
- `/weather [city]`: Get the weather for a city 
