import { Fonts, Sleeper } from "@sleeperhq/mini-core";
import React, { useEffect } from "react";
import * as RN from 'react-native';
import { ToolProps, styles } from "../..";
import DynastyDaddyTheme from "../../models/DynastyDaddyTheme";
import axios from "axios";
import PortfolioTable from "./PortfolioTable";

const RostershipTool = (props: ToolProps) => {
  const { leagues, userId } = props;

  let rostership = {}

  const fetchRosters = async (league_id) => {
    try {
      console.log(`https://api.sleeper.app/v1/league/${league_id}/rosters`)
      const response = await axios.get(`https://api.sleeper.app/v1/league/${league_id}/rosters`);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const fetchData = async () => {
    rostership = {};
    console.log(leagues)
    // for (const [key, value] of Object.entries(leagues)) {
    //   rostership['total'] = (rostership['total'] || 0) + 1;
    //   rostership[key] = leagues.name;
    //   const rostersData = await fetchRosters(key);
    //   if (rostersData) {
    //     rostersData.players?.forEach(p => {
    //       rostership[p] = (rostership[p] || 0) + 1;
    //     })
    //   }
    // }
  };

  fetchData();

  useEffect(() => {
    fetchData();
  }, [leagues, userId]);


  return (
    <RN.View style={{ flex: 1 }}>
      <RN.View>
        <RN.TouchableOpacity onPress={() => RN.Linking.openURL('https://dynasty-daddy.com/players/rankings')}>
          <Sleeper.Text style={[styles.DDDialog, { color: DynastyDaddyTheme.accent, textDecorationLine: 'underline' }]}>For more, visit Dynasty Daddy</Sleeper.Text>
        </RN.TouchableOpacity>
      </RN.View>
      <RN.View>
        <Sleeper.Text style={styles.text}>Player exposure across your sleeper account</Sleeper.Text>
      </RN.View>
      <PortfolioTable rostershipMap={rostership} />
    </RN.View>
  );
};


export default RostershipTool;
