import { Sleeper } from "@sleeperhq/mini-core";
import React, { useEffect, useState } from "react";
import * as RN from 'react-native';
import { styles, ToolProps } from "../..";
import DynastyDaddyTheme from "../../models/DynastyDaddyTheme";
import { LineChart } from "react-native-chart-kit";

const WoRPTool = (props: ToolProps) => {
    const { playerData, league } = props;
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formattedData, setFormattedData] = useState({ labels: [], datasets: [] });

    const screenWidth = RN.Dimensions.get('window').width;

    const formatSettings = async (snakeCaseObj) => {
        const formattedObj = {}
        const keyMapping = {
            fum: 'fum',
            fum_lost: 'fumLost',
            pass_2pt: 'pass2pt',
            pass_int: 'passInt',
            pass_td: 'passTd',
            pass_td_40p: 'pass40YdPTd',
            pass_int_td: 'passIntTd',
            pass_yd: 'passYd',
            pass_att: 'passAtt',
            pass_cmp: 'passCmp',
            pass_cmp_40p: 'passCmp40YdP',
            pass_fd: 'passFD',
            pass_inc: 'passInc',
            pass_sack: 'passSack',
            rec: 'rec',
            rec_2pt: 'rec2pt',
            rec_td: 'recTd',
            rec_yd: 'recYd',
            rec_fd: 'recFD',
            rec_40p: 'rec40YdP',
            rec_td_40p: 'rec40YdPTd',
            rec_0_4: 'rec_0_4',
            rec_5_9: 'rec_5_9',
            rec_10_19: 'rec_10_19',
            rec_20_29: 'rec_20_29',
            rec_30_39: 'rec_30_39',
            rush_2pt: 'rush2pt',
            rush_td: 'rushTd',
            rush_yd: 'rushYd',
            rush_att: 'rushAtt',
            rush_fd: 'rushFD',
            rush_40p: 'rush40YdP',
            rush_td_40p: 'rush40YdPTd',
            bonus_pass_cmp_25: 'bonusPassCmp25',
            bonus_pass_yd_300: 'bonusPassYd300',
            bonus_pass_yd_400: 'bonusPassYd400',
            bonus_rec_rb: 'bonusRecRB',
            bonus_rec_te: 'bonusRecTE',
            bonus_rec_wr: 'bonusRecWR',
            bonus_rec_yd_100: 'bonusRecYd100',
            bonus_rec_yd_200: 'bonusRecYd200',
            bonus_rush_att_20: 'bonusRushAtt20',
            bonus_rush_rec_yd_100: 'bonusRushRecYd100',
            bonus_rush_rec_yd_200: 'bonusRushRecYd200',
            bonus_rush_yd_100: 'bonusRushYd100',
            bonus_rush_yd_200: 'bonusRushYd200',
            idp_blk_kick: 'idpBlkKick',
            idp_def_td: 'idpDefTd',
            idp_ff: 'idpFF',
            idp_fum_rec: 'idpFumRec',
            idp_fum_ret_yd: 'idpFumRetYd',
            idp_int: 'idpInt',
            idp_int_ret_yd: 'idpIntRetYd',
            idp_pass_def: 'idpPassDef',
            idp_qb_hit: 'idpQBHit',
            idp_sack: 'idpSack',
            idp_safe: 'idpSafety',
            idp_tkl: 'idpTkl',
            idp_tkl_ast: 'idpTklAst',
            idp_tkl_loss: 'idpTklLoss',
            idp_tkl_solo: 'idpTklSolo',
            def_st_ff: 'defStFF',
            def_st_fum_rec: 'defStFumRec',
            def_st_td: 'defStTd',
            def_td: 'defTd',
            sack: 'sack',
            safe: 'safety',
            blk_kick: 'blkKick',
            int: 'int',
            pts_allow_0: 'defPtsStart',
            pts_allow: 'defPtsAllowedMod',
            st_ff: 'stFF',
            st_td: 'stTd',
            st_fum_rec: 'stFumRec',
            pr_td: 'prTd',
            kr_td: 'krTd',
            pr_yd: 'prYd',
            kr_yd: 'krYd',
            fgm: 'fgMade',
            fgmiss: 'fgMiss',
        };
    
        Object.keys(keyMapping).forEach(key => {
            formattedObj[keyMapping[key]] = snakeCaseObj?.[key] || 0;
        });
        return formattedObj;
    };
    
    const prepareChartData = (dataPoints) => {
        const positionData = {};
    
        // Extract worp values by position
        for (const player in dataPoints) {
            if ('w' in dataPoints[player]) {
                const { w } = dataPoints[player];
                const pos = w.pos;
                const worp = w.worp;

                if (!positionData[pos]) {
                    positionData[pos] = [];
                }
                positionData[pos].push({ player, worp });
            }
        }
    

        // Sort and prepare datasets for each position
        const datasets = [];
        for (const pos in positionData) {
            const sortedData = positionData[pos]
                .sort((a, b) => b.worp - a.worp)
                .map((item, index) => ({
                    rank: index + 1, 
                    worp: item.worp,
                }));
    
            datasets.push({
                label: pos,
                data: sortedData.map(d => d.worp).slice(0, 50),
            });
        }
        console.log(JSON.stringify(datasets))
    
        return {
            labels: datasets[0]?.data.map((_, index) => (index + 1).toString()) || [], // Ranks as labels
            datasets: datasets,
        };
    };

    const FetchLeagueFormat = async () => {
        setLoading(true)
        const positionCounts = {
            QB: 0,
            RB: 0,
            WR: 0,
            TE: 0,
            FLEX: 0,
            SUPER_FLEX: 0,
            K: 0,
            DF: 0,
            LB: 0,
            DB: 0,
            DL: 0,
            IDP_FLEX: 0,
        };
        
        // Loop through roster positions and count
        league.roster_positions?.forEach(position => {
            const posToCount = position === "DEF" ? "DF" : position;
            if (positionCounts.hasOwnProperty(posToCount)) {
                positionCounts[posToCount]++;
            }
        });

        positionCounts["teamCount"] = league.total_rosters; 

        const settings = await formatSettings(league.scoring_settings)
        const body = {
            seasons: [Number(league.season) > 2020 ? Number(league.season) : 2024],
            startWeek: 1,
            endWeek: 17,
            format: positionCounts,
            settings: settings,
        };

        try {
            const res = await fetch('https://dynasty-daddy.com/api/v1/league/format', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            setResponse(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        FetchLeagueFormat();
    }, [league]);


    useEffect(() => {
        const chartData = prepareChartData(response);
        const newFormattedData = {
            labels: chartData.labels,
            datasets: chartData.datasets.map(dataset => ({
                data: dataset.data,
                strokeWidth: 2, // optional
            })),
        };
        setFormattedData(newFormattedData);
    }, [response]);

    return (
        <RN.View style={{ flex: 1 }}>
            <RN.TouchableOpacity onPress={() => RN.Linking.openURL('https://dynasty-daddy.com/league/format')}>
                <Sleeper.Text style={[styles.DDDialog, { color: DynastyDaddyTheme.accent, textDecorationLine: 'underline' }]}>Full WAR Tool</Sleeper.Text>
            </RN.TouchableOpacity>
            <RN.View>
                <Sleeper.Text style={styles.text}>Calculate Fantasy WAR for your league!</Sleeper.Text>
            </RN.View>
            {!league ? (
                <RN.View>
                    <Sleeper.Text>Select a League</Sleeper.Text>
                </RN.View>
            ) : loading || formattedData.datasets.length == 0 ? (
                <RN.ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <RN.View>
                    <Sleeper.Text>loaded</Sleeper.Text>
                    <LineChart
                        data={formattedData}
                        width={screenWidth - 30}
                        height={220}
                        yAxisLabel="$"
                        chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 2,
                            color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                stroke: '#ffa726',
                            },
                        }}
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                </RN.View>
            )}
        </RN.View>
    );
};

const WoRPToolStyles = RN.StyleSheet.create({
});

export default WoRPTool;
