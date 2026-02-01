export const API_BASE = import.meta.env.VITE_API_BASE || "/api";
export const ONBOARDING_SURVEY_URL = "https://onboarding.codingsoft.com";

export const AUTH_USER = "codingsoft_user";
export const AUTH_TOKEN = "codingsoft_authToken";
export const AUTH_TIMESTAMP = "codingsoft_authTimestamp";
export const COMPLETE_QUESTIONNAIRE = "codingsoft_completed_questionnaire";
export const SEEN_DOC_PIN_ALERT = "codingsoft_pinned_document_alert";
export const SEEN_WATCH_ALERT = "codingsoft_watched_document_alert";
export const LAST_VISITED_WORKSPACE = "codingsoft_last_visited_workspace";
export const USER_PROMPT_INPUT_MAP = "codingsoft_user_prompt_input_map";

export const APPEARANCE_SETTINGS = "codingsoft_appearance_settings";

export const OLLAMA_COMMON_URLS = [
  "http://127.0.0.1:11434",
  "http://host.docker.internal:11434",
  "http://172.17.0.1:11434",
];

export const LMSTUDIO_COMMON_URLS = [
  "http://localhost:1234/v1",
  "http://127.0.0.1:1234/v1",
  "http://host.docker.internal:1234/v1",
  "http://172.17.0.1:1234/v1",
];

export const KOBOLDCPP_COMMON_URLS = [
  "http://127.0.0.1:5000/v1",
  "http://localhost:5000/v1",
  "http://host.docker.internal:5000/v1",
  "http://172.17.0.1:5000/v1",
];

export const LOCALAI_COMMON_URLS = [
  "http://127.0.0.1:8080/v1",
  "http://localhost:8080/v1",
  "http://host.docker.internal:8080/v1",
  "http://172.17.0.1:8080/v1",
];

export const DPAIS_COMMON_URLS = [
  "http://127.0.0.1:8553/v1/openai",
  "http://0.0.0.0:8553/v1/openai",
  "http://localhost:8553/v1/openai",
  "http://host.docker.internal:8553/v1/openai",
];

export const NVIDIA_NIM_COMMON_URLS = [
  "http://127.0.0.1:8000/v1/version",
  "http://localhost:8000/v1/version",
  "http://host.docker.internal:8000/v1/version",
  "http://172.17.0.1:8000/v1/version",
];

export const DOCKER_MODEL_RUNNER_COMMON_URLS = [
  "http://localhost:12434/engines/llama.cpp/v1",
  "http://127.0.0.1:12434/engines/llama.cpp/v1",
  "http://model-runner.docker.internal/engines/llama.cpp/v1",
  "http://host.docker.internal:12434/engines/llama.cpp/v1",
  "http://172.17.0.1:12434/engines/llama.cpp/v1",
];

export function fullApiUrl() {
  if (API_BASE !== "/api") return API_BASE;
  return `${window.location.origin}/api`;
}

export const POPUP_BROWSER_EXTENSION_EVENT = "NEW_BROWSER_EXTENSION_CONNECTION";
