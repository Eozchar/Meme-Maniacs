import { createDefaultFighterState } from "./fighterState.js";
import { FighterId } from "../constants/fighter.js";

export const gameState = {
    fighters: [
        createDefaultFighterState(FighterId.FROG),
        createDefaultFighterState(FighterId.KNUCKS),
    ],
};