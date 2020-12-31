import React from "react";
import { Subheading} from "react-native-paper";
import OutlinedContainer from "./OutlinedContainer";
import Divider from "./Divider";
import NumericFormItem from "./NumericFormItem";
import PropTypes from "prop-types";

const GeoFencingRouter = ({ routerNumber, value, onChange }) => {
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
                onChange={(val) => onChange({ ...value, horizontal: val })}
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={Math.round(value.horizontal)}
            />
            <NumericFormItem
                labelText={"Vertical Distance:"}
                inputProps={inputProps}
                onChange={(val) => onChange({ ...value, vertical: val })}
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={Math.round(value.vertical)}
            />
            <NumericFormItem
                labelText={"Height:"}
                inputProps={inputProps}
                onChange={(val) => onChange({ ...value, height: val })}
                helperText={"(in meters)"}
                labelStyle={{ fontSize: 16 }}
                value={Math.round(value.height)}
            />
        </OutlinedContainer>
    );
};

GeoFencingRouter.defaultProps = {
    value: {
        horizontal: 0,
        vertical: 0,
        height: 0
    }
};

GeoFencingRouter.propTypes = {
    routerNumber: PropTypes.number.isRequired,
    value: PropTypes.object,
    onChange: PropTypes.func.isRequired
};

export default GeoFencingRouter;
