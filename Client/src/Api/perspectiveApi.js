import { handleApiError } from "./utils";
const apiKey = import.meta.env.VITE_PERSPECTIVE_API_KEY;

export const checkToxicity = async (textToAnalyze) => {
    try {
      const response = await fetch(`https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: { text: textToAnalyze },
          languages: ['en'],
          requestedAttributes: { TOXICITY: {} },
        }),
      });
      console.log(response);
      const data = await response.json();
      const toxicityScore = data.attributeScores.TOXICITY.summaryScore.value;
      console.log(toxicityScore)
      // Determine if the toxicity score exceeds the threshold
      const toxicityThreshold = 0.70; // Example threshold (adjust as needed)
      const isToxic = toxicityScore > toxicityThreshold;
      
      return isToxic;
    } catch (error) {
      console.error('Error analyzing text:', error);
      return null;
    }
  };
  