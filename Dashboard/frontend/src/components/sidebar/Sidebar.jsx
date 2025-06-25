import {
    Dashboard as DashboardIcon,
    DonutLarge as DonutIcon,
    EmojiEmotions as EmotionsIcon,
    ListAlt as LogListIcon,
    ExitToApp as LogoutIcon,
    AccountCircle as ProfileIcon,
    BubbleChart as ScatterIcon,
    Settings as SettingsIcon,
    InsertChart as StatsIcon,
    Timeline as TrendsIcon,
    GridOn as HeatmapIcon
} from "@mui/icons-material";
import "./sidebar.scss";

const Sidebar = ({ onMenuClick, activeView }) => {
    const menuItems = [
        {
            title: "CORE",
            items: [
                { id: "overview", label: "Overview", icon: <DashboardIcon className="icon" /> }
            ]
        },
        {
            title: "VISUALIZATIONS",
            items: [
                { id: "emotionDistribution", label: "Emotion Distribution", icon: <EmotionsIcon className="icon" /> },
                { id: "timeTrends", label: "Time Trends", icon: <TrendsIcon className="icon" /> },
                { id: "valenceArousal", label: "Valence-Arousal", icon: <ScatterIcon className="icon" /> },
                { id: "stimulusAnalysis", label: "Stimulus Analysis", icon: <DonutIcon className="icon" /> },
                { id: "heatmap", label: "Trackable Objects", icon: <HeatmapIcon className="icon" /> }
            ]
        },
        {
            title: "DATA",
            items: [
                { id: "rawLogs", label: "Raw Logs", icon: <LogListIcon className="icon" /> },
                { id: "statistics", label: "Statistics", icon: <StatsIcon className="icon" /> }
            ]
        }
    ];

    return (
        <div className="sidebar">
            <hr />
            <div className="center">
                <ul>
                    {menuItems.map((section, index) => (
                        <div key={index}>
                            <p className="title">{section.title}</p>
                            {section.items.map((item) => (
                                <li
                                    key={item.id}
                                    className={activeView === item.id ? "active" : ""}
                                    onClick={() => onMenuClick(item.id)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </li>
                            ))}
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;