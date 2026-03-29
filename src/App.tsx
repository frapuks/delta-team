import { Box, Paper, Typography } from "@mui/material";
import AddPlayerDialog from "./AddPlayerDialog";
import ResetTeamsButton from "./ResetTeamsButton";
import PlayersTabs from "./PlayersTabs";
import TeamLockSwitches from "./TeamLockSwitches";

const App = () => {
  return (
    <Paper style={{ maxWidth: 900, margin: "20px auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Liste des joueurs
      </Typography>

      <Box display="flex" justifyContent="center" padding={2} gap={1}>
        <ResetTeamsButton />
        <AddPlayerDialog />
      </Box>

      <TeamLockSwitches />
      <PlayersTabs />
    </Paper>
  );
};

export default App;
