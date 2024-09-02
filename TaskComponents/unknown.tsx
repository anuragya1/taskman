import React from "react";
import { ScrollView, Text, View, StyleSheet, useColorScheme ,Image} from 'react-native';

const Unknown = (): React.JSX.Element => {
    const name: string = "Anurag is writing an app ";
    const colorScheme = useColorScheme();
    const darkmode:boolean = colorScheme === 'dark';

    return (
        <View>
            <View>
                <Text style={styles.flatcard}>
                    Flat Cards
                </Text>
            </View>
            <ScrollView horizontal={true}>
                <View style={styles.container}>
                    <View style={[styles.box, styles.red]}>
                        <Text style={styles.redText}>red</Text>
                    </View>
                    <View style={[styles.box, styles.green]}>
                        <Text style={styles.greenText}>green</Text>
                    </View>
                    <View style={[styles.box, styles.blue]}>
                        <Text style={styles.blueText}>blue</Text>
                    </View>
                    <View style={[styles.box, styles.blueVariant1]}>
                        <Text style={styles.blueText}>light blue</Text>
                    </View>
                    <View style={[styles.box, styles.blueVariant2]}>
                        <Text style={styles.blueText}>dark blue</Text>
                    </View>
                    <View style={[styles.box, styles.blueVariant3]}>
                        <Text style={styles.blueText}>sky blue</Text>
                    </View>
                </View>
            </ScrollView>
            <Image source={{uri:'./assets/native.jpg'}} style={{height:30,width:40}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        alignItems: 'flex-start',
        flexDirection: 'row',
        padding: 5,
    },
    flatcard: {
        color: 'steelblue',
        fontSize: 40,
        marginBottom: 5
    },
    box: {
        borderWidth: 4,
        borderRadius: 5,
        height: 75,
        width: 75,
        marginLeft: 10,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    red: {
        backgroundColor: 'crimson',
        borderColor: 'orange',
    },
    green: {
        backgroundColor: 'lightgreen',
        borderColor: 'skyblue',
    },
    blue: {
        backgroundColor: 'steelblue',
        borderColor: 'skyblue',
    },
    blueVariant1: {
        backgroundColor: '#ADD8E6', 
        borderColor: '#87CEEB', 
    },
    blueVariant2: {
        backgroundColor: '#00008B', 
        borderColor: '#1E90FF', 
    },
    blueVariant3: {
        backgroundColor: '#87CEEB',
        borderColor: '#4682B4', 
    },
    redText: {
        color: '#D3D3D3' 
    },
    greenText: {
        color: '#000000' 
    },
    blueText: {
        color: '#FFFFFF'
    }
});

export default Unknown;
