import React, { useEffect, useState } from 'react';
import * as RN from 'react-native';
import { Types, Sleeper, Fonts } from '@sleeperhq/mini-core';
import DynastyDaddyTheme from './models/DynastyDaddyTheme';
import axios from "axios";
import TradeValuesTool from './Tools/TradeValues/TradeValuesTool';
import RankingsTool from './Tools/Rankings/RankingsTool';
import TradeDBTool from './Tools/TradeDB/TradeDBTool';
import WoRPTool from './Tools/Worp/WoRPTool';
import MoreTool from './Tools/More/MoreTool';
import _ from 'lodash';
import VideoTool from './Tools/Video/VideoTool';

type OwnProps = {
  context: Types.Context;
  actions: Types.Actions;
  entitlements: Types.Entitlements;
  events: Types.Events;
};

export type ToolProps = {
  playerData: FantasyPlayer[],
  rosters: Types.RostersMap,
  rosterId: string,
  userId: string,
  leagues: Types.LeaguesMap,
  league: Types.League
};

const tabs = [
  { id: 0, label: 'Feed' },
  { id: 1, label: 'Trade Values' },
  { id: 2, label: 'Trade DB' },
  { id: 3, label: 'WAR' },
  { id: 4, label: 'More' },
];

const ToolsByTabId = [
  VideoTool,
  TradeValuesTool,
  TradeDBTool,
  WoRPTool,
  MoreTool
]

const DEFAULT_TOOL = 1

const Mini = (props: OwnProps) => {
  const { league, leaguesMap, rostersInLeagueMap, playersInSportMap, user } = props.context;
  const [activeTab, setActiveTab] = useState(tabs[DEFAULT_TOOL].id);
  const [playerData, setPlayerData] = useState<FantasyPlayer[]>(null);
  const [selectedLeague, setSelectedLeague] = useState<Types.League>();
  const [selectedRosterMap, setRostersMap] = useState<Types.RostersMap>();
  const [selectedRosterId, setRosterId] = useState<string>();
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    if (league && league.sport === 'nfl' && rostersInLeagueMap) {
      const leagueId = league.league_id;
      const rosterMap = rostersInLeagueMap[leagueId];
      if (rosterMap) {
        setRostersMap(rosterMap);
        setSelectedLeague(league);
      }
    }
  }, [league, rostersInLeagueMap]);

  useEffect(() => {
    if (user && user.user_id && league && league.sport === 'nfl' && rostersInLeagueMap) {
      const leagueId = league.league_id;
      const leagueRosters = rostersInLeagueMap[leagueId];
      if (leagueRosters) {
        const rosterId = _.findKey(leagueRosters, roster => roster.owner_id === user.user_id);
        if (rosterId) {
          setUserId(user.user_id);
          setRosterId(rosterId);
        }
      }
    }
  }, [user, league, rostersInLeagueMap]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async (isDynasty = true) => {
    try {
      const url = 'https://dynasty-daddy.com/api/v1/player/all/today?market=' + (isDynasty ? '6' : '7');
      const response = await axios.get(url);
      setPlayerData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const ToolComponent = ToolsByTabId[activeTab];

  return (
    <RN.View style={styles.container}>
      <RN.View style={styles.tabView}>
        <RN.ScrollView
          horizontal
          contentContainerStyle={styles.tabContainer}
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map(tab => (
            <RN.TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                tab.id === activeTab && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Sleeper.Text style={styles.tabLabel}>{tab.label}</Sleeper.Text>
            </RN.TouchableOpacity>
          ))}
        </RN.ScrollView>
      </RN.View>

      <RN.View style={styles.toolView}>
        <RN.View style={styles.toolContainer}>
          {playerData ? (
            <ToolComponent
              playerData={playerData}
              rosters={selectedRosterMap}
              rosterId={selectedRosterId}
              userId={userId}
              leagues={leaguesMap}
              league={league}
            />
          ) : (
            <Sleeper.Text>Loading player data...</Sleeper.Text>
          )}
        </RN.View>
      </RN.View>
    </RN.View>
  );
}

export const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabView: {
    flex: 1
  },
  toolView: {
    flex: 9,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: DynastyDaddyTheme.backgroundBase,
  },
  text: {
    color: DynastyDaddyTheme.primaryText,
    padding: 10,
    ...Fonts.Styles.Body1,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DynastyDaddyTheme.backgroundBase,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: DynastyDaddyTheme.accentLight,
  },
  tabLabel: {
    fontSize: 14,
    color: DynastyDaddyTheme.primaryText,
    fontWeight: 'bold'
  },
  toolContainer: {
    flex: 1,
    backgroundColor: DynastyDaddyTheme.backgroundBase,
    alignItems: 'stretch'
  },
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

export default Mini;