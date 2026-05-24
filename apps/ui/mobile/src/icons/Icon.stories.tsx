import { Fragment } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from "../typography";
import { Icons } from "@ui";
import iconRegistry from '../../../common/src/icons/svg/noun-project/icon-registry.json';
import { Icon } from './Icon';

const { NounProject, ...rest } = Icons;
const IconData = {
    ...NounProject,
    ...rest,
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        width: '100%',
    },
    item: {
        width: '33.3333%',
        padding: 8,
        justifyContent: 'center',
        flexDirection: 'row',
        textAlign: 'center'
    },
    title: {
        fontWeight: 700
    }
});

export const IconsOptions = () => (
    <View style={styles.container}>
        <Text style={[styles.item, styles.title]}>Icon</Text>
        <Text style={[styles.item, styles.title]}>Name</Text>
        <Text style={[styles.item, styles.title]}>Creator</Text>

        {Object.entries(IconData)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([iconName, Component]) => {
                const data = iconRegistry.find(
                    (el) => el.id.replace('-', '') === iconName.toLowerCase()
                ) as { creator: string; source: string; href: string } | undefined;

                return (
                    <Fragment key={iconName}>
                        <View style={styles.item}>
                            <Icon icon={Component} width={50} height={50} />
                        </View>
                        <Text style={styles.item}>{iconName}</Text>
                        {data
                            ? <Text style={styles.item}>{data.creator} from {data.source}</Text>
                            : <Text style={styles.item}>N/A</Text>}
                    </Fragment>
                );
            })}
    </View>
);
