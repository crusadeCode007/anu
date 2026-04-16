import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

export default function PieChartComponent({ data }) {
    if (!data || data.length === 0) {
        return <Text style={{ color: '#fff' }}>No Data Available</Text>;
    }

    const total = data.reduce((acc, curr) => acc + curr.count, 0);

    if (total === 0) {
        return <Text style={{ color: '#fff' }}>No Segment Data (All 0)</Text>;
    }

    let currentAngle = 0;
    const radius = 60;
    const center = 80;

    const createPieSlice = (item, index) => {
        const sliceAngle = (item.count / total) * 2 * Math.PI;
        
        const x1 = center + radius * Math.cos(currentAngle);
        const y1 = center + radius * Math.sin(currentAngle);
        
        currentAngle += sliceAngle;
        
        const x2 = center + radius * Math.cos(currentAngle);
        const y2 = center + radius * Math.sin(currentAngle);
        
        // If slice is 100% of pie, draw a full circle
        if (item.count === total) {
            return (
                <Path
                    key={index}
                    d={`M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center - 0.01} ${center - radius} Z`}
                    fill={item.color}
                />
            );
        }

        const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
        
        const d = [
            `M ${center} ${center}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');

        return <Path key={index} d={d} fill={item.color} />;
    };

    return (
        <View style={styles.container}>
            <View style={styles.chartArea}>
                <Svg width={160} height={160}>
                    <G>{data.map(createPieSlice)}</G>
                </Svg>
            </View>
            <View style={styles.legendArea}>
                {data.map((item, index) => (
                    <View key={index} style={styles.legendRow}>
                        <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                        <Text style={styles.legendText}>
                            {item.name} ({item.count})
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#1E1E24',
        borderRadius: 12,
        marginBottom: 15
    },
    chartArea: {
        width: 160,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center'
    },
    legendArea: {
        flex: 1,
        marginLeft: 20,
        justifyContent: 'center'
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    colorBox: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8
    },
    legendText: {
        color: '#ccc',
        fontSize: 12
    }
});
