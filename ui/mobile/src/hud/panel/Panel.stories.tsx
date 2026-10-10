import { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colorOptions, fillVariantOptions } from '@ui';
import { Text } from '../../typography';
import { Panel } from './Panel';

const styles = StyleSheet.create({
    container: { gap: 24, padding: 16 },
    section: { gap: 10 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
    cell: { flexBasis: 140, flexGrow: 1, gap: 8 },
    heading: { fontWeight: '700' },
});
export const Playground: FC = () => <Panel color="primary" variant="fill-translucent"><Text>Preview</Text></Panel>;
export const Gallery: FC = () => <ScrollView contentContainerStyle={styles.container}>{fillVariantOptions.map((variant) => <View key={variant} style={styles.section}><Text style={styles.heading}>{variant}</Text><View style={styles.grid}>{colorOptions.map((color) => <View key={color} style={styles.cell}><Text>{color}</Text><Panel color={color} variant={variant}><Text>Preview</Text></Panel></View>)}</View></View>)}</ScrollView>;
export const InteractiveGlow: FC = () => <View style={styles.grid}><Panel interactive color="primary"><Text>Default glow</Text></Panel><Panel interactive glowStyle="glow" color="secondary"><Text>Glow</Text></Panel><Panel interactive glowStyle="animate-borders-glow" color="tertiary"><Text>Borders</Text></Panel></View>;
export const States: FC = () => <View style={styles.grid}><Panel active color="primary" variant="fill-inverse"><Text>Active</Text></Panel><Panel disabled color="primary" variant="fill-inverse"><Text>Disabled</Text></Panel></View>;
