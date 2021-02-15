import React from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { Surface, Subheading, Headline, Paragraph } from "react-native-paper";

import { Scroll, Divider } from "../../components";

const AccessPointSetup = ({ geofencingSetupDone }) => {
    return (
        <Scroll>
            <View style={{ flex: 1 }}>
                {!geofencingSetupDone ? (
                    <Surface style={styles.setupWarningContainer}>
                        <Subheading>
                            Please complete the GeoFencing setup first!
                        </Subheading>
                    </Surface>
                ) : (
                    <Surface style={styles.container}>
                        <Surface
                            style={{
                                paddingVertical: 8,
                                justifyContent: "center"
                            }}
                        >
                            <Headline style={{ marginLeft: 8 }}>
                                Access Points
                            </Headline>
                            <Divider
                                style={{
                                    marginHorizontal: 8,
                                    marginTop: 4,
                                    marginBottom: 16
                                }}
                            />
                            <Paragraph
                                style={{ marginHorizontal: 8, marginTop: 8 }}
                            >
                                Access points are imaginary points in your
                                hospital required to get accurate signal to
                                distance value from routers.
                            </Paragraph>
                            <Paragraph style={{ marginHorizontal: 8 }}>
                                These points should be at intervals of
                                approximately 4.5 metres.
                            </Paragraph>
                            <Paragraph
                                style={{
                                    marginHorizontal: 8,
                                    fontWeight: "bold"
                                }}
                            >
                                The more Access Points, the merrier!
                            </Paragraph>
                        </Surface>
                    </Surface>
                )}
            </View>
        </Scroll>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 8,
        elevation: 1,
        borderRadius: 8,
        padding: 8
    },
    setupWarningContainer: {
        flex: 1,
        elevation: 1,
        margin: 8,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8
    }
});

const mapStateToProps = (state) => ({
    geofencingSetupDone: state.geofencingSetupDone
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AccessPointSetup);
