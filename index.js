import axios from "axios";
import { load } from "cheerio";
import "dotenv/config";

const apiKey = process.env.OPEN_AI_API_KEY || "";

async function chatWithGPT3(userPrompt) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/text-davinci-002/completions",
      {
        prompt: `Summarize the following content and remove any duplicated content  "${userPrompt}"`,
        max_tokens: 100, // Adjust as needed
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      "🚀 ~ file: index.js:24 ~ chatWithGPT3 ~ response.data.choices[0].text:",
      response.data.choices[0].text
    );
  } catch (error) {
    console.log("🚀 ~ file: index.js:25 ~ chatWithGPT3 ~ error:", error);
  }
}

// Step 3: Send a query to Google Custom Search API
async function searchGoogle(query) {
  try {
    const apiKey = process.env.CUSTOM_SEARCH_API_KEY;
    const cx = process.env.PROGRAMABLE_SEARCH_ENGINE;
    const searchURL = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${cx}`;
    const response = await axios.get(searchURL);

    // Extract relevant URLs from search results
    const searchResults = response.data.items;
    const relevantURLs = searchResults.map((result) => result.link);

    // Step 4: Fetch and scrape content from relevant websites
    const scrapedContent = await scrapeWebsites(relevantURLs);
    return scrapedContent;
  } catch (error) {
    console.error("Error searching Google:", error);
    throw error;
  }
}

// Step 5: Scrape content from websites using Cheerio
async function scrapeWebsites(urls) {
  const scrapedContent = [];
  for (const url of urls) {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = load(html);

      // Use Cheerio selectors to extract specific content from the web page
      const title = $("title").text();
      const content = $("p").text(); // Example: Get the text of all paragraphs

      // Add scraped content to the result
      scrapedContent.push({ title, content });
    } catch (error) {
      console.error(`Error scraping ${url}:`);
    }
  }
  return scrapedContent;
}

// Usage
const query = "top places to visit in swat valley pakistan";
searchGoogle(query)
  .then((scrapedContent) => {
    chatWithGPT3(JSON.stringify(scrapedContent));
  })
  .catch((error) => {
    console.error("Error:", error);
  });
