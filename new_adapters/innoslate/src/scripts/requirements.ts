import axios from 'axios';
// @ts-ignore
import {filter} from 'lodash';

async function getRequirements(token: string) {
  let requirements = await axios
    .get(
      `${process.env.DEEP_LYNX_HOST}/containers/${process.env.DEEP_LYNX_CONTAINER}/graphs/nodes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response: any) => {
      return filter(response.data.value, { metatype_name: "Requirement" });
    })
    .catch((error: Error) => {
      console.log(error);
    });

  return requirements;
}

export default getRequirements;
