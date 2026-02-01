# CodingSoft Community Hub

A simple Community Hub server for CodingSoft that provides slash commands, system prompts, and agent skills.

## Installation

```bash
cd hub-server
npm install
```

## Configuration

The hub URL is automatically configured in the main app when `USE_LOCAL_HUB=true` is set in `server/.env.development`.

## Running

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on port 5001 by default.

## API Endpoints

### GET /v1/explore
Returns all available items (slash commands, system prompts, agent skills).

### GET /v1/:itemType/:id/pull
Returns a specific item by type and ID.

### GET /v1/items
Returns user items (requires Authorization header).

### POST /v1/:itemType/create
Creates a new item (requires Authorization header).

## Item Types

- `system-prompt` - System prompts for workspaces
- `slash-command` - Slash commands for chat
- `agent-flow` - Agent flow definitions
- `agent-skill` - Agent skills (bundle items)

## Environment Variables

- `PORT` - Server port (default: 5001)
