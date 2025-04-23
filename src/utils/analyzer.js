import natural from 'natural';

// Simple keyword-based NLP analysis for threats, fake news, and sensitive content
export const analyzeMessage = (message, settings) => {
  const tokenizer = new natural.WordTokenizer();
  const words = tokenizer.tokenize(message.toLowerCase());
  let result = 'Safe';

  if (settings.threats && words.includes('bomb')) result = 'Threat';
  else if (settings.fakeNews && words.includes('click here to win')) result = 'Fake News';
  else if (settings.sensitive && words.includes('confidential')) result = 'Sensitive';

  return result;
};
