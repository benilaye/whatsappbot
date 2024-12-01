const responses = {
  greeting: ['Hello!', 'Hi there!', 'Greetings!'],
  thanks: ['You\'re welcome!', 'No problem!', 'Glad to help!'],
  default: ['Thank you for your message. I\'ll get back to you soon.', 
           'I\'ve received your message and will respond shortly.',
           'Thanks for reaching out! I\'ll review your message and respond soon.']
};

export async function generateResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for greetings
  if (lowerMessage.match(/\b(hi|hello|hey|greetings)\b/)) {
    return getRandomResponse('greeting');
  }
  
  // Check for thanks
  if (lowerMessage.match(/\b(thanks|thank you|thx)\b/)) {
    return getRandomResponse('thanks');
  }
  
  // Default response
  return getRandomResponse('default');
}

function getRandomResponse(type) {
  const options = responses[type];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}