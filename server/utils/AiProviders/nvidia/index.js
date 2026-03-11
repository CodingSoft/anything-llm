const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
  LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const {
  formatChatHistory,
  writeResponseChunk,
  clientAbortedHandler,
} = require("../../helpers/chat/responses");
const { v4: uuidv4 } = require("uuid");
const { getAnythingLLMUserAgent } = require("../../../endpoints/utils");

class NvidiaLLM {
  constructor(embedder = null, modelPreference = null) {
    const { OpenAI: OpenAIApi } = require("openai");

    if (!process.env.NVIDIA_API_KEY) {
      throw new Error("NVIDIA API key must be provided.");
    }

    this.className = "NvidiaLLM";
    this.basePath = "https://integrate.api.nvidia.com/v1";

    this.openai = new OpenAIApi({
      baseURL: this.basePath,
      apiKey: process.env.NVIDIA_API_KEY,
      defaultHeaders: {
        "User-Agent": getAnythingLLMUserAgent(),
      },
    });

    this.model = modelPreference ?? process.env.NVIDIA_MODEL_PREF ?? null;

    if (!this.model) {
      throw new Error("NVIDIA model preference must be set.");
    }

    this.limits = {
      history: this.promptWindowLimit() * 0.15,
      system: this.promptWindowLimit() * 0.15,
      user: this.promptWindowLimit() * 0.7,
    };

    this.embedder = embedder ?? new NativeEmbedder();
    this.defaultTemp = 0.7;
    this.log(`Inference API: ${this.basePath} Model: ${this.model}`);
  }

  log(text, ...args) {
    console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
  }

  streamingEnabled() {
    return "streamGetChatCompletion" in this;
  }

  static promptWindowLimit(modelName) {
    // NVIDIA models context windows
    const modelLimits = {
      "meta/llama-3.1-8b-instruct": 128000,
      "meta/llama-3.1-70b-instruct": 128000,
      "meta/llama-3.1-405b-instruct": 128000,
      "meta/llama-3.2-1b-instruct": 128000,
      "meta/llama-3.2-3b-instruct": 128000,
      "meta/llama-3.2-11b-vision-instruct": 128000,
      "meta/llama-3.2-90b-vision-instruct": 128000,
      "meta/llama-3.3-70b-instruct": 128000,
      "mistralai/mistral-7b-instruct-v0.3": 32768,
      "mistralai/mixtral-8x7b-instruct-v0.1": 32768,
      "mistralai/mixtral-8x22b-instruct-v0.1": 65536,
      "mistralai/mistral-large-instruct": 65536,
      "nvidia/llama-3.1-nemotron-70b-instruct": 128000,
      "nvidia/nemotron-4-340b-instruct": 4096,
      "microsoft/phi-3-mini-4k-instruct": 4096,
      "microsoft/phi-3-mini-128k-instruct": 131072,
      "microsoft/phi-3-medium-4k-instruct": 4096,
      "microsoft/phi-3-medium-128k-instruct": 131072,
      "microsoft/phi-4": 16384,
      "google/gemma-2-2b-it": 8192,
      "google/gemma-2-9b-it": 8192,
      "google/gemma-2-27b-it": 8192,
      "google/codegemma-1.1-2b-it": 8192,
      "google/codegemma-1.1-7b-it": 8192,
      "google/recurrentgemma-2b-it": 8192,
      "google/recurrentgemma-4b-it": 8192,
      "databricks/dbrx-instruct": 32768,
      "deepseek-ai/deepseek-r1": 128000,
      "01-ai/yi-large": 32768,
      "qwen/qwen2.5-7b-instruct": 32768,
      "qwen/qwen2.5-14b-instruct": 32768,
      "qwen/qwen2.5-32b-instruct": 32768,
      "qwen/qwen2.5-72b-instruct": 32768,
      "qwen/qwen2.5-coder-32b-instruct": 32768,
    };

    return modelLimits[modelName] || 4096;
  }

  promptWindowLimit() {
    return NvidiaLLM.promptWindowLimit(this.model);
  }

  isValidChatCompletionModel(modelName = "") {
    // NVIDIA accepts any model from their catalog
    return modelName.length > 0;
  }

