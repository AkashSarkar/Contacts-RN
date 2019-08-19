import React from "react";
import { Image, View, Text, StyleSheet } from "react-native";
import asset from "../Asset";


const Avatar = (props) => {
    const renderImage = () => {
        const { img, width, height, roundedImage } = props;
        const { imageContainer, image } = styles;

        const viewStyle = [imageContainer];
        if (roundedImage)
            viewStyle.push({ borderRadius: Math.round(width + height) / 2 });
        return (
            <View style={viewStyle}>
                <Image style={image} source={img ? img : asset.contact} />
            </View>
        );
    };

    const renderPlaceholder = () => {
        const { placeholder, width, height, roundedPlaceholder } = props;
        const { placeholderContainer, placeholderText } = styles;

        const viewStyle = [placeholderContainer];
        if (roundedPlaceholder)
            viewStyle.push({ borderRadius: Math.round(width + height) / 2 });
        // console.log(placeholder);
        return (
            <View style={viewStyle}>
                <Text
                    adjustsFontSizeToFit
                    numberOfLines={1}
                    minimumFontScale={0.01}
                    style={[{ fontSize: placeholder.length > 1 ? Math.round(width) / 3 : Math.round(width) / 2 }, placeholderText]}
                >
                    {placeholder}
                </Text>
            </View>
        );
    };


    const { img, width, height } = props;
    const { container } = styles;
    return (
        <View style={[container, props.style, { width, height }]}>
            {renderImage()}
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        width: "100%"
    },
    imageContainer: {
        overflow: "hidden",
        justifyContent: "center",
        height: "100%"
    },
    image: {
        flex: 1,
        alignSelf: "stretch",
        width: undefined,
        height: undefined
    },
    placeholderContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#dddddd",
        height: "100%"
    },
    placeholderText: {
        fontWeight: "700",
        color: "#ffffff"
    }
});

export default Avatar;
