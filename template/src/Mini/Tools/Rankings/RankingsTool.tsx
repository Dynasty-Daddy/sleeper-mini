import { Fonts, Sleeper } from "@sleeperhq/mini-core";
import React from "react";
import * as RN from 'react-native';
import { ToolProps } from "../..";
import DynastyDaddyTheme from "../../models/DynastyDaddyTheme";

const RankingsTool = (props: ToolProps) => {
    const { playerData } = props;

    return (
        <RN.View>
            <RN.TouchableOpacity onPress={() => RN.Linking.openURL('https://dynasty-daddy.com/dynasty-rankings')}>
                <Sleeper.Text style={[RankingsToolStyles.DDDialog, { color: DynastyDaddyTheme.accent, textDecorationLine: 'underline' }]}>For more, visit Dynasty Daddy</Sleeper.Text>
            </RN.TouchableOpacity>
        </RN.View>
    );
};

const RankingsToolStyles = RN.StyleSheet.create({
    DDDialog: {
        color: DynastyDaddyTheme.primaryText,
        padding: 10,
        borderColor: DynastyDaddyTheme.primaryText,
        borderWidth: 1,
        borderRadius: 10,
        margin: 5,
        ...Fonts.Styles.Body1,
        flexWrap: 'wrap'
    },

});

export default RankingsTool;
