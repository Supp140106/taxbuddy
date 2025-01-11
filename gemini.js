const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Load environment variables
dotenv.config();

// Create an instance of GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Define the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate the response
async function run(prompt) {
    try {
        const result = await model.generateContent(prompt);
        return result;
    } catch (err) {
        console.log(err);
    }
}

// Export the function
module.exports = run;
