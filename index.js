// By VishwaGauravIn (https://itsvg.in)

const GenAI = require("@google/generative-ai");
const { TwitterApi } = require("twitter-api-v2");
const SECRETS = require("./SECRETS");

const twitterClient = new TwitterApi({
  appKey: SECRETS.APP_KEY,
  appSecret: SECRETS.APP_SECRET,
  accessToken: SECRETS.ACCESS_TOKEN,
  accessSecret: SECRETS.ACCESS_SECRET,
});

const generationConfig = {
  maxOutputTokens: 400,
};
const genAI = new GenAI.GoogleGenerativeAI(SECRETS.GEMINI_API_KEY);

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig,
  });

  // Write your prompt here
  const prompt =
    "You are Bill Nye the Rug Pull Guy. Using data from Dexscreener.com, identify today's worst rug pulls. For each token, craft a separate summary post no longer than 275 characters that includes: 1.Token name & blockchain (e.g., $TOKEN on Solana). 2. A comedic Bill Nye–style insight or pun. 3. A Rug-O-Meter rating (scale 1–10). 4. Relevant hashtags that are trending on X.5. Stats on how bag the rug pull was dollar and percentage wiseMake it fun, concise, and educational—like Bill Nye giving a mini science lesson. Use emojis or short puns to keep it lively, but ensure each post is under 280 characters. Make it flow like a real post from a person and not like a list from a program. Focus more on the solana network and all hashtags go at the bottom. cant be longer than 275 characters and keep the * to a minimum. Only choose one post per prompt, this will be directly imported into x.";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  sendTweet(text);
}

run();

async function sendTweet(tweetText) {
  try {
    await twitterClient.v2.tweet(tweetText);
    console.log("Tweet sent successfully!");
  } catch (error) {
    console.error("Error sending tweet:", error);
  }
}
