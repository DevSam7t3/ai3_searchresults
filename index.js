// import axios from "axios";
// import { load } from "cheerio";

// // Define the search query
// const searchQuery = "devsam";

// const link = `https://www.googleapis.com/customsearch/v1?key=INSERT_YOUR_API_KEY&cx=017576662512468239146:omuauf_lfve&q=lectures`;

// // Create the Google search URL
// const searchURL = `https://www.google.com/search?q=${encodeURIComponent(
//   searchQuery
// )}`;

// // Send an HTTP GET request to Google
// axios
//   .get(searchURL)
//   .then((response) => {
//     // Load the HTML content of the search results page
//     const html = response.data;

//     // Parse the HTML content using Cheerio
//     const $ = load(html);

//     // Extract and process search results
//     $("h3").each((index, element) => {
//       // Example: Log the titles of the search results
//       const title = $(element).text();
//       console.log(`Result ${index + 1}: ${title}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
import axios from "axios";
import { load } from "cheerio";
import "dotenv/config";

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
    console.log("Scraped Content:", scrapedContent);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
