import { RESTDataSource } from "@apollo/datasource-rest";
import { nbaStatsApi } from "../../models/helpers";

export class NbaAPI extends RESTDataSource {
  async getPlayers() {
    try {
      const data = (await nbaStatsApi("commonAllPlayers")).data;
      return {
        resource: data.resource,
        parameters: data.parameters,
        resultSets: data.resultSets,
      };
    } catch (error) {
      console.log("error", error);
    }
  }

  async getFranchiseHistory() {
    try {
      const data = (await nbaStatsApi("franchisehistory")).data;
      return {
        resource: data.resource,
        parameters: data.parameters,
        resultSets: data.resultSets,
      };
    } catch (error) {
      console.log("error", error);
    }
  }
}
