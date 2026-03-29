import {
  Table,
  Checkbox,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Select,
  MenuItem,
} from "@mui/material";
import { red, grey } from "@mui/material/colors";
import EditPlayerDialog from "./EditPlayerDialog";
import type { Player, Teams } from "./types";
import { updatePlayer, resetPlayerPresence, resetPlayerTeam } from "./utils";

interface PlayersTableProps {
  players: Player[];
  teams: Teams[];
}

const PlayersTable = ({ players, teams }: PlayersTableProps) => {
  const colorByStatus = (
    injured: Player["injured"],
    present: Player["present"],
  ) => {
    if (injured) return red[400];
    if (!present) return grey[200];
    return "white";
  };

  const isTeamLocked = (teamNumber: Teams["number"]) =>
    teams.find((team) => team.number === teamNumber)?.isLocked ?? false;

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center">Groupe</TableCell>
            <TableCell align="center">Nom</TableCell>
            <TableCell align="center">Équipe</TableCell>
            <TableCell align="center">Présent</TableCell>
            <TableCell align="center">Blessé</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {players.map((player) => (
            <TableRow
              key={player.id}
              sx={{
                bgcolor: colorByStatus(player.injured, player.present),
              }}
            >
              <TableCell align="center">{player.group}</TableCell>
              <TableCell align="center">{player.name}</TableCell>
              <TableCell align="center">
                <Select
                  value={player.team}
                  disabled={
                    player.injured ||
                    player.present === false ||
                    (player.team !== 0 && isTeamLocked(player.team))
                  }
                  onChange={(e) =>
                    updatePlayer(player.id, "team", e.target.value as number)
                  }
                  size="small"
                  variant="standard"
                >
                  <MenuItem value={0}>En attente</MenuItem>
                  {teams.map((team) => (
                    <MenuItem
                      key={team.id}
                      value={team.number}
                      disabled={team.isLocked}
                    >
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell align="center">
                <Switch
                  checked={player.present}
                  disabled={player.injured}
                  size="small"
                  onChange={() => {
                    updatePlayer(player.id, "present", !player.present);
                    resetPlayerTeam(player);
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={player.injured}
                  size="small"
                  color="default"
                  onChange={() => {
                    updatePlayer(player.id, "injured", !player.injured);
                    resetPlayerTeam(player);
                    resetPlayerPresence(player);
                  }}
                />
              </TableCell>
              <TableCell align="center">
                <EditPlayerDialog player={player} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PlayersTable;
