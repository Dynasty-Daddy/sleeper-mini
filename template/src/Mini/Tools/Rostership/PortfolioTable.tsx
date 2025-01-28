import { FlashList } from "@shopify/flash-list";
import { Sleeper } from "@sleeperhq/mini-core";
import React, { useEffect, useState } from "react";
import * as RN from 'react-native';
import DynastyDaddyTheme from "../../models/DynastyDaddyTheme";
import { RostersMap } from "@sleeperhq/mini-core/declarations/types";

type PortfolioProps = {
  rostershipMap: {},
};

const PortfolioTable = (props: PortfolioProps) => {
  const { rostershipMap } = props;

  const pageSize = 20;

  const playerPortfolio = Object.keys(rostershipMap).map(key => ({
    "sleeper_id": key,
    "count": rostershipMap[key]
  }));

  const [currentPage, setCurrentPage] = React.useState(1);
  const [visibleData, setVisibleData] = React.useState(playerPortfolio.slice(0, pageSize));

  const loadMoreItems = (newData) => {
    const nextPage = currentPage + 1;
    const endIndex = nextPage * pageSize;
    const visibleItems = newData.slice(0, endIndex);
    setVisibleData(visibleItems);
    setCurrentPage(nextPage);
  };

  useEffect(() => {
    setCurrentPage(1)
    setVisibleData(playerPortfolio.slice(0, pageSize))

  }, [rostershipMap]);

  const renderItem = ({ item }) => (
    <RN.View style={rankingsStyles.flatListItem}>
      <RN.View style={rankingsStyles.rankContainer}>
        <Sleeper.Text style={rankingsStyles.rank}>{item.count}</Sleeper.Text>
      </RN.View>
      <RN.View style={rankingsStyles.textContainer}>
        <Sleeper.Text style={rankingsStyles.fullName}>{item.sleeper_id}</Sleeper.Text>
        <Sleeper.Text style={rankingsStyles.team}>{'TODO '}</Sleeper.Text>
      </RN.View>
      <RN.View style={rankingsStyles.valueContainer}>
        <Sleeper.Text style={rankingsStyles.tradeValue}>{item.count}</Sleeper.Text>
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
      onEndReached={() => loadMoreItems(playerPortfolio)}
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
    flex: 1,
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
  }
});

export default PortfolioTable;
