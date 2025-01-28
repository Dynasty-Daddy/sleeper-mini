import { FlashList } from "@shopify/flash-list";
import { Sleeper } from "@sleeperhq/mini-core";
import React, { useEffect, useMemo } from "react";
import * as RN from 'react-native';
import DynastyDaddyTheme from "../../models/DynastyDaddyTheme";
import Chip from "../../shared/chip";

type TradeDatabaseTableProps = {
  trades: Trade[],
  players: FantasyPlayer[]
};

const TradeDatabaseTable = (props: TradeDatabaseTableProps) => {
  const { trades, players } = props;

  const getPlayerName = (playerId) => {
    const isPick = playerId.includes('pi');
    const pickId = isPick ? playerId.replace('.', '') : playerId;
  
    const player = players.find(p => p.sleeper_id === pickId || p.name_id === pickId);
  
    if (player) {
      return isPick ? player.full_name.replace('Mid ', '') : `${player.first_name[0]}. ${player.last_name}`;
    }
    
    return '';
  }

  const getPPRSettings = (ppr) => {
    switch(ppr) {
      case 1:
        return 'PPR';
      case 0.5:
        return 'Half PPR';
      case 0:
        return 'STD';
      default:
        return `{ppr}`
    }
  }

  const renderItem = ({ item }) => (
    <RN.View style={tradedbTableStyles.flatListItem}>
      <RN.View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',}}>
        <RN.View style={tradedbTableStyles.textContainer}>
          {item.sidea.map((player, index) => (
            <Sleeper.Text key={index} style={tradedbTableStyles.fullName}>
              {getPlayerName(player)}
            </Sleeper.Text>
          ))}
        </RN.View>
  
        <Sleeper.Text style={tradedbTableStyles.vsText}>X</Sleeper.Text>
  
        <RN.View style={tradedbTableStyles.textContainer}>
          {item.sideb.map((player, index) => (
            <Sleeper.Text key={index} style={tradedbTableStyles.fullName}>
              {getPlayerName(player)}
            </Sleeper.Text>
          ))}
        </RN.View>
      </RN.View>
  
      <RN.View style={tradedbTableStyles.chipContainer}>
        <Chip label={`${item.teams} teams`} onPress={true} active={true} alwaysActive={true} color={'yellow'} clickable={false}/>
        <Chip label={`Start ${item.starters}`} onPress={true} active={true} alwaysActive={true} color={'orange'} clickable={false}/>
        <Chip label={getPPRSettings(item.ppr)} onPress={true} active={true} alwaysActive={true} color={'red'} clickable={false}/>
      </RN.View>
    </RN.View>
  );
  
  
  const memoizedRenderItem = useMemo(() => renderItem, [trades, players]);

  return (
    <FlashList
      data={trades}
      ListEmptyComponent={
        <Sleeper.Text>No Players Found.</Sleeper.Text>
      }
      renderItem={memoizedRenderItem}
      keyExtractor={(item) => item.transaction_id}
    />
  );
};

const tradedbTableStyles = RN.StyleSheet.create({
  flatListItem: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: DynastyDaddyTheme.backgroundCard,
    borderRadius: 15,
    shadowColor: DynastyDaddyTheme.accent,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 10,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  fullName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
    color: DynastyDaddyTheme.primaryText,
  },
  vsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: DynastyDaddyTheme.primaryText,
    marginHorizontal: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: 5,
    marginBottom: 5,
  }
});



export default TradeDatabaseTable;
