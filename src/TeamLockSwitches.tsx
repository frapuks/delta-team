import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import type { Teams } from "./types";
import { Switch, Box, FormControlLabel } from "@mui/material";
import { updateTeamLock } from "./utils";

const TeamLockSwitches = () => {
  const [teams, setTeams] = useState<Teams[]>([]);

  useEffect(() => {
    const teamsQuery = query(collection(db, "teams"), orderBy("number"));
    return onSnapshot(teamsQuery, (snapshot) => {
      setTeams(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Teams),
      );
    });
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexWrap="wrap"
      px={2}
      pb={1}
      gap={2}
    >
      {teams.map((team) => (
        <FormControlLabel
          key={team.id}
          control={
            <Switch
              checked={team.isLocked}
              onChange={(e) => updateTeamLock(team.id, e.target.checked)}
            />
          }
          label={`${team.name} verrouillée`}
        />
      ))}
    </Box>
  );
};

export default TeamLockSwitches;
