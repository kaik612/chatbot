const apiUrl = 'http://localhost:1234/v1/chat/completions';

const headers = {
  'Content-Type': 'application/json',
};

async function makeRequest() {
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      model: 'TheBloke/dolphin-2.2.1-mistral-7B-GGUF',
      messages: [
        { "role": "system", "content": "I am an assistant that can answer any question in Japanese, Vietnamese, and English." },
        { "role": "user", "content": "Please generate multiple choice questions in Japanese about anything. Include the questions, four choices for each question, the correct answer, and an explanation for the correct answer. Return the response in JSON format, write me in Japanese" }
      ],
      temperature: 0.7,
      max_tokens: -1,
      stream: false
    }),
  };

  try {
    const response = await fetch(apiUrl, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Response data:', data); // Log the response data
    if (!data.choices || data.choices.length === 0) {
      console.error('No choices found in the response.');
      return null;
    }

    const generatedQuestions = data.choices.map(choice => ({
      question: choice.text,
      choices: choice.answers,
      correctAnswer: choice.answer,
      explanation: choice.explanation
    }));

    return JSON.stringify(generatedQuestions, null, 2);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null;
  }
}

async function getGeneratedQuestions() {
  try {
    const questionsJSON = await makeRequest();
    if (questionsJSON) {
      console.log(questionsJSON);
      return questionsJSON;
    } else {
      console.error('Failed to fetch generated questions.');
      return null;
    }
  } catch (error) {
    console.error('An error occurred while getting generated questions:', error);
    return null;
  }
}

getGeneratedQuestions();
