import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

if (existsSync(join(__dirname, 'public'))) {
  app.use(express.static(join(__dirname, 'public')));
}

const DB_PATH = join(__dirname, 'hub.db');
const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    itemType TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    prompt TEXT,
    command TEXT,
    config TEXT,
    tags TEXT,
    author TEXT DEFAULT 'CodingSoft',
    visibility TEXT DEFAULT 'public',
    createdAt TEXT DEFAULT (datetime('now')),
    updatedAt TEXT
  );
  
  CREATE INDEX IF NOT EXISTS idx_itemType ON items(itemType);
  CREATE INDEX IF NOT EXISTS idx_visibility ON items(visibility);
`);

function getItemsByType(itemType) {
  const stmt = db.prepare('SELECT * FROM items WHERE itemType = ? ORDER BY createdAt DESC');
  return stmt.all(itemType);
}

function getItem(itemType, id) {
  const stmt = db.prepare('SELECT * FROM items WHERE itemType = ? AND id = ?');
  return stmt.get(itemType, id);
}

function createItem(itemType, data) {
  const id = data.id || Date.now().toString();
  const stmt = db.prepare(`
    INSERT INTO items (id, itemType, name, description, prompt, command, config, tags, author, visibility, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    id,
    itemType,
    data.name,
    data.description || '',
    data.prompt || data.config || '',
    data.command || null,
    data.config ? JSON.stringify(data.config) : null,
    data.tags ? JSON.stringify(data.tags) : '[]',
    data.author || 'CodingSoft',
    data.visibility || 'public',
    new Date().toISOString()
  );
  
  return getItem(itemType, id);
}

function updateItem(itemType, id, data) {
  const existing = getItem(itemType, id);
  if (!existing) return null;
  
  const stmt = db.prepare(`
    UPDATE items SET name=?, description=?, prompt=?, command=?, config=?, tags=?, visibility=?, updatedAt=?
    WHERE id=? AND itemType=?
  `);
  
  stmt.run(
    data.name || existing.name,
    data.description || existing.description,
    data.prompt || existing.prompt,
    data.command || existing.command,
    data.config ? JSON.stringify(data.config) : existing.config,
    data.tags ? JSON.stringify(data.tags) : existing.tags,
    data.visibility || existing.visibility,
    new Date().toISOString(),
    id,
    itemType
  );
  
  return getItem(itemType, id);
}

function deleteItem(itemType, id) {
  const stmt = db.prepare('DELETE FROM items WHERE itemType = ? AND id = ?');
  const result = stmt.run(itemType, id);
  return result.changes > 0;
}

const INITIAL_ITEMS = {
  "system-prompt": [
    {
      id: "creative-writer",
      name: "Creative Writer",
      description: "A system prompt for creative writing assistance",
      author: "CodingSoft",
      visibility: "public",
      prompt: "You are a creative writing assistant. Help users craft engaging stories, poems, and other creative content.",
      tags: JSON.stringify(["writing", "creative", "general"]),
    },
    {
      id: "data-analyst",
      name: "Data Analyst",
      description: "A system prompt for data analysis and visualization",
      author: "CodingSoft",
      visibility: "public",
      prompt: "You are a data analyst. Help users understand their data, create insights, and suggest visualizations.",
      tags: JSON.stringify(["data", "analysis", "business"]),
    },
  ],
  "slash-command": [
    {
      id: "traducir",
      name: "Traducir",
      description: "Traduce texto al español con contexto cultural",
      author: "CodingSoft",
      visibility: "public",
      command: "/traducir",
      prompt: "Translate the following text to Spanish, preserving cultural context and nuances.",
      tags: JSON.stringify(["spanish", "translation", "language"]),
    },
    {
      id: "resumir",
      name: "Resumir",
      description: "Resume textos largos de forma concisa",
      author: "CodingSoft",
      visibility: "public",
      command: "/resumir",
      prompt: "Summarize the following text in 3-5 key bullet points.",
      tags: JSON.stringify(["summary", "productivity", "text"]),
    },
    {
      id: "preguntar",
      name: "Preguntar",
      description: "Genera preguntas de seguimiento inteligentes",
      author: "CodingSoft",
      visibility: "public",
      command: "/preguntar",
      prompt: "Generate 3-5 intelligent follow-up questions based on the conversation context.",
      tags: JSON.stringify(["questions", "conversation", "engagement"]),
    },
    {
      id: "codigo",
      name: "Explicar Código",
      description: "Explica código de forma clara y educativa",
      author: "CodingSoft",
      visibility: "public",
      command: "/codigo",
      prompt: "Explain the following code in clear, educational terms.",
      tags: JSON.stringify(["coding", "education", "programming"]),
    },
    {
      id: "continuar",
      name: "Continuar Conversación",
      description: "Continúa una conversación de forma natural",
      author: "CodingSoft",
      visibility: "public",
      command: "/continuar",
      prompt: "Continue the conversation naturally based on the context.",
      tags: JSON.stringify(["conversation", "continuation", "dialogue"]),
    },
  ],
};

function seedDatabase() {
  const count = db.prepare('SELECT COUNT(*) as count FROM items').get();
  if (count.count === 0) {
    console.log('🌱 Seeding database with initial items...');
    Object.entries(INITIAL_ITEMS).forEach(([itemType, items]) => {
      items.forEach(item => {
        createItem(itemType, item);
      });
    });
    console.log('✅ Database seeded successfully');
  }
}

seedDatabase();

app.get("/v1/explore", (req, res) => {
  const types = ["system-prompt", "slash-command", "agent-skill", "agent-flow"];
  const result = {};
  
  types.forEach(type => {
    const items = getItemsByType(type);
    const pluralType = type.replace("-", "");
    result[pluralType + "s"] = {
      items: items.map(item => ({
        ...item,
        tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags,
      })),
      hasMore: false,
      totalCount: items.length,
    };
  });
  
  res.json(result);
});

app.get("/v1/:itemType/:id/pull", (req, res) => {
  const { itemType, id } = req.params;
  
  const item = getItem(itemType, id);
  
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  
  res.json({
    item: {
      ...item,
      tags: typeof item.tags === 'string' ? JSON.parse(item.tags) : item.tags,
      itemType: itemType,
      importId: `allm-community-id:${itemType}:${item.id}`,
    },
    url: null,
    error: null,
  });
});

app.post("/v1/auth", (req, res) => {
  const { connectionKey } = req.body;
  if (connectionKey === "demo-key-123") {
    res.json({ valid: true, user: { id: "demo-user", name: "Demo User" } });
  } else {
    res.json({ valid: false, error: "Invalid connection key" });
  }
});

app.get("/v1/items", (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.json({ createdByMe: {}, teamItems: [] });
  }
  
  res.json({
    createdByMe: {},
    teamItems: [],
  });
});

app.post("/v1/:itemType/create", (req, res) => {
  const { itemType } = req.params;
  const validTypes = ["system-prompt", "slash-command", "agent-skill", "agent-flow"];
  
  if (!validTypes.includes(itemType)) {
    return res.status(400).json({ error: "Invalid item type" });
  }
  
  const newItem = createItem(itemType, req.body);
  
  res.json({
    item: {
      ...newItem,
      tags: typeof newItem.tags === 'string' ? JSON.parse(newItem.tags) : newItem.tags,
    },
    error: null,
  });
});

app.post("/v1/:itemType/:id/update", (req, res) => {
  const { itemType, id } = req.params;
  
  const updated = updateItem(itemType, id, req.body);
  
  if (!updated) {
    return res.status(404).json({ error: "Item not found" });
  }
  
  res.json({
    item: {
      ...updated,
      tags: typeof updated.tags === 'string' ? JSON.parse(updated.tags) : updated.tags,
    },
    error: null,
  });
});

app.delete("/v1/:itemType/:id", (req, res) => {
  const { itemType, id } = req.params;
  
  const deleted = deleteItem(itemType, id);
  
  if (!deleted) {
    return res.status(404).json({ error: "Item not found" });
  }
  
  res.json({ success: true, error: null });
});

app.listen(PORT, () => {
  console.log(`🚀 Community Hub server running at http://localhost:${PORT}`);
  console.log(`📦 Database: ${DB_PATH}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/v1`);
});
