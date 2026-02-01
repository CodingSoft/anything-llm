import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

if (existsSync(join(__dirname, 'public'))) {
  app.use(express.static(join(__dirname, 'public')));
}

const ITEMS = {
  "system-prompt": [
    {
      id: "creative-writer",
      name: "Creative Writer",
      description: "A system prompt for creative writing assistance",
      author: "CodingSoft",
      visibility: "public",
      prompt: "You are a creative writing assistant. Help users craft engaging stories, poems, and other creative content.",
      tags: ["writing", "creative", "general"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "data-analyst",
      name: "Data Analyst",
      description: "A system prompt for data analysis and visualization",
      author: "CodingSoft",
      visibility: "public",
      prompt: "You are a data analyst. Help users understand their data, create insights, and suggest visualizations.",
      tags: ["data", "analysis", "business"],
      createdAt: new Date().toISOString(),
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
      prompt: "Translate the following text to Spanish, preserving cultural context and nuances. Provide the translation and a brief explanation of any cultural considerations.",
      tags: ["spanish", "translation", "language"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "resumir",
      name: "Resumir",
      description: "Resume textos largos de forma concisa",
      author: "CodingSoft",
      visibility: "public",
      command: "/resumir",
      prompt: "Summarize the following text in 3-5 key bullet points, capturing the most important information.",
      tags: ["summary", "productivity", "text"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "preguntar",
      name: "Preguntar",
      description: "Genera preguntas de seguimiento inteligentes",
      author: "CodingSoft",
      visibility: "public",
      command: "/preguntar",
      prompt: "Generate 3-5 intelligent follow-up questions based on the conversation context. Focus on clarifying understanding and exploring deeper insights.",
      tags: ["questions", "conversation", "engagement"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "codigo",
      name: "Explicar Código",
      description: "Explica código de forma clara y educativa",
      author: "CodingSoft",
      visibility: "public",
      command: "/codigo",
      prompt: "Explain the following code in clear, educational terms. Break down what each part does and why. Include practical examples of how to use it.",
      tags: ["coding", "education", "programming"],
      createdAt: new Date().toISOString(),
    },
    {
      id: "continuar",
      name: "Continuar Conversación",
      description: "Continúa una conversación de forma natural",
      author: "CodingSoft",
      visibility: "public",
      command: "/continuar",
      prompt: "Continue the conversation naturally based on the context. Ask relevant questions or provide insights that move the discussion forward.",
      tags: ["conversation", "continuation", "dialogue"],
      createdAt: new Date().toISOString(),
    },
  ],
  "agent-flow": [],
  "agent-skill": [],
};

app.get("/v1/explore", (req, res) => {
  const result = {
    systemPrompts: {
      items: ITEMS["system-prompt"] || [],
      hasMore: false,
      totalCount: (ITEMS["system-prompt"] || []).length,
    },
    slashCommands: {
      items: ITEMS["slash-command"] || [],
      hasMore: false,
      totalCount: (ITEMS["slash-command"] || []).length,
    },
    agentSkills: {
      items: ITEMS["agent-skill"] || [],
      hasMore: false,
      totalCount: (ITEMS["agent-skill"] || []).length,
    },
    agentFlows: {
      items: ITEMS["agent-flow"] || [],
      hasMore: false,
      totalCount: (ITEMS["agent-flow"] || []).length,
    },
  };
  res.json(result);
});

app.get("/v1/:itemType/:id/pull", (req, res) => {
  const { itemType, id } = req.params;
  
  if (!ITEMS[itemType]) {
    return res.status(404).json({ error: "Item type not found" });
  }
  
  const item = ITEMS[itemType].find((i) => i.id === id);
  
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  
  res.json({
    item: {
      ...item,
      importId: `allm-community-id:${itemType}:${item.id}`,
    },
    url: null,
    error: null,
  });
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
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: "Authorization required" });
  }
  
  if (!ITEMS[itemType]) {
    return res.status(400).json({ error: "Invalid item type" });
  }
  
  const newItem = {
    id: uuidv4(),
    ...req.body,
    author: "CodingSoft",
    visibility: "public",
    createdAt: new Date().toISOString(),
  };
  
  if (!ITEMS[itemType]) {
    ITEMS[itemType] = [];
  }
  ITEMS[itemType].push(newItem);
  
  res.json({
    item: newItem,
    error: null,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Community Hub server running at http://localhost:${PORT}`);
  console.log(`📦 Available item types: ${Object.keys(ITEMS).join(", ")}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/v1`);
});
