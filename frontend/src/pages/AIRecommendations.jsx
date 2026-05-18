import { useState } from 'react';
import axios from '../api/axios';
import { Brain } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './AIRecommendations.css';

const AIRecommendations = () => {
    const [recommendations, setRecommendations] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchRecommendations = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/ai/recommend');
            setRecommendations(res.data.recommendations);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch recommendations');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ai-container">
            <div className="ai-header-card">
                <div className="ai-title">
                    <Brain className="ai-icon" />
                    <h2>AI Insights & Recommendations</h2>
                </div>
                <button onClick={fetchRecommendations} disabled={loading} className="btn-primary generate-btn">
                    {loading ? 'Generating Insights...' : 'Generate AI Report'}
                </button>
            </div>
            {error && <p className="error-msg">{error}</p>}
            
            {loading && (
                <div className="ai-loading">
                    <div className="ai-loader"></div>
                    <p>Analyzing employee performance and skills...</p>
                </div>
            )}

            {recommendations && !loading && (
                <div className="ai-content markdown-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{recommendations}</ReactMarkdown>
                </div>
            )}
            
            {!recommendations && !loading && !error && (
                <div className="ai-content" style={{textAlign: 'center', color: '#a0a0b0'}}>
                    <p>Click the button above to generate an AI-powered report covering promotion recommendations, employee ranking, training suggestions, and feedback based on current employee data.</p>
                </div>
            )}
        </div>
    );
};

export default AIRecommendations;
