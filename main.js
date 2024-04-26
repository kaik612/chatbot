const express = require('express');
const http = require('http');

const app = express();
app.use(express.json());


const apiUrl = 'http://localhost:1234/v1/chat/completions';
const headers = {
  'Content-Type': 'application/json',
};

app.post('/generate-questions', async (req, res) => {
  try {
    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        model: 'NousResearch/Hermes-2-Pro-Mistral-7B-GGUF/Hermes-2-Pro-Mistral-7B.Q2_K.gguf',
        messages: [
          { "role": "system", "content": "I am an assistant that can answer any question in Japanese, Vietnamese, and English." },
          { "role": "user", "content": "Generate multiple choice questions in Japanese about anything. Include the questions, four choices for each question, the correct answer, and an explanation for the correct answer. Return the response in JSON format, write me in Japanese" }
        ],
        temperature: 0.7,
        max_tokens: -1,
        stream: false
      }),
    };

    const response = await fetch(apiUrl, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    if (!data.choices || data.choices.length === 0) {
      console.error('No choices found in the response.');
      return res.status(500).json({ error: 'No choices found in the response' });
    }

    const parsableJSONresponse = response.data.choices[0].text(choice => ({
      question: choice.text,
      choices: choice.answers,
      correctAnswer: choice.answer,
      explanation: choice.explanation
    }));
    const parsedResponse = JSON.parse(parsableJSONresponse)

    return res.json(parsableJSONresponse);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
