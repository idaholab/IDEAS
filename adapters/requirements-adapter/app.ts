import authenticate from './scripts/authenticate';
import getRequirements from './scripts/requirements';
import entityFactory from './scripts/factory';

async function loader() {
  let token: string = await authenticate();
  let requirements = await getRequirements(token);

  for (let requirement of requirements) {
    await entityFactory(requirement.properties);
  }
}

loader();