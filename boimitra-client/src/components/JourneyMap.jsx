import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Polyline, Tooltip, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import bdGeoJson from '../data/bd-divisions.json';

// --- Premium Dark Theme Configuration ---

// Division color palette
const DIVISION_COLORS = {
    'Dhaka': { fill: '#f59e0b', border: '#fbbf24' },
    'Chittagong': { fill: '#22c55e', border: '#4ade80' },
    'Rajshahi': { fill: '#f97316', border: '#fb923c' },
    'Khulna': { fill: '#ec4899', border: '#f472b6' },
    'Barisal': { fill: '#3b82f6', border: '#60a5fa' },
    'Sylhet': { fill: '#ef4444', border: '#f87171' },
    'Rangpur': { fill: '#a855f7', border: '#c084fc' },
    'Mymensingh': { fill: '#14b8a6', border: '#2dd4bf' },
};

// Map center & bounds (Bangladesh)
const MAP_CENTER = [23.8, 90.3];
const MAP_ZOOM_LG = 7;
const MAP_ZOOM_SM = 6;

// Approximate division centroids for markers & paths
const CENTROIDS = {
    'Dhaka': [24.0, 90.3],
    'Chittagong': [22.7, 91.8],
    'Rajshahi': [24.5, 88.8],
    'Khulna': [22.8, 89.2],
    'Barisal': [22.3, 90.2],
    'Sylhet': [24.6, 91.8],
    'Rangpur': [25.8, 89.2],
    'Mymensingh': [24.8, 90.4],
};

// Custom CSS for Leaflet tooltips & pulsing dots injected globally via a style tag
const globalStyles = `
    .leaflet-container {
        background: #0b1120 !important;
        font-family: inherit;
    }
    .custom-tooltip {
        background: rgba(15, 23, 42, 0.95);
        border: 1px solid rgba(51, 65, 85, 0.8);
        border-radius: 12px;
        color: #f8fafc;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
        padding: 0;
        backdrop-filter: blur(8px);
    }
    .custom-tooltip::before { border-top-color: rgba(15, 23, 42, 0.95) !important; }
    
    .pulse-marker {
        width: 14px !important;
        height: 14px !important;
        background: #f59e0b;
        border-radius: 50%;
        box-shadow: 0 0 0 rgba(245, 158, 11, 0.8);
        animation: pulse-ring 2s infinite;
        border: 2px solid #fff;
    }
    @keyframes pulse-ring {
        0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); }
        70% { box-shadow: 0 0 0 15px rgba(245, 158, 11, 0); }
        100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
    }
`;

