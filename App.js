import React, { useState, useEffect } from 'react';
import { PermissionsAndroid } from 'react-native';
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
    const [selectedContact, setSelectedContact] = useState({ label: "", value: -1 });

    const loadContacts = () => {
        Contacts.getAll((err, contacts) => {
            if (err === 'denied') {
                // error
            } else {
                const allContacts = sortFunc(contacts);
                let phoneNumbers = [];
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

    useEffect(() => {
    }, [selectedContact])

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
            let phoneNumbers = new Set(item[1].phoneNumbers.map(phoneNumber => (phoneNumber.number.replace(/-| /g, ''))));
            item[1].phoneNumbers = [];
            phoneNumbers.forEach((number) => {
                item[1].phoneNumbers.push({ number: number })
            })
            sortedList.push(item[1])
        })
        return sortedList;
    }
    const handleSearchTextChange = (text) => {
        setSearchText(text);
    }

    const getAvatarInitials = textString => {
        if (!textString) return "";

        const text = textString.trim();

        // console.log(text);
        const textSplit = text.split(" ");
        if (textSplit.length <= 1) {
            // console.log("single text", text.charAt(0));
            return text.charAt(0);

        }
        // console.log("double", textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0));
        return textSplit[0].charAt(0) + textSplit[textSplit.length - 1].charAt(0);
    };

    const onSelect = (item) => {
        setSelectedContact({
            ...selectedContact,
            label: item.displayName,
            value: item.phoneNumbers[0].number
        })
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
            <View style={{ padding: 10 }}>
                <View style={{
                    marginBottom: 10,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: "#515151"
                }}>
                    <View>
                        <Text style={{ fontSize: 20, fontWeight: "300" }}>
                            Number
                        </Text>
                    </View>
                </View>
                <View style={{ marginBottom: 15 }}>
                    <TextInput
                        placeholder="Enter Number"
                        onChangeText={(text) => handleSearchTextChange(text)}
                        value={searchText}
                    />
                </View>
            </View>
            <ListComponent contactsList={filteredContacts} onSelect={onSelect} />
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default App;
