import { Sleeper } from "@sleeperhq/mini-core";
import React from "react";
import * as RN from 'react-native';
import { styles, ToolProps } from "../..";

const MoreTool = (props: ToolProps) => {
    const { playerData } = props;

    return (
        <RN.View>
            <Sleeper.Text style={styles.tabLabel}>What is Dynasty Daddy?</Sleeper.Text>
            <Sleeper.Text style={styles.text}>We are a free all-in-one fantasy football platform that ties fantasy data to your leagues seemlessly! This mini is just a sample of what we offer.</Sleeper.Text>
            <Sleeper.Text style={styles.text}>On the site we have league power rankings, a trade calculator, a trade finder, league simulations, a full trade database, and more! Level up your game with the best free tools on the market!</Sleeper.Text>

            <Sleeper.Text style={styles.tabLabel}>Do you like Trivia?</Sleeper.Text>
            <Sleeper.Text style={styles.text}>We also provide many daily trivia games like Immaculate Gridiron, the first football trivia grid!</Sleeper.Text>
            <Sleeper.Text style={styles.text}>Also check out Football Connections, NFL Wordle, and the NFL Team Game for more daily trivia games!</Sleeper.Text>
        </RN.View>
    );
};

const MoreToolStyles = RN.StyleSheet.create({
});

export default MoreTool;
