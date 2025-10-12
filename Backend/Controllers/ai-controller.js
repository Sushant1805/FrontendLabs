require('dotenv').config();
const Problem = require('../Models/problems-model');

class AIController {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || null;
  }

  async explain(req, res) {
    try {
      const { code, problemId, problem, testResults } = req.body;

      if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: 'Code is required' });
      }

      // Fetch problem details if only id passed
      let problemData = problem || null;
      if (!problemData && problemId) {
        problemData = await Problem.findById(problemId).lean().exec();
      }

      // Build prompt
      const promptParts = [];
      promptParts.push('You are an assistant that helps debug JavaScript/React coding challenge solutions.');
      if (problemData) {
        promptParts.push(`Problem Title: ${problemData.title}`);
        promptParts.push(`Problem Description: ${problemData.description}`);
      }
      promptParts.push('User Code:');
      promptParts.push(code);
      if (Array.isArray(testResults) && testResults.length > 0) {
        promptParts.push('Failing Test Results:');
        testResults.forEach((r, i) => {
          promptParts.push(`Test ${i + 1}: name=${r.testName || ''}, input=${JSON.stringify(r.input)}, expected=${JSON.stringify(r.expected)}, received=${JSON.stringify(r.received)}, error=${r.error || ''}`);
        });
      }
      const prompt = promptParts.join('\n\n');

      if (!this.apiKey) {
        return res.status(500).json({ error: 'AI API key not configured on server' });
      }

      // Use official Google GenAI client
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const aiClient = new GoogleGenAI({ apiKey: this.apiKey });
        const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
        const genResp = await aiClient.models.generateContent({ model, contents: prompt });

        // Normalize response
        let generatedText = '';
        if (genResp && typeof genResp === 'object') {
          if (typeof genResp.text === 'string' && genResp.text.trim()) generatedText = genResp.text;
          else if (genResp?.candidates && genResp.candidates[0] && genResp.candidates[0].content) generatedText = genResp.candidates[0].content;
          else if (genResp?.reply && genResp.reply.candidates && genResp.reply.candidates[0] && genResp.reply.candidates[0].content) generatedText = genResp.reply.candidates[0].content;
          else generatedText = JSON.stringify(genResp);
        } else if (typeof genResp === 'string') {
          generatedText = genResp;
        }

        return res.json({ explanation: generatedText });
      } catch (e) {
        console.error('GoogleGenAI client error:', e && e.message ? e.message : e);
        return res.status(500).json({ error: 'GoogleGenAI client error', details: e && e.message ? e.message : String(e) });
      }

    } catch (error) {
      console.error('AI explain error:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
}

const controller = new AIController();
module.exports = {
  explain: controller.explain.bind(controller)
};
