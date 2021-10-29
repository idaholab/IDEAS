import Config from '../api/config'
import { Client } from '../api/client'
import store from '../store'

export default {

  async retrieveNodeProperties(name) {
    // retrieve event nodes created by this app
    const client = new Client()
    const nodes = await client.queryGraph(Config.containerID,
      `{
        nodes(where: {AND: [ {metatype_name: "eq ${name}"},
          {archived: "eq false"},
          {properties: [
            {key: "data_source_id" value: "${Config.dataSourceID}" operator: "like"}
          ]}
        ]})
        {
          id,
          raw_properties
        }
      }`
    )

    // TODO: insert into store variable

  }

}
