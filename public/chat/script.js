

let memory = JSON.parse(localStorage.getItem('memory')) || { history: [] };

async function sendMessage() {
  const input = document.getElementById("chat-input");
  const message = input.value.trim();

  if (message) {
    addMessage("user", message);
    input.value = ""; // Clear input field after sending
    let incomedata = localStorage.getItem("income-data");
    let incomeresult = localStorage.getItem("income-result")
    let propertybuy = localStorage.getItem("propertybuy")
    let propertysell = localStorage.getItem("propertysell")
    let vehicle = localStorage.getItem("vehicle")
    let a = `${incomedata} ${incomeresult} ${propertybuy} ${propertysell} ${vehicle}`
    try {
      const botResult = await fetchdata("/bot/send", {
        message: message,
        prev: JSON.stringify(memory),
        user_data : `${a}` // Send the memory to the backend
      });

      if (botResult && botResult.msg) {
        addMessage("bot", botResult.msg.replaceAll("*"," "));
        console.log(botResult);

        // Store message and bot response in memory
        memory.history.push({ user: message, bot: botResult.msg.replaceAll("*"," ") });
        
        // Save the updated memory to localStorage
        localStorage.setItem('memory', JSON.stringify(memory));
      } else {
        addMessage("bot", "Sorry, I couldn't process that. Please try again.");
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
      addMessage("bot", "There was an error. Please try again later.");
    }
  }
}

function addMessage(sender, text) {
  const chatMessages = document.getElementById("chat-messages");
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);

  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");
  messageContent.textContent = text;

  messageElement.appendChild(messageContent);
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function fetchdata(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Set the content type
      },
      body: JSON.stringify(data), // Convert data to JSON format for the request body
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json(); // Parse the JSON response
    return responseData; // Handle the data
  } catch (error) {
    console.error("Error posting data:", error); // Handle errors
    throw error; // Re-throw error to handle it in sendMessage
  }
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission if inside a form
    sendMessage();
  }
}

  