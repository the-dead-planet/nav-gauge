import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '../../button';
import { Text } from '../../typography';
import { NotchedPanel } from './NotchedPanel';

const styles = StyleSheet.create({
    actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 18 },
    showcase: { gap: 16 },
});

export const Playground: FC = () => (
    <NotchedPanel color="primary" variant="fill-translucent"><Text>Responsive navigation telemetry surface.</Text></NotchedPanel>
);

export const Header: FC = () => (
    <NotchedPanel color="neutral" highlightColor="secondary" header={<Text>WARNING</Text>}><Text>Route data contains unresolved segments.</Text></NotchedPanel>
);

export const Gallery: FC = () => (
    <View style={styles.showcase}>
        <NotchedPanel color="primary" variant="fill" header={<Text>FILL</Text>}><Text>Primary</Text></NotchedPanel>
        <NotchedPanel color="secondary" variant="fill-inverse" header={<Text>INVERSE</Text>} glowStyle="glow"><Text>Secondary</Text></NotchedPanel>
        <NotchedPanel color="tertiary" variant="fill-translucent" header={<Text>TRANSLUCENT</Text>} glowStyle="animate-borders-glow"><Text>Tertiary</Text></NotchedPanel>
    </View>
);

export const States: FC = () => <View style={styles.showcase}><NotchedPanel active color="primary" header={<Text>ACTIVE</Text>}><Text>Highlighted panel</Text></NotchedPanel><NotchedPanel disabled color="primary" header={<Text>DISABLED</Text>}><Text>Disabled panel</Text></NotchedPanel></View>;

export const Confirmation: FC = () => (
    <NotchedPanel accessibilityRole="alert" color="neutral" highlightColor="primary" header={<Text>CONFIRM ROUTE DELETION</Text>}>
        <Text>This removes the selected route from local storage.</Text>
        <View style={styles.actions}>
            <Button variant="ghost">Cancel</Button>
            <Button color="primary" variant="fill">Delete route</Button>
        </View>
    </NotchedPanel>
);