  #appendContext(contextTexts = []) {
    if (!contextTexts || !contextTexts.length) return "";
    return (
      "\nContext:\n" +
      contextTexts
        .map((text, i) => {
          return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
        })
        .join("")
    );
  }

  #generateContent({ userPrompt, attachments = [] }) {
    if (!attachments.length) {
      return userPrompt;
    }

    const content = [{ type: "text", text: userPrompt }];
    for (let attachment of attachments) {
      content.push({
        type: "image_url",
        image_url: {
          url: attachment.contentString,
          detail: "high",
        },
      });
    }
    return content.flat();
  }

  constructPrompt({
    systemPrompt = "",
    contextTexts = [],
    chatHistory = [],
    userPrompt = "",
    attachments = [],
  }) {
    const prompt = {
      role: "system",
      content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
    };
    return [
      prompt,
      ...formatChatHistory(chatHistory, this.#generateContent),
      {
        role: "user",
        content: this.#generateContent({ userPrompt, attachments }),
      },
    ];
  }

  async getChatCompletion(messages = null, { temperature = 0.7 }) {
    const result = await LLMPerformanceMonitor.measureAsyncFunction(
      this.openai.chat.completions
        .create({
          model: this.model,
          messages,
          temperature,
        })
        .catch((e) => {
          throw new Error(e.message);
        })
    );

    if (
      !result.output.hasOwnProperty("choices") ||
      result.output.choices.length === 0
    )
      return null;

    const usage = {
      prompt_tokens: result.output?.usage?.prompt_tokens || 0,
      completion_tokens: result.output?.usage?.completion_tokens || 0,
      total_tokens: result.output?.usage?.total_tokens || 0,
      duration: result.duration,
    };

    return {
      textResponse: result.output.choices[0].message.content,
      metrics: {
        ...usage,
        outputTps: usage.completion_tokens / usage.duration,
        model: this.model,
        provider: this.className,
        timestamp: new Date(),
      },
    };
  }

  async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
    const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
      func: this.openai.chat.completions.create({
        model: this.model,
        stream: true,
        messages,
        temperature,
      }),
      messages,
      runPromptTokenCalculation: true,
      modelTag: this.model,
      provider: this.className,
    });
    return measuredStreamRequest;
  }

  handleStream(response, stream, responseProps) {
    const { uuid = uuidv4(), sources = [] } = responseProps;
    let hasUsageMetrics = false;
    let usage = {
      completion_tokens: 0,
    };

    return new Promise(async (resolve) => {
      let fullText = "";

      const handleAbort = () => {
        stream?.endMeasurement(usage);
        clientAbortedHandler(resolve, fullText);
      };
      response.on("close", handleAbort);

      try {
        for await (const chunk of stream) {
          const message = chunk?.choices?.[0];
          const token = message?.delta?.content;

          if (
            chunk.hasOwnProperty("usage") &&
            !!chunk.usage &&
            Object.values(chunk.usage).length > 0
          ) {
            if (chunk.usage.hasOwnProperty("prompt_tokens")) {
              usage.prompt_tokens = Number(chunk.usage.prompt_tokens);
            }

            if (chunk.usage.hasOwnProperty("completion_tokens")) {
              hasUsageMetrics = true;
              usage.completion_tokens = Number(chunk.usage.completion_tokens);
            }
          }

          if (token) {
            fullText += token;
            if (!hasUsageMetrics) usage.completion_tokens++;
            writeResponseChunk(response, {
              uuid,
              sources: [],
              type: "textResponseChunk",
              textResponse: token,
              close: false,
              error: false,
            });
          }

          if (
            message?.hasOwnProperty("finish_reason") &&
            message.finish_reason !== "" &&
            message.finish_reason !== null
          ) {
            writeResponseChunk(response, {
              uuid,
              sources,
              type: "textResponseChunk",
              textResponse: "",
              close: true,
              error: false,
            });

            response.removeListener("close", handleAbort);
            stream?.endMeasurement(usage);
            resolve(fullText);
            break;
          }
        }
      } catch (e) {
        console.log(`\x1b[43m\x1b[34m[STREAMING ERROR]\x1b[0m ${e.message}`);
        writeResponseChunk(response, {
          uuid,
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: e.message,
        });
        stream?.endMeasurement(usage);
        resolve(fullText);
      }
    });
  }

  async embedTextInput(textInput) {
    return await this.embedder.embedTextInput(textInput);
  }

  async embedChunks(textChunks = []) {
    return await this.embedder.embedChunks(textChunks);
  }

  async compressMessages(promptArgs = {}, rawHistory = []) {
    const { messageArrayCompressor } = require("../../helpers/chat");
    const messageArray = this.constructPrompt(promptArgs);
    return await messageArrayCompressor(this, messageArray, rawHistory);
  }
}

module.exports = {
  NvidiaLLM,
};
