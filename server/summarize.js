import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { PuppeteerWebBaseLoader } from "langchain/document_loaders/web/puppeteer";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from 'dotenv';
dotenv.config();

const summarize = async (urlLink) => {
  const loader = new PuppeteerWebBaseLoader(
    urlLink,
    {
      launchOptions: {
        headless: "new",
        args: ["--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"],
      },
      gotoOptions: {
        waitUntil: "domcontentloaded",
      },
      async evaluate(page) {
        await page.setViewport({
          width: 1920,
          height: 1080,
        });
        const result = await page.evaluate(async () => {
          // wait page load
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const spScripts = document.querySelectorAll("script[type='application/ld+json']");
          // remove unnecessary elements
          const pcScripts = document.body.querySelectorAll("script");
          const noscript = document.body.querySelectorAll("noscript");
          const styles = document.body.querySelectorAll("style");
          const scriptAndStyle = [...spScripts, ...pcScripts, ...noscript, ...styles];
          scriptAndStyle.forEach((e) => e.remove());

          // collect text
          const mainElement = document.querySelector("main");
          const text = mainElement ? mainElement.innerText : document.body.innerText;
          return text.slice(0, 20000);
        });
        return result;
      },
    }
  );

  let docs;
  try {
    docs = await loader.loadAndSplit();
  } catch (error) {
    console.error("Error loading documents:", error);
    return { error: "Error loading documents" };
  }
  const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.VITE_GEMINI_API_KEY,
    temperature: 0.7,
    modelName: "gemini-pro",
    maxOutputTokens: 2048,
    safetySettings: [],
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
    console.log('docs : ', docs);
    const res = await stuffChain.invoke({
      input: template,
      context: docs,
      keywords: [],
    });
    return { summary: res.replace(/\*\*/g, '') };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export default summarize;
