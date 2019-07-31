import React, {useState, useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import Contacts from 'react-native-contacts';
import {
    TextInput,
    View,
    Text,
    SafeAreaView,
    Platform,
    StyleSheet,
    Image
} from 'react-native';
import ListComponent from './src/Components/ListComponent';

const App = () => {
    const [contactsList, setContacts] = useState({});
    const [filteredContacts, setFilteredContacts] = useState({});
    const [searchText, setSearchText] = useState("");

    const loadContacts = () => {
        Contacts.getAll((err, contacts) => {
            if (err === 'denied') {
                // error
            } else {
                const allContacts = sortFunc(contacts);
                setContacts(allContacts);
                setFilteredContacts(allContacts)
            }
        })
    }

    async function requestContactPermission() {
        try {
            if (Platform.OS === "android") {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                    title: "Contacts",
                    message: "This app would like to view your contacts."
                }).then(() => {
                    loadContacts();
                });
            } else {
                loadContacts();
            }
        } catch (err) {
            console.warn(err);
        }
    }

    useEffect(() => {
        requestContactPermission();
    }, []);

    useEffect(() => {
        setFilteredContacts(searchData());
    }, [searchText]);

    const searchData = () => {
        let items = Object.values(contactsList);
        return items.filter(
            item => item.displayName.toLowerCase().indexOf(searchText.toLowerCase()) > -1
                || item.phoneNumbers.filter((phone) => phone.number.indexOf(searchText) > -1).length > 0
        );
    }
    const sortFunc = (contactsList) => {
        let entries = Object.entries(contactsList);
        let sorted = entries.sort((a, b) => a[1].displayName.toLowerCase() > b[1].displayName.toLowerCase() ? 1 : -1);
        // entries.sort((a, b) => console.log(b[1].displayName));
        const sortedList = [];
        sorted.map(item => {
            sortedList.push(item[1])
        })
        return sortedList;
    }
    const handleSearchTextChange = (text) => {
        setSearchText(text);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    paddingLeft: 100,
                    paddingRight: 100,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Image
                    source={require("./logo.png")}
                    style={{
                        aspectRatio: 6,
                        resizeMode: "contain"
                    }}
                />
            </View>
            <View style={{padding:10}}>
                <View style={{
                    marginBottom: 10,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: "#515151"
                }}>
                    <View>
                        <Text style={{fontSize: 20, fontWeight: "300"}}>
                            Number
                        </Text>
                    </View>
                </View>
                <View style={{marginBottom: 15}}>
                    <TextInput
                        placeholder="Enter Number"
                        onChangeText={(text) => handleSearchTextChange(text)}
                        value={searchText}
                    />
                </View>
            </View>
            <ListComponent contactsList={filteredContacts}/>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default App;
