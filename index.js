import axios from "axios";
import { load } from "cheerio";

// Define the search query
const searchQuery = "devsam";

// Create the Google search URL
const searchURL = `https://www.google.com/search?q=${encodeURIComponent(
  searchQuery
)}`;

// Send an HTTP GET request to Google
axios
  .get(searchURL)
  .then((response) => {
    // Load the HTML content of the search results page
    const html = response.data;

    // Parse the HTML content using Cheerio
    const $ = load(html);

    // Extract and process search results
    $("h3").each((index, element) => {
      // Example: Log the titles of the search results
      const title = $(element).text();
      console.log(`Result ${index + 1}: ${title}`);
    });
  })
  .catch((error) => {
    console.error("Error:", error);
  });
