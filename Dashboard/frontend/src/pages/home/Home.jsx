import { useState, useMemo, useEffect } from "react";
import { dummyData, calculateStats } from "../../data/dummyData";
import Navbar from "../../components/navbar/Navbar";
import Overview from "../../components/overview/Overview";
import RawLogs from "../../components/RawLogs/RawLogs";
import Sidebar from "../../components/sidebar/sidebar";
import EmotionDistribution from "../../components/visualizations/EmotionDistribution";
import TimeTrends from "../../components/visualizations/TimeTrends";
import ValenceArousal from "../../components/visualizations/ValenceArousal";
import StimulusAnalysis from "../../components/visualizations/StimulusAnalysis";
import Statistics from "../../components/statistics/Statistics";
import Heatmap from "../../components/visualizations/Heatmap";
import "./Home.scss";

const Home = () => {
    const [activeView, setActiveView] = useState("overview");
    const [sessionData, setSessionData] = useState(dummyData);

    useEffect(() => {
        // Get session data from localStorage
        const storedData = localStorage.getItem('currentSessionData');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setSessionData(parsedData);
            } catch (err) {
                console.error('Error parsing stored session data:', err);
            }
        }
    }, []);

    const stats = useMemo(() => calculateStats(sessionData), [sessionData]);

    const handleMenuClick = (view) => {
        setActiveView(view);
    };

    const renderContent = () => {
        switch (activeView) {
            case "overview":
                return <Overview data={sessionData} stats={stats} />;
            case "emotionDistribution":
                return <EmotionDistribution data={sessionData} stats={stats} />;
            case "timeTrends":
                return <TimeTrends data={sessionData} />;
            case "valenceArousal":
                return <ValenceArousal data={sessionData} />;
            case "stimulusAnalysis":
                return <StimulusAnalysis data={sessionData} stats={stats} />;
            case "heatmap":
                return <Heatmap data={sessionData} />;
            case "rawLogs":
                return <RawLogs data={sessionData} />;
            case "statistics":
                return <Statistics data={sessionData} />;
            default:
                return <Overview data={sessionData} stats={stats} />;
        }
    };

    return (
        <div className="home">
            <Navbar />
            <div className="homeContainer">
                <Sidebar activeView={activeView} onMenuClick={handleMenuClick} />
                <div className="content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Home;
