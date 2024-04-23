const apiUrl = 'http://localhost:1234/v1/chat/completions';

// Define headers object with Content-Type
const headers = {
  'Content-Type': 'application/json',
};

async function makeRequest() {
  const requestOptions = {
    method: 'POST',
    headers: headers, // Use the defined headers object
    body: JSON.stringify({
      model: 'local-model',
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
    console.log(data);

    // Check if the data object contains the 'choices' property
  if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
    console.error('No choices found in the response.');
      return null;
    }
    
    // Parse the response data and extract the generated questions
    const generatedQuestions = data.choices.map(choice => ({
      question: choice.text,
      choices: choice.answers,
      correctAnswer: choice.answer,
      explanation: choice.explanation
    }));
    
    // Format the questions into JSON
    const formattedQuestions = JSON.stringify(generatedQuestions, null, 2);
    
    return formattedQuestions; // Return the formatted JSON string
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
    return null; // Return null if there was an error
  }
}

async function getGeneratedQuestions() {
  try {
    const questionsJSON = await makeRequest();
    if (questionsJSON) {
      console.log(questionsJSON); // Log the formatted JSON string
      return questionsJSON; // Return the formatted JSON string
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