export default function JourneyMap({ bookContext }) {
    const [selectedDiv, setSelectedDiv] = useState(null);
    const [animStep, setAnimStep] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Dynamic Data State
    const [stats, setStats] = useState({});
    const [journey, setJourney] = useState([]);
    const [bookTitle, setBookTitle] = useState("Loading...");
    const [loading, setLoading] = useState(true);

    const geoJsonRef = useRef(null);

    // Initial setup and animation timer
    useEffect(() => {
        setIsMobile(window.innerWidth < 1024);
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);

        if (bookContext) {
            // Reconstruct the journey format expected by the map from the book object
            let parsedJourney = [];
            let previousLoc = 'Dhaka'; // Default fallback

            // If we had fetched user profiles we could get the owner's city, 
            // but for context map we can just start from the first journey step's from, or ignore the very first hop.
            // For simplicity, we just chain the journey hops
            bookContext.journey.forEach((j, idx) => {
                parsedJourney.push({
                    id: j._id || idx.toString(),
                    from: previousLoc, // This works if we assume consecutive hops
                    to: j.city,
                    reader: j.name,
                    date: j.to ? new Date(j.to).toLocaleDateString() : 'Unknown',
                    review: j.review
                });
                previousLoc = j.city;
            });

            // If someone is currently holding it, add the pending/active leg
            if (bookContext.current_holder) {
                parsedJourney.push({
                    id: 'current',
                    from: previousLoc,
                    to: bookContext.current_holder.city,
                    reader: bookContext.current_holder.name,
                    date: bookContext.current_holder.received_at ? new Date(bookContext.current_holder.received_at).toLocaleDateString() : 'Now',
                    review: 'Currently Reading...'
                });
            }

            setJourney(parsedJourney);
            setBookTitle(bookContext.title);

            // For a single book, stats are minimal but we can highlight the regions it touched
            const newStats = {};
            parsedJourney.forEach(j => {
                const div = j.to;
                if (!newStats[div]) newStats[div] = { nameBn: '', readers: 1, books: 1, handoffs: 1 };
                else newStats[div].handoffs++;
            });
            setStats(newStats);
            setLoading(false);
        } else {
            // Keep the fallback fetch logic if no bookContext is provided (e.g if we wanted a global map again)
            const fetchJourneyData = async () => {
                try {
                    const res = await fetch('http://localhost:5000/api/books/journey-map-data');
                    if (res.ok) {
                        const data = await res.json();
                        setStats(data.stats || {});
                        setJourney(data.featuredJourney || []);
                        setBookTitle(data.bookTitle || "Top Travelling Book");
                    }
                } catch (err) {
                    console.error("Failed to fetch journey map data:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchJourneyData();
        }

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [bookContext]);

    // Separated animation timer to depend on journey length
    useEffect(() => {
        if (journey.length === 0) return;
        const timer = setInterval(() => {
            setAnimStep(prev => (prev + 1) % (journey.length + 1));
        }, 1800);
        return () => clearInterval(timer);
    }, [journey]);


    // Determine which divisions a book has visited for styling
    const visitedDivs = new Set();
    for (let i = 0; i < Math.min(animStep, journey.length); i++) {
        if (journey[i]) {
            visitedDivs.add(journey[i].from);
            visitedDivs.add(journey[i].to);
        }
    }

    // Determine the current dot position
    const currentLocId = animStep > 0 && journey.length > 0 ? journey[Math.min(animStep, journey.length) - 1].to : null;
    const currentPos = currentLocId && CENTROIDS[currentLocId] ? CENTROIDS[currentLocId] : null;

    // GeoJSON styling function
    const styleFeature = (feature) => {
        const divName = feature.properties.NAME_1; // Based on the downloaded generic GeoJSON
        const isSelected = selectedDiv === divName;
        const isVisited = visitedDivs.has(divName);
        const c = DIVISION_COLORS[divName] || { fill: '#334155', border: '#475569' };

        return {
            fillColor: c.fill,
            fillOpacity: isSelected ? 0.6 : isVisited ? 0.4 : 0.15,
            color: isSelected ? '#fff' : c.border,
            weight: isSelected ? 2 : 0.8,
            dashArray: isSelected ? '' : '3',
            transition: 'all 0.4s ease'
        };
    };

    // GeoJSON event handlers
    const onEachFeature = (feature, layer) => {
        const divName = feature.properties.NAME_1;

        layer.on({
            mouseover: (e) => {
                const l = e.target;
                l.setStyle({ fillOpacity: selectedDiv === divName ? 0.6 : 0.5, weight: 1.5, dashArray: '' });
                l.bringToFront();
            },
            mouseout: (e) => {
                geoJsonRef.current.resetStyle(e.target);
            },
            click: () => {
                if (stats[divName]) setSelectedDiv(divName);
            }
        });

        // Add an elegant tooltip
        if (stats[divName] && DIVISION_COLORS[divName]) {
            const st = stats[divName];
            const tooltipContent = `
                <div class="px-3 py-2 text-xs min-w-[140px]">
                    <div class="flex items-center gap-2 mb-1.5 border-b border-slate-700/50 pb-1.5">
                        <span class="w-2.5 h-2.5 rounded-full" style="background:${DIVISION_COLORS[divName].fill}"></span>
                        <strong class="text-white text-sm">${divName}</strong>
                        <span class="text-slate-400 font-medium ml-auto">${st.nameBn}</span>
                    </div>
                    <div class="flex justify-between mt-1"><span class="text-slate-400">Readers:</span> <span class="text-amber-400 font-bold">${st.readers}</span></div>
                    <div class="flex justify-between"><span class="text-slate-400">Active Books:</span> <span class="text-emerald-400 font-bold">${st.books}</span></div>
                    <div class="flex justify-between"><span class="text-slate-400">Handoffs:</span> <span class="text-blue-400 font-bold">${st.handoffs}</span></div>
                </div>
            `;
            layer.bindTooltip(tooltipContent, {
                sticky: true,
                className: 'custom-tooltip',
                direction: 'top',
                offset: [0, -10]
            });
        }
    };

    // Pulse icon definition
    const pulseIcon = L.divIcon({
        className: 'pulse-marker',
        iconSize: [14, 14],
        iconAnchor: [7, 7]
    });

    if (loading) {
        return (
            <div className="flex flex-col lg:flex-row gap-6 w-full relative items-center justify-center min-h-[600px] bg-slate-900 rounded-3xl border border-slate-700">
                <span className="loading loading-spinner text-amber-500 loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6 w-full relative">
            <style dangerouslySetInnerHTML={{ __html: globalStyles }} />

            {/* === Map Panel === */}
            <div className="relative flex-1 bg-slate-900 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl min-h-[500px] lg:min-h-[600px] z-0">

                {/* Overlay Legend */}
                <div className="absolute top-4 left-4 z-[400] bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-xl p-3 shadow-lg w-full max-w-[14rem]">
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="text-amber-400">🗺️</span> {bookContext ? 'Visited Divisions' : 'Divisions'}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                        {Object.entries(DIVISION_COLORS)
                            .filter(([name]) => !bookContext || visitedDivs.has(name) || (currentLocId === name))
                            .map(([name, c]) => (
                                <button
                                    key={name}
                                    onClick={() => setSelectedDiv(v => v === name ? null : name)}
                                    className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full transition-all border ${selectedDiv === name ? 'text-slate-900 shadow-[0_0_10px_rgba(255,255,255,0.2)]' : 'text-slate-300 hover:bg-slate-800'}`}
                                    style={{
                                        backgroundColor: selectedDiv === name ? c.fill : c.fill + '22',
                                        borderColor: selectedDiv === name ? c.border : c.border + '66'
                                    }}
                                >
                                    {name}
                                </button>
                            ))}
                    </div>
                </div>

                <MapContainer
                    center={MAP_CENTER}
                    zoom={isMobile ? MAP_ZOOM_SM : MAP_ZOOM_LG}
                    scrollWheelZoom={false}
                    className="w-full h-full z-0"
                    doubleClickZoom={false}
                >
                    {/* CartoDB Dark Matter Base Map for a very premium, sleek dark mode feel */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {/* GeoJSON layer mapping Bangladesh regions */}
                    <GeoJSON
                        data={bdGeoJson}
                        style={styleFeature}
                        onEachFeature={onEachFeature}
                        ref={geoJsonRef}
                    />

                    {/* Animated Journey Lines */}
                    {journey.slice(0, animStep).map((step, idx) => {
                        const isLatest = idx === animStep - 1;
                        if (!CENTROIDS[step.from] || !CENTROIDS[step.to]) return null;
                        return (
                            <Polyline
                                key={step.id}
                                positions={[CENTROIDS[step.from], CENTROIDS[step.to]]}
                                pathOptions={{
                                    color: '#f59e0b',
                                    weight: 2.5,
                                    dashArray: '6, 8',
                                    opacity: isLatest ? 0.9 : 0.4
                                }}
                            />
                        );
                    })}

                    {/* Origin Dots (dimmed) */}
                    {Array.from(visitedDivs).map(divName => {
                        if (!CENTROIDS[divName]) return null;
                        return (
                            <Marker
                                key={`origin-${divName}`}
                                position={CENTROIDS[divName]}
                                icon={L.divIcon({
                                    className: 'bg-white rounded-full',
                                    iconSize: [6, 6],
                                    iconAnchor: [3, 3]
                                })}
                            />
                        );
                    })}

                    {/* Highly visible pulsing dot at current location */}
                    {currentPos && (
                        <Marker position={currentPos} icon={pulseIcon}>
                            <Popup className="bg-slate-900 rounded-xl border-slate-700 text-slate-300 shadow-xl pb-2">
                                <div className="text-center font-semibold text-amber-500 text-sm mb-1 mt-1">Book Located</div>
                                Currently in <b>{currentLocId}</b>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>

                {/* Tracking Badge overlay */}
                <div className="absolute bottom-4 left-4 z-[400] flex items-center gap-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-full px-4 py-2 shadow-xl">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                    <span className="text-xs sm:text-sm text-slate-200 font-medium">Tracking "{bookTitle}"</span>
                </div>
            </div>

            {/* === Detailed Side Panel === */}
            <div className="w-full lg:w-[22rem] flex flex-col gap-4">

                {/* Selected Division Detailed Info */}
                {selectedDiv && stats[selectedDiv] && DIVISION_COLORS[selectedDiv] ? (() => {
                    const st = stats[selectedDiv];
                    const c = DIVISION_COLORS[selectedDiv];
                    return (
                        <div className="bg-slate-900 rounded-3xl border p-6 shadow-2xl relative overflow-hidden transition-all duration-300" style={{ borderColor: c.fill + '66' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-bl-full pointer-events-none" style={{ background: c.fill }}></div>
                            <div className="flex justify-between items-start mb-5 relative z-10">
                                <div>
                                    <h3 className="text-white font-extrabold text-2xl tracking-tight leading-none mb-1">{selectedDiv}</h3>
                                    {st.nameBn && <span className="text-slate-400 font-medium text-sm bg-slate-800 px-2 py-0.5 rounded-md">{st.nameBn}</span>}
                                </div>
                                <button onClick={() => setSelectedDiv(null)} className="text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center transition-colors">✕</button>
                            </div>
                            <div className="space-y-3 relative z-10">
                                {[
                                    { label: bookContext ? 'Readers of this book' : 'Active Readers', val: st.readers, color: '#f59e0b', icon: '👥' },
                                    { label: bookContext ? 'Times Visited' : 'Total Handoffs', val: st.handoffs, color: '#3b82f6', icon: '🔄' },
                                ].map(row => (
                                    <div key={row.label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 flex justify-between items-center group hover:bg-slate-800 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg opacity-80">{row.icon}</span>
                                            <span className="text-slate-300 text-sm font-medium">{row.label}</span>
                                        </div>
                                        <span className="font-extrabold text-lg" style={{ color: row.color }}>{row.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })() : (
                    <div className="bg-slate-900 rounded-3xl border border-slate-700/80 p-6 shadow-xl text-center flex flex-col items-center justify-center min-h-[220px]">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl mb-4 border border-slate-700">🗺️</div>
                        <h3 className="text-white font-bold text-lg mb-1">Explore Regions</h3>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-[200px]">Click any division on the map to view detailed reader statistics and metrics.</p>
                    </div>
                )}

                {/* Journey Timeline Steps */}
                <div className="bg-slate-900 rounded-3xl border border-slate-700 p-6 shadow-xl flex-1 max-h-[400px] overflow-y-auto custom-scrollbar">
                    <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2 border-b border-slate-800 pb-3">
                        <span className="bg-amber-500/20 text-amber-500 p-1.5 rounded-lg text-sm">📍</span> Live Journey route
                    </h3>

                    {journey.length === 0 ? (
                        <p className="text-slate-500 text-sm italic py-4">No book is currently traveling...</p>
                    ) : (
                        <div className="space-y-0 pl-2">
                            {journey.map((step, i) => {
                                const isDone = i < animStep;
                                const isCurrent = i === animStep - 1;
                                const fromC = DIVISION_COLORS[step.from];
                                const toC = DIVISION_COLORS[step.to];

                                return (
                                    <div key={step.id} className={`flex items-start gap-4 transition-all duration-[600ms] ${isDone ? 'opacity-100 translate-y-0' : 'opacity-25 translate-y-2'}`}>
                                        {/* Timeline structural elements */}
                                        <div className="flex flex-col items-center pt-1 shrink-0">
                                            <div className={`w-3.5 h-3.5 rounded-full border-[2.5px] transition-all duration-300 z-10 ${isCurrent
                                                ? 'bg-amber-400 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-125'
                                                : isDone
                                                    ? 'bg-emerald-500 border-emerald-600'
                                                    : 'bg-slate-800 border-slate-700'
                                                }`} />
                                            {i < journey.length - 1 && (
                                                <div className={`w-0.5 h-full min-h-[48px] -mt-1 -mb-1 transition-all duration-500 ${isDone ? 'bg-emerald-600/50' : 'bg-slate-800'}`} />
                                            )}
                                        </div>

                                        {/* Content elements */}
                                        <div className="pb-6 pt-0.5 w-full">
                                            <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1 relative top-[-3px]">
                                                {step.from && (
                                                    <span className="font-bold text-[13px] bg-slate-800 px-2 py-0.5 rounded" style={{ color: fromC?.fill || '#f59e0b' }}>
                                                        {step.from}
                                                    </span>
                                                )}
                                                <span className="text-slate-500">→</span>
                                                {step.to && (
                                                    <span className="font-bold text-[13px] bg-slate-800 px-2 py-0.5 rounded" style={{ color: toC?.fill || '#f59e0b' }}>
                                                        {step.to}
                                                    </span>
                                                )}

                                            </div>
                                            <div className="flex items-center gap-2 text-xs mb-1">
                                                <span className="bg-blue-500/10 text-blue-400 font-medium px-1.5 py-0.5 rounded">{step.reader}</span>
                                                <span className="text-slate-500 flex items-center gap-1">⌚ {step.date}</span>
                                            </div>
                                            {step.review && (
                                                <p className="text-[11px] text-slate-400 italic bg-black/20 p-2 rounded border border-slate-800">
                                                    "{step.review}"
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
