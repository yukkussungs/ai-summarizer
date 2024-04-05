import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

const summarize = async (urlLink) => {
  const loader = new CheerioWebBaseLoader(urlLink);

  let docs;
  try {
    docs = await loader.loadAndSplit();
  } catch (error) {
    console.error("Error loading documents:", error);
    return { error: "Error loading documents" };
  }
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.VITE_GEMINI_API_KEY,
    temperature: 0,
    modelName: "gemini-pro",
    maxOutputTokens: 2048,
    safetySettings: [],
    defaultLanguage: "ja",
  });

  const template = `コンテキスト内容を日本語で要約しますが、要約結果は次の形式で作成してください:
  \n\n タイトル : 記事 タイトル
  \n\n 主な内容:三行で要約された内容
  \n\n 作成者:当該記事の作成者
  \n\n 内容:主な内容をブックレットポイント形式で作成: `;

  const questionAnsweringPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "次のコンテキストに基づいて、ユーザの質問に回答します:\n\n{context}",
    ],
    ["human", "{input}"],
  ]);


  const stuffChain = await createStuffDocumentsChain({
    llm: model,
    prompt: questionAnsweringPrompt,
  });
  try {
    const res = await stuffChain.invoke({
      input: template,
      context: docs,
      keywords: [],
      contextOptions: {
        language: "ja", // 사이트 언어 정보 제공
      },
    });
    return { summary: res.replace(/\*\*/g, '') };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export default summarize;
