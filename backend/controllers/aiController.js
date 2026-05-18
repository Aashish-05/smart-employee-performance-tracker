const axios = require('axios');
const Employee = require('../models/Employee');

exports.getRecommendations = async (req, res) => {
    try {
        const employees = await Employee.find();

        const prompt = `
        Analyze the following employees and provide:
        1. Promotion Recommendation (for high performance >= 85)
        2. Employee Ranking
        3. Training Suggestions (for those missing skills or low performance)
        4. AI Feedback Generation (Improvement feedback for low score < 70)

        Employees Data:
        ${JSON.stringify(employees, null, 2)}
        `;

        const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", {
            model: "openrouter/free", 
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        });

        res.json({ recommendations: response.data.choices[0].message.content });
    } catch (error) {
        console.error("AI API Error:", error.response?.data || error.message);
        res.status(500).json({ message: error.response?.data?.error?.message || error.message });
    }
};
