import React, { useState, useEffect } from 'react';
import {
    FlatList,
    StyleSheet,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import Avatar from "./Avatar"

const ListComponent = ({ contactsList, onSelect }) => {
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
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={{
                    marginBottom: 15,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: "#515151"
                }}>

                    <Text style={{ fontSize: 18, fontWeight: "300" }}>
                        ALL CONTACTS
                    </Text>

                </View>
                <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={contactsList}
                    initialNumToRender={15}
                    renderItem={({ item }) => (
                        item.phoneNumbers.length > 0 &&
                        <TouchableOpacity
                            onPress={() => onSelect(item)}
                        >
                            <View style={styles.listWrapper}>
                                <Avatar
                                    img={
                                        item.hasThumbnail
                                            ? { uri: item.thumbnailPath }
                                            : undefined
                                    }
                                    width={40}
                                    height={40}
                                    roundedImage
                                    style={styles.imageStyle}
                                />
                                <View style={styles.detailsWrapper}>
                                    <Text style={styles.contact_details}>
                                        {item.displayName}
                                    </Text>
                                    {item.phoneNumbers.map((phone, index) => (
                                        <Text style={styles.phones}
                                            key={index}>{phone.number}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    //Setting the number of column
                    numColumns={1}
                />
            </View>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        marginLeft: 10,
    },
    phones: {
        fontSize: 16,
        textAlign: 'center',
        color: '#797979',
    },
    contact_details: {
        fontSize: 18,
        textAlign: 'center',
        color: '#1c1c1c',
    },
    imageStyle: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    listWrapper: {
        flexDirection: 'row',
        alignItems: "center",
        paddingBottom: 5,
    },
    detailsWrapper: {
        flex: 1,
        alignItems: "flex-start",
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#515151",
        paddingBottom: 5,
    }

});
export default ListComponent;
