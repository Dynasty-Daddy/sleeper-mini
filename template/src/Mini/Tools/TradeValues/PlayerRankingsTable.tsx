import { FlashList } from "@shopify/flash-list";
import { Sleeper } from "@sleeperhq/mini-core";
import React, { useEffect, useState } from "react";
import * as RN from 'react-native';
import DynastyDaddyTheme from "../../models/DynastyDaddyTheme";
import { RostersMap } from "@sleeperhq/mini-core/declarations/types";

type PlayerRankingsTable = {
  playerData: FantasyPlayer[],
  isSuperflex: boolean,
  rosters: RostersMap,
  rosterId: string,
};

const PlayerRankingsTable = (props: PlayerRankingsTable) => {
  const { playerData, isSuperflex, rosters, rosterId } = props;

  const pageSize = 50;

  const [currentPage, setCurrentPage] = React.useState(1);
  const [visibleData, setVisibleData] = React.useState(playerData.slice(0, pageSize));

  const loadMoreItems = (newData) => {
    const nextPage = currentPage + 1;
    const endIndex = nextPage * pageSize;
    const visibleItems = newData.slice(0, endIndex);
    setVisibleData(visibleItems);
    setCurrentPage(nextPage);
  };

  useEffect(() => {
    playerData.sort((b,a) => (isSuperflex ? a.sf_trade_value : a.trade_value) - (isSuperflex ? b.sf_trade_value : b.trade_value))
    setCurrentPage(1)
    setVisibleData(playerData.slice(0, pageSize))
  }, [rosters, rosterId, playerData, isSuperflex]);

  const isOnMyRoster = (item) => {
    if (!item || !rosters || !rosterId || rosterId === '') return false;
    
    const roster = rosters[rosterId];
    if (!roster) return false;
  
    return [
      ...roster?.players || [],
      ...roster?.taxi || [],
      ...roster?.reserve || []
    ].includes(item.sleeper_id);
  };
  
  const renderItem = ({ item }) => (
    <RN.View style={rankingsStyles.flatListItem}>
      <RN.View style={[rankingsStyles.rankContainer,  isOnMyRoster(item) ? rankingsStyles.onMyRosterItem : null]}>
        <Sleeper.Text style={rankingsStyles.rank}>{isSuperflex ? item.sf_overall_rank : item.overall_rank}</Sleeper.Text>
      </RN.View>
      <RN.View style={rankingsStyles.textContainer}>
        <Sleeper.Text style={rankingsStyles.fullName}>{item.position == 'PI' ? item.first_name + ' ' + item.last_name : item.first_name[0] + '. ' + item.last_name}</Sleeper.Text>
        <Sleeper.Text style={rankingsStyles.team}>{item.position == 'PI' ? '' : item.team + ' · ' + item.age + ' y.o. '}</Sleeper.Text>
      </RN.View>
      <RN.View style={rankingsStyles.valueContainer}>
        <Sleeper.Text style={rankingsStyles.tradeValue}>{isSuperflex ? item.sf_trade_value : item.trade_value}</Sleeper.Text>
      </RN.View>
    </RN.View>
  );

  return (
    <FlashList
      data={visibleData}
      ListEmptyComponent={
        <Sleeper.Text>No Players Found.</Sleeper.Text>
      }
      renderItem={renderItem}
      onEndReached={() => loadMoreItems(playerData)}
      onEndReachedThreshold={0.1}
    />
  );
};

const rankingsStyles = RN.StyleSheet.create({
  flatListItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  textContainer: {
    paddingLeft: 10,
    flex: 3,
    flexDirection: 'column',
    marginRight: 10,
  },
  valueContainer: {
    flex: 1.2,
    flexDirection: 'column',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  fullName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
    color: DynastyDaddyTheme.primaryText
  },
  tradeValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: DynastyDaddyTheme.accentLight,
  },
  team: {
    fontSize: 10,
    color: DynastyDaddyTheme.secondaryText,
  },
  rank: {
    fontSize: 24,
    fontWeight: "bold",
    color: DynastyDaddyTheme.primaryText
  },
  rankContainer: {
    width: 50,
    justifyContent: 'center',
    height: '100%',
    backgroundColor: DynastyDaddyTheme.accent,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    alignItems: 'center',
    alignContent: 'center',
  },
  onMyRosterItem: {
    backgroundColor: DynastyDaddyTheme.primary,
  }
});

export default PlayerRankingsTable;
