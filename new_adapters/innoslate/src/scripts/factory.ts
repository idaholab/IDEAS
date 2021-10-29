import {Entity} from "../classes/Entity";
import type {Requirement} from '../types/Requirement';

export default async function entityFactory(requirement: Requirement) {
  let entity = new Entity(requirement, 5, 22, 49);
  await entity.allocateId();
  await entity.post();
}
