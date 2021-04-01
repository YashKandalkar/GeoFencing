import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
    Title,
    Button,
    Dialog,
    Portal,
    Surface,
    withTheme,
    Subheading,
    Paragraph
} from "react-native-paper";

import DoctorListItem from "./DoctorListItem";

const DoctorList = ({
    theme,
    doctors,
    onAddClick,
    containerStyle,
    onDoctorRemove
}) => {
    const { colors } = theme;
    const [loading, setLoading] = useState(false);
    const [dialog, setDialog] = useState({
        title: null,
        content: null,
        onAction: null
    });

    const onRemoveClick = (ind) => {
        setDialog({
            title: "Remove Doctor",
            content: `Are you sure you want to remove ${doctors[ind].name}?`,
            onAction: () => {
                setLoading(true);
                onDoctorRemove(ind, () => {
                    setLoading(false);
                    setDialog({ title: null });
                });
            }
        });
    };

    return (
        <>
            <Surface
                style={{
                    ...styles.container,
                    ...containerStyle
                }}
            >
                <Surface
                    style={{
                        ...styles.topBar,
                        backgroundColor: colors.primary
                    }}
                >
                    <Title style={{ color: "#fff" }}>Doctor List</Title>
                    <Button
                        compact
                        icon={"plus"}
                        mode="contained"
                        color={colors.background}
                        labelStyle={{ color: colors.primary, marginRight: 14 }}
                        onPress={() => onAddClick()}
                    >
                        Add
                    </Button>
                </Surface>
                {doctors?.length ? (
                    doctors.map((el, ind) => (
                        <DoctorListItem
                            docInfo={el}
                            key={ind}
                            ind={ind}
                            onDoctorRemove={onRemoveClick}
                        />
                    ))
                ) : (
                    <View style={styles.addDoctorsMessage}>
                        <Subheading
                            style={{ textAlign: "center", marginBottom: 16 }}
                        >
                            Click the add button to add Doctors!
                        </Subheading>
                        <Button
                            compact
                            icon={"plus"}
                            mode="contained"
                            labelStyle={{ marginRight: 14 }}
                            onPress={() => onAddClick()}
                        >
                            Add
                        </Button>
                    </View>
                )}
            </Surface>
            <Portal>
                <Dialog
                    visible={dialog.title !== null}
                    onDismiss={() => setDialog({ title: null })}
                >
                    <Dialog.Title>{dialog.title}</Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>{dialog.content}</Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialog({ title: null })}>
                            Cancel
                        </Button>
                        <Button loading={loading} onPress={dialog.onAction}>
                            Delete
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        elevation: 2,
        marginHorizontal: 6,
        borderRadius: 8
    },
    topBar: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        paddingVertical: 8,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    addDoctorsMessage: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 32,
        textAlign: "center"
    }
});

export default withTheme(DoctorList);
