import {
    ExpandLess,
    ExpandMore,
    FilterList,
    Refresh,
    Search,
    NavigateNext,
    NavigateBefore,
    GroupWork,
    Category
} from '@mui/icons-material';
import {
    Avatar, Chip, IconButton, InputAdornment, Menu,
    MenuItem, Paper, Table, Button, Select,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, TextField, Tooltip, Typography, FormControl, InputLabel
} from '@mui/material';
import React, { useState, useMemo } from 'react';
import "./RawLogs.scss";
import { emotion_labels, stimulus_types } from "../../data/dummyData";

const RawLogs = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [sortField, setSortField] = useState('Time');
    const [sortDirection, setSortDirection] = useState('asc');
    const [filterEmotion, setFilterEmotion] = useState('');
    const [filterStimulus, setFilterStimulus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [groupBy, setGroupBy] = useState('none');
    const [filterPhase, setFilterPhase] = useState('');
    const [filterFeature, setFilterFeature] = useState('');
    const entriesPerPage = 50;

    const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
    const handleFilterClose = (filter) => {
        setActiveFilter(filter);
        setAnchorEl(null);
    };

    const getEmotionName = (label) => emotion_labels[label] || 'Unknown';
    const getStimulusName = (type) => stimulus_types[type] || 'Unknown';

    const uniquePhases = useMemo(() => {
        return [...new Set(data.map(log => log.Phase))].sort();
    }, [data]);

    const uniqueFeatures = useMemo(() => {
        return [...new Set(data.map(log => log.FeatureName))].sort();
    }, [data]);

    const filteredAndSortedLogs = useMemo(() => {
        let filtered = [...data];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(log => {
                const emotionName = getEmotionName(log.Emotion.Label).toLowerCase();
                const stimulusName = getStimulusName(log.StimulusType).toLowerCase();
                const trackableId = log.TrackableId.toLowerCase();
                const featureName = log.FeatureName.toLowerCase();
                const searchLower = searchTerm.toLowerCase();
                
                return emotionName.includes(searchLower) ||
                       stimulusName.includes(searchLower) ||
                       trackableId.includes(searchLower) ||
                       featureName.includes(searchLower);
            });
        }

        // Apply emotion and stimulus filters
        if (filterEmotion) {
            filtered = filtered.filter(log => log.Emotion.Label === parseInt(filterEmotion));
        }
        if (filterStimulus) {
            filtered = filtered.filter(log => log.StimulusType === parseInt(filterStimulus));
        }
        if (filterPhase) {
            filtered = filtered.filter(log => log.Phase === parseInt(filterPhase));
        }
        if (filterFeature) {
            filtered = filtered.filter(log => log.FeatureName === filterFeature);
        }

        // Apply confidence and valence filters
        if (activeFilter === 'highConfidence') {
            filtered = filtered.filter(log => log.Emotion.Confidence > 0.7);
        } else if (activeFilter === 'negativeValence') {
            filtered = filtered.filter(log => log.Emotion.Valence < 0);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case 'Time':
                    comparison = a.Time - b.Time;
                    break;
                case 'Emotion':
                    comparison = getEmotionName(a.Emotion.Label).localeCompare(getEmotionName(b.Emotion.Label));
                    break;
                case 'Stimulus':
                    comparison = getStimulusName(a.StimulusType).localeCompare(getStimulusName(b.StimulusType));
                    break;
                case 'Valence':
                    comparison = a.Emotion.Valence - b.Emotion.Valence;
                    break;
                case 'Arousal':
                    comparison = a.Emotion.Arousal - b.Emotion.Arousal;
                    break;
                case 'Confidence':
                    comparison = a.Emotion.Confidence - b.Emotion.Confidence;
                    break;
                case 'TrackableId':
                    comparison = a.TrackableId.localeCompare(b.TrackableId);
                    break;
                case 'Phase':
                    comparison = a.Phase - b.Phase;
                    break;
                case 'FeatureName':
                    comparison = a.FeatureName.localeCompare(b.FeatureName);
                    break;
                default:
                    comparison = 0;
            }
            return sortDirection === 'asc' ? comparison : -comparison;
        });

        // Apply grouping
        if (groupBy !== 'none') {
            const groups = {};
            filtered.forEach(log => {
                let key;
                switch (groupBy) {
                    case 'trackable':
                        key = log.TrackableId;
                        break;
                    case 'stimulus':
                        key = getStimulusName(log.StimulusType);
                        break;
                    case 'emotion':
                        key = getEmotionName(log.Emotion.Label);
                        break;
                    case 'phase':
                        key = log.Phase;
                        break;
                    case 'feature':
                        key = log.FeatureName;
                        break;
                    default:
                        key = 'ungrouped';
                }
                if (!groups[key]) {
                    groups[key] = [];
                }
                groups[key].push(log);
            });
            return Object.values(groups).flat();
        }

        return filtered;
    }, [data, searchTerm, filterEmotion, filterStimulus, filterPhase, filterFeature, activeFilter, sortField, sortDirection, groupBy]);

    const paginatedLogs = useMemo(() => {
        const startIndex = (currentPage - 1) * entriesPerPage;
        return filteredAndSortedLogs.slice(startIndex, startIndex + entriesPerPage);
    }, [filteredAndSortedLogs, currentPage]);

    const totalPages = Math.ceil(filteredAndSortedLogs.length / entriesPerPage);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="raw-logs">
            <h2>Raw Emotion Logs</h2>
            
            <div className="searchContainer">
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search emotions, stimulus, trackable ID, or feature..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="searchField"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="primary" />
                            </InputAdornment>
                        )
                    }}
                />
                
                <div className="actionButtons">
                    <Tooltip title="Filter logs">
                        <IconButton
                            onClick={handleFilterClick}
                            className="filterButton"
                        >
                            <FilterList />
                        </IconButton>
                    </Tooltip>
                    
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => handleFilterClose(activeFilter)}
                    >
                        <MenuItem onClick={() => handleFilterClose('all')}>All Logs</MenuItem>
                        <MenuItem onClick={() => handleFilterClose('highConfidence')}>High Confidence</MenuItem>
                        <MenuItem onClick={() => handleFilterClose('negativeValence')}>Negative Valence</MenuItem>
                    </Menu>
                    
                    <Tooltip title="Refresh data">
                        <IconButton className="refreshButton">
                            <Refresh />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>

            <div className="filters">
                <div className="filter-group">
                    <label>Filter by Emotion:</label>
                    <select value={filterEmotion} onChange={(e) => setFilterEmotion(e.target.value)}>
                        <option value="">All Emotions</option>
                        {Object.entries(emotion_labels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>
                
                <div className="filter-group">
                    <label>Filter by Stimulus:</label>
                    <select value={filterStimulus} onChange={(e) => setFilterStimulus(e.target.value)}>
                        <option value="">All Stimuli</option>
                        {Object.entries(stimulus_types).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Filter by Phase:</label>
                    <select value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)}>
                        <option value="">All Phases</option>
                        {uniquePhases.map(phase => (
                            <option key={phase} value={phase}>Phase {phase}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Filter by Feature:</label>
                    <select value={filterFeature} onChange={(e) => setFilterFeature(e.target.value)}>
                        <option value="">All Features</option>
                        {uniqueFeatures.map(feature => (
                            <option key={feature} value={feature}>{feature}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Group By:</label>
                    <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
                        <option value="none">No Grouping</option>
                        <option value="trackable">Trackable Object</option>
                        <option value="stimulus">Stimulus Type</option>
                        <option value="emotion">Emotion</option>
                        <option value="phase">Phase</option>
                        <option value="feature">Feature</option>
                    </select>
                </div>
            </div>

            <div className="summary">
                <p>Total Logs: {filteredAndSortedLogs.length}</p>
                {(filterEmotion || filterStimulus || filterPhase || filterFeature || activeFilter !== 'all') && (
                    <p className="active-filters">
                        Active Filters: 
                        {filterEmotion && ` Emotion: ${getEmotionName(parseInt(filterEmotion))}`}
                        {filterStimulus && ` Stimulus: ${getStimulusName(parseInt(filterStimulus))}`}
                        {filterPhase && ` Phase: ${filterPhase}`}
                        {filterFeature && ` Feature: ${filterFeature}`}
                        {activeFilter === 'highConfidence' && ' High Confidence'}
                        {activeFilter === 'negativeValence' && ' Negative Valence'}
                    </p>
                )}
                {groupBy !== 'none' && (
                    <p className="grouping-info">
                        Grouped by: {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
                    </p>
                )}
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('Time')}>
                                Time {sortField === 'Time' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('Emotion')}>
                                Emotion {sortField === 'Emotion' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('Stimulus')}>
                                Stimulus {sortField === 'Stimulus' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('Valence')}>
                                Valence {sortField === 'Valence' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('Arousal')}>
                                Arousal {sortField === 'Arousal' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('Confidence')}>
                                Confidence {sortField === 'Confidence' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('TrackableId')}>
                                Trackable ID {sortField === 'TrackableId' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('Phase')}>
                                Phase {sortField === 'Phase' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('FeatureName')}>
                                Feature {sortField === 'FeatureName' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLogs.map((log, index) => (
                            <tr key={index}>
                                <td>{log.Time.toFixed(2)}s</td>
                                <td>{getEmotionName(log.Emotion.Label)}</td>
                                <td>{getStimulusName(log.StimulusType)}</td>
                                <td>{log.Emotion.Valence.toFixed(2)}</td>
                                <td>{log.Emotion.Arousal.toFixed(2)}</td>
                                <td>{log.Emotion.Confidence.toFixed(2)}</td>
                                <td>{log.TrackableId}</td>
                                <td>{log.Phase}</td>
                                <td>{log.FeatureName}: {log.FeatureValue.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <Button
                    startIcon={<NavigateBefore />}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span className="page-info">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    endIcon={<NavigateNext />}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

const ValenceBar = ({ value }) => (
    <div className="valenceBar">
        <span className="valueLabel" style={{ color: value < 0 ? '#f44336' : '#4caf50' }}>
            {value.toFixed(2)}
        </span>
        <div className="track" style={{ background: `linear-gradient(to right, #f44336 0%, #ffeb3b 50%, #4caf50 100%)` }}>
            <div className="thumb" style={{ left: `${(value + 1) * 50}%` }} />
        </div>
    </div>
);

const ArousalBar = ({ value }) => (
    <div className="arousalBar">
        <span className="valueLabel" style={{ color: value > 0.5 ? '#9c27b0' : '#2196f3' }}>
            {value.toFixed(2)}
        </span>
        <div className="track" style={{ background: `linear-gradient(to right, #bbdefb 0%, #9c27b0 100%)` }}>
            <div className="thumb" style={{ left: `${value * 100}%` }} />
        </div>
    </div>
);

const ConfidencePill = ({ value }) => (
    <div 
        className="confidencePill"
        style={{
            backgroundColor: value > 0.7 ? '#388e3c' : value > 0.4 ? '#f57c00' : '#d32f2f',
            borderColor: `rgba(255, 152, 0, ${0.3 + value * 0.4})`
        }}
    >
        {(value * 100).toFixed(0)}%
    </div>
);

export default RawLogs;