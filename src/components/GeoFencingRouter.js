import React, { useState } from "react";
import { Subheading, Title } from "react-native-paper";
import OutlinedContainer from "./OutlinedContainer";
import Divider from "./Divider";
import NumericFormItem from "./NumericFormItem";

const GeoFencingRouter = ({ routerNumber }) => {
    const [routerLocation, setRouterLocation] = useState({
        horizontal: null,
        vertical: null,
        height: null
    });

    const inputProps = {
        minValue: 0,
        rounded: true,
        step: 100,
        totalWidth: 150,
        type: "up-down",
        inputStyle: {
            fontSize: 14
        },
        totalHeight: 50
    };

    return (
        <OutlinedContainer containerStyle={{ marginTop: 16 }}>
            <Subheading style={{ fontSize: 20, marginLeft: 8 }}>
                Router {routerNumber}
            </Subheading>
            <Divider dividerStyle={{ marginHorizontal: 8 }} />
            <NumericFormItem
                labelText={"Horizontal Distance:"}
                inputProps={inputProps}
                onChange={(val) =>
                    setRouterLocation({ ...routerLocation, horizontal: val })
                }
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={routerLocation.horizontal}
            />
            <NumericFormItem
                labelText={"Vertical Distance:"}
                inputProps={inputProps}
                onChange={(val) =>
                    setRouterLocation({ ...routerLocation, vertical: val })
                }
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={routerLocation.vertical}
            />
            <NumericFormItem
                labelText={"Height:"}
                inputProps={inputProps}
                onChange={(val) =>
                    setRouterLocation({ ...routerLocation, height: val })
                }
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={routerLocation.height}
            />
        </OutlinedContainer>
    );
};

export default GeoFencingRouter;
