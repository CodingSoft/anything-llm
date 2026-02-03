import GenericHubCard from "./generic";
import SystemPromptHubCard from "./systemPrompt";
import SlashCommandHubCard from "./slashCommand";
import AgentSkillHubCard from "./agentSkill";
import AgentFlowHubCard from "./agentFlow";

const TYPE_TO_API_TYPE = {
  "systemPrompts": "system-prompt",
  "slashCommands": "slash-command",
  "agentSkills": "agent-skill",
  "agentFlows": "agent-flow",
};

export default function HubItemCard({ type, item }) {
  const apiType = TYPE_TO_API_TYPE[type] || type;
  
  switch (type) {
    case "systemPrompts":
      return <SystemPromptHubCard item={item} type={apiType} />;
    case "slashCommands":
      return <SlashCommandHubCard item={item} type={apiType} />;
    case "agentSkills":
      return <AgentSkillHubCard item={item} type={apiType} />;
    case "agentFlows":
      return <AgentFlowHubCard item={item} type={apiType} />;
    default:
      return <GenericHubCard item={item} type={apiType} />;
  }
}
