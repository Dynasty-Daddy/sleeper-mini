import { Sleeper } from "@sleeperhq/mini-core";
import React, { useState } from "react";
import * as RN from 'react-native';
import DynastyDaddyTheme from "../../models/DynastyDaddyTheme";
import { ToolProps, styles } from "../..";
import { Dropdown } from "react-native-element-dropdown";
import Chip from "../../shared/chip";
import axios from "axios";
import TradeDatabaseTable from "./TradeDatabaseTable";

const TradeDBTool = (props: ToolProps) => {
    const { playerData, league } = props;
    const [searchPlayer, setSearchVal] = useState(null);
    const [trades, setTrades] = useState([]);
    const [isSuperflex, setIsSuperflex] = useState(true);
    const [isDynasty, setIsDynasty] = useState(true);
    const [loading, setLoading] = useState(false);
    const fetchTrades = async () => {
        try {
            const currentDate = new Date();
            const startDate = new Date(currentDate);
            startDate.setMonth(startDate.getMonth() - 1);
            setLoading(true);
            const body = {
                "sideA": searchPlayer ? [searchPlayer] : [],
                "sideB": [],
                "isSuperflex": [isSuperflex],
                "starters": null,
                "teams": null,
                "leagueType": isDynasty ? "Dynasty" : "Redraft",
                "ppr": null,
                "tep": null,
                "maxAssetCount": 8,
                "startDate": startDate.toISOString(),
                "endDate": currentDate.toISOString(),
                "page": 1,
                "pageLength": 16
            };
            const response = await axios.post('https://dynasty-daddy.com/api/v1/trade/search', body);
            setTrades(response.data.trades);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RN.View style={{ flex: 1 }}>
            <RN.TouchableOpacity onPress={() => RN.Linking.openURL('https://dynasty-daddy.com/trade-database')}>
                <Sleeper.Text style={[styles.DDDialog, { color: DynastyDaddyTheme.accent, textDecorationLine: 'underline' }]}>Full Trade Database</Sleeper.Text>
            </RN.TouchableOpacity>
            <RN.View>
                <Sleeper.Text style={styles.text}>Search real trades from over 1.6 mil trades!</Sleeper.Text>
            </RN.View>
            <Dropdown
                style={tradeDBStyles.dropdown}
                placeholderStyle={tradeDBStyles.placeholderStyle}
                selectedTextStyle={tradeDBStyles.selectedTextStyle}
                inputSearchStyle={tradeDBStyles.inputSearchStyle}
                data={playerData}
                search
                maxHeight={300}
                labelField="full_name"
                containerStyle={{ backgroundColor: DynastyDaddyTheme.backgroundCard }}
                itemContainerStyle={{ backgroundColor: DynastyDaddyTheme.backgroundCard }}
                itemTextStyle={{ color: DynastyDaddyTheme.primaryText }}
                valueField="sleeper_id"
                placeholder="Search Player"
                searchPlaceholder="Search..."
                value={searchPlayer}
                onChange={item => {
                    const selectedValue = item.position === 'PI' ? item.name_id : item.sleeper_id;
                    setSearchVal(selectedValue);
                }}
            />
            <RN.View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 3 }}>
                <Chip label={isDynasty ? 'Dynasty' : 'Redraft'} onPress={() => setIsDynasty(!isDynasty)} active={true} alwaysActive={true} />
                <Chip label={isSuperflex ? 'Superflex' : '1 QB'} onPress={() => setIsSuperflex(!isSuperflex)} active={true} alwaysActive={true} />
            </RN.View>
            <RN.View style={tradeDBStyles.buttonContainer}>
                <RN.Button title="Search" onPress={() => fetchTrades()} />
            </RN.View>
            {loading ? (
                <RN.ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <TradeDatabaseTable trades={trades} players={playerData} />
            )}
        </RN.View>
    );
};

const tradeDBStyles = RN.StyleSheet.create({
    dropdown: {
        margin: 8,
        height: 50,
        backgroundColor: DynastyDaddyTheme.backgroundCard,
        borderRadius: 12,
        padding: 12,
        shadowColor: DynastyDaddyTheme.accent,
        color: DynastyDaddyTheme.primaryText,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    placeholderStyle: {
        fontSize: 16,
        color: DynastyDaddyTheme.primaryText,
    },
    selectedTextStyle: {
        fontSize: 16,
        color: DynastyDaddyTheme.primaryText,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: DynastyDaddyTheme.primaryText,
        borderColor: DynastyDaddyTheme.accent,
    },
    popupContainer: {
        backgroundColor: DynastyDaddyTheme.backgroundCard,
        borderColor: DynastyDaddyTheme.accent,
        borderWidth: 0.5,
    },
    listItem: {
        padding: 10,
        borderBottomColor: DynastyDaddyTheme.accent,
        borderBottomWidth: 0.5,
    },
    listItemText: {
        fontSize: 16,
        color: DynastyDaddyTheme.primaryText,
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
});

export default TradeDBTool;
