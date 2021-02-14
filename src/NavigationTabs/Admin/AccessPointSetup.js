import React from "react";
import { StyleSheet, View } from "react-native";
import { connect } from "react-redux";
import { Surface, Subheading, Headline } from "react-native-paper";

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
                    <Surface style={styles.setupWarningContainer}>
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
        borderRadius: 8
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
