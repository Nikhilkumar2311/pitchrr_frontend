/**
 * SlideChart Component
 * 
 * Renders charts for pitch deck slides using Recharts.
 * Supports: Pie, Bar, Line, Radar charts.
 */

import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    LineChart,
    Line,
    RadarChart,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';

interface ChartData {
    name: string;
    value: number;
    [key: string]: string | number;
}

interface SlideChartProps {
    type: 'pie' | 'bar' | 'line' | 'radar' | 'none';
    title?: string;
    data: ChartData[];
    theme?: {
        textColor: string;
        accentColor: string;
        tooltipBg?: string;
        tooltipText?: string;
    };
}

// Modern color palette for charts
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

// Format numbers to readable format (1.5k, 2.3M, 5B)
const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';

    if (absNum >= 1_000_000_000) {
        return sign + (absNum / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (absNum >= 1_000_000) {
        return sign + (absNum / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (absNum >= 1_000) {
        return sign + (absNum / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return sign + absNum.toFixed(0);
};

export function SlideChart({ type, title, data, theme }: SlideChartProps) {
    if (type === 'none' || !data || data.length === 0) {
        return null;
    }

    const textColor = theme?.textColor || '#4B5563';
    const accentColor = theme?.accentColor || '#3B82F6';
    const tooltipBg = theme?.tooltipBg || 'rgba(0,0,0,0.9)';
    const tooltipText = theme?.tooltipText || '#FFFFFF';

    // Common tooltip style that matches the theme
    const tooltipStyle = {
        backgroundColor: tooltipBg,
        border: 'none',
        borderRadius: '8px',
        color: tooltipText,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        padding: '8px 12px',
    };

    const renderChart = () => {
        switch (type) {
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={25}
                                outerRadius={45}
                                paddingAngle={3}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value) => [`$${formatNumber(Number(value ?? 0))}`, 'Value']}
                                contentStyle={tooltipStyle}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                );

            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                            <XAxis
                                dataKey="name"
                                tick={{ fill: textColor, fontSize: 10 }}
                                axisLine={{ stroke: textColor }}
                            />
                            <YAxis
                                tick={{ fill: textColor, fontSize: 10 }}
                                axisLine={{ stroke: textColor }}
                                tickFormatter={(value) => `$${formatNumber(value)}`}
                            />
                            <Tooltip
                                formatter={(value) => [`$${formatNumber(Number(value ?? 0))}`, 'Revenue']}
                                contentStyle={tooltipStyle}
                            />
                            <Bar dataKey="value" fill={accentColor} radius={[4, 4, 0, 0]}>
                                {data.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                );

            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                            <XAxis
                                dataKey="name"
                                tick={{ fill: textColor, fontSize: 10 }}
                                axisLine={{ stroke: textColor }}
                            />
                            <YAxis
                                tick={{ fill: textColor, fontSize: 10 }}
                                axisLine={{ stroke: textColor }}
                            />
                            <Tooltip
                                contentStyle={tooltipStyle}
                            />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={accentColor}
                                strokeWidth={3}
                                dot={{ fill: accentColor, strokeWidth: 1, r: 3 }}
                                activeDot={{ r: 4, fill: accentColor }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                );

            case 'radar':
                return (
                    <ResponsiveContainer width="100%" height={200}>
                        <RadarChart data={data} cx="50%" cy="50%" outerRadius="65%">
                            <PolarGrid stroke={textColor} strokeOpacity={0.3} />
                            <PolarAngleAxis
                                dataKey="name"
                                tick={{ fill: textColor, fontSize: 8 }}
                            />
                            <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={{ fill: textColor, fontSize: 8 }}
                            />
                            <Radar
                                name="Your Product"
                                dataKey="value"
                                stroke={accentColor}
                                fill={accentColor}
                                fillOpacity={0.5}
                            />
                            <Legend />
                            <Tooltip
                                contentStyle={tooltipStyle}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                );

            default:
                return null;
        }
    };

    return (
        <div>
            {title && (
                <h4
                    className="text-xs font-medium mb-1 text-center"
                    style={{ color: textColor }}
                >
                    {title}
                </h4>
            )}
            {renderChart()}
        </div>
    );
}
