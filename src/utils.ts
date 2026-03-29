import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Player } from "./types";

export const updatePlayer = async (
  playerId: Player["id"],
  field: "injured" | "present" | "team",
  value: boolean | number,
) => {
  const playerRef = doc(db, "players", playerId);
  await updateDoc(playerRef, { [field]: value });
};

export const resetPlayerTeam = async (player: Player) => {
  if (player.team !== 0) await updatePlayer(player.id, "team", 0);
};

export const resetPlayerPresence = async (player: Player) => {
  if (player.present) await updatePlayer(player.id, "present", false);
};

export const updateTeamLock = async (teamId: string, isLocked: boolean) => {
  const teamRef = doc(db, "teams", teamId);
  await updateDoc(teamRef, { isLocked });
};
