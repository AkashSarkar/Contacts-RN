import React, {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import * as RNFS from 'react-native-fs';

import {
    FlatList,
    StyleSheet,
    ScrollView,
    View,
    Text,
    Image,
} from 'react-native';

const App = () => {
    const [contactsList, setContacts] = useState({});

    async function requestContactPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: 'Contacts',
                    message: 'This app would like to view your contacts.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Contacts.getAll((err, contacts) => {
                    if (err === 'denied') {
                        // error
                    } else {
                        setContacts(sortFunc(contacts));

                    }
                })
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }

    useEffect(() => {
        requestContactPermission();
    }, [])
    const sortFunc = (contactsList) => {
        let entries = Object.entries(contactsList);
        let sorted = entries.sort((a, b) => a[1].displayName > b[1].displayName ? 1 : -1);
        const sortedList = [];
        sorted.map(item => {
            RNFS.readFile(item[1].thumbnailPath, 'ascii').then(res => {
                console.log(res);
            }).catch(err => {
                console.log(err.message, err.code);
            });
            sortedList.push(item[1])
        })
        return sortedList;
    }
    console.log(contactsList);
    return (
        <ScrollView>
            <View style={styles.container}>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={contactsList}
                    renderItem={({item}) => (
                        item.phoneNumbers.length !== 0 &&
                        <View>
                            <Image
                                source={item.thumbnailPath ? {uri: item.thumbnailPath} : null}
                                height={60}
                                width={60}/>
                            <Text style={styles.contact_details}>
                                Name: {`${item.displayName} `}
                            </Text>
                            {item.phoneNumbers.map((phone, index) => (
                                <Text style={styles.phones}
                                      key={index}>{phone.label} : {phone.number}</Text>
                            ))}
                        </View>
                    )}
                    //Setting the number of column
                    numColumns={1}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        marginTop: 30,
    },
    phones: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    contact_details: {
        textAlign: 'center',
        color: 'red',
        margin: 10,
    },
});

export default App;
