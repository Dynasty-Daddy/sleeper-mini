import { Sleeper } from "@sleeperhq/mini-core";
import React, { useEffect, useState } from "react";
import * as RN from 'react-native';
import PlayerRankingsTable from "./PlayerRankingsTable";
import DynastyDaddyTheme from "../../models/DynastyDaddyTheme";
import { ToolProps, styles } from "../..";
import Chip from "../../shared/chip";
import axios from "axios";

const TradeValuesTool = (props: ToolProps) => {
  const { playerData, rosters, rosterId } = props;
  const [selectedChips, setSelectedChips] = useState(["QB", "RB", "WR", "TE", "PI"]);
  const [filteredPlayerData, setPlayerData] = useState(playerData);
  const [isDynasty, setIsDynasty] = useState(true);
  const [isSuperflex, setIsSuperflex] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    updatePlayerData();
  }, [selectedChips]);

  const handleChipToggle = (chipValue) => {
    if (selectedChips.includes(chipValue)) {
      setSelectedChips(selectedChips.filter(chip => chip !== chipValue));
    } else {
      setSelectedChips([...selectedChips, chipValue]);
    }
  };

  const handleDynastyRedraftToggle = async () => {
    setIsDynasty(!isDynasty)
    setLoading(true)
    try {
      const url = 'https://dynasty-daddy.com/api/v1/player/all/market/' + (isDynasty ? '7' : '6');
      const response = await axios.get(url);
      const data = response.data;
      playerData.map(p => {
        const newData = data.find(pl => pl.name_id === p.name_id)
        p.sf_trade_value = newData.sf_trade_value;
        p.trade_value = newData.trade_value;
        p.position_rank = newData.position_rank;
        p.sf_position_rank = newData.sf_position_rank;
        p.overall_rank = newData.overall_rank;
        p.sf_overall_rank = newData.sf_overall_rank;
      })
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false)
    }
  };

  const toggleSuperflex = () => {
    setIsSuperflex(!isSuperflex)
  }

  const updatePlayerData = () =>
    setPlayerData(playerData.filter(player => selectedChips.includes(player.position)));

  return (
    <RN.View style={{ flex: 1 }}>
      <RN.TouchableOpacity onPress={() => RN.Linking.openURL('https://dynasty-daddy.com/dynasty-rankings')}>
        <Sleeper.Text style={[styles.DDDialog, { color: DynastyDaddyTheme.accent, textDecorationLine: 'underline' }]}>Open Full Player Rankings</Sleeper.Text>
      </RN.TouchableOpacity>
      <RN.View>
        <Sleeper.Text style={styles.text}>ADP Daddy trade values from real drafts</Sleeper.Text>
      </RN.View>
      <RN.View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 3 }}>
        <Chip label={isDynasty ? 'Dynasty' : 'Redraft'} onPress={() => handleDynastyRedraftToggle()} active={true} alwaysActive={true} />
        <Chip label={isSuperflex ? 'Superflex' : '1 QB'} onPress={() => toggleSuperflex()} active={true} alwaysActive={true} />
      </RN.View>
      <RN.View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 3 }}>
        <Chip label="QB" onPress={() => handleChipToggle("QB")} active={selectedChips.includes("QB")} />
        <Chip label="RB" onPress={() => handleChipToggle("RB")} active={selectedChips.includes("RB")} />
        <Chip label="WR" onPress={() => handleChipToggle("WR")} active={selectedChips.includes("WR")} />
        <Chip label="TE" onPress={() => handleChipToggle("TE")} active={selectedChips.includes("TE")} />
        <Chip label="Picks" onPress={() => handleChipToggle("PI")} active={selectedChips.includes("PI")} />
      </RN.View>
      {loading ? (
                <RN.ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <PlayerRankingsTable playerData={filteredPlayerData} rosters={rosters} rosterId={rosterId} isSuperflex={isSuperflex} />
            )}
    </RN.View>
  );
};


export default TradeValuesTool;
