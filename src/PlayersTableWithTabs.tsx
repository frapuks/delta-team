import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Player } from "./types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Select,
  MenuItem,
  Typography,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import AddPlayerDialog from "./AddPlayerDialog";
import EditPlayerDialog from "./EditPlayerDialog";
import ResetTeamsButton from "./ResetTeamsButton";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

export default function PlayersTableWithTabs() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  // 🔥 Firestore en temps réel trié par nom
  useEffect(() => {
    const q = query(collection(db, "players"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Player[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Player,
      );
      setPlayers(data);
    });
    return () => unsubscribe();
  }, []);

  const updatePlayer = async (
    player: Player,
    field: "injured" | "present" | "team",
    value: boolean | number,
  ) => {
    const playerRef = doc(db, "players", player.id);
    await updateDoc(playerRef, { [field]: value });
  };

  // 🔹 Filtrage selon tab
  const filterPlayers = (index: number): Player[] => {
    switch (index) {
      case 0:
        return players; // Tous
      case 1:
        return players.filter((p) => !p.injured && p.present); // Dispo
      case 2:
        return players.filter((p) => !p.injured && p.present && p.team === 0); // À répartir
      case 3:
        return players.filter((p) => p.team === 1);
      case 4:
        return players.filter((p) => p.team === 2);
      case 5:
        return players.filter((p) => p.team === 3);
      case 6:
        return players.filter((p) => p.team === 4);
      default:
        return players;
    }
  };

  // 🔹 Labels de tabs
  const tabLabels = [
    "Tous",
    "Dispo",
    "À répartir",
    "Équipe 1",
    "Équipe 2",
    "Équipe 3",
    "Équipe 4",
  ];
  const tabCounts = tabLabels.map((_, i) => filterPlayers(i).length);
  const tabDescriptions = [
    "Tous les joueurs sans filtre.",
    "Joueurs disponibles : non blessés et présents.",
    "Joueurs disponibles (non blessés, présents) mais sans équipe assignée.",
    "Joueurs assignés à l'Équipe 1.",
    "Joueurs assignés à l'Équipe 2.",
    "Joueurs assignés à l'Équipe 3.",
    "Joueurs assignés à l'Équipe 4.",
  ];

  return (
    <Paper style={{ maxWidth: 900, margin: "20px auto" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Liste des joueurs
      </Typography>

      <Box display="flex" justifyContent="flex-end" padding={2} gap={1}>
        <ResetTeamsButton />
        <AddPlayerDialog />
      </Box>

      <Tabs
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabLabels.map((label, i) => (
          <Tab key={i} label={`${label} (${tabCounts[i]})`} />
        ))}
      </Tabs>

      {tabLabels.map((_, i) => (
        <TabPanel key={i} value={tabIndex} index={i}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ px: 2, pt: 2, pb: 1, fontStyle: "italic" }}
          >
            {tabDescriptions[i]}
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell align="center">Blessé</TableCell>
                  <TableCell align="center">Présent</TableCell>
                  <TableCell align="center">Équipe</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filterPlayers(i).map((player) => (
                  <TableRow key={player.id}>
                    <TableCell>{player.name}</TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={player.injured}
                        onChange={() =>
                          updatePlayer(player, "injured", !player.injured)
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={player.present}
                        onChange={() =>
                          updatePlayer(player, "present", !player.present)
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Select
                        value={player.team}
                        onChange={(e) =>
                          updatePlayer(player, "team", e.target.value as number)
                        }
                      >
                        <MenuItem value={0}>En attente</MenuItem>
                        <MenuItem value={1}>Équipe 1</MenuItem>
                        <MenuItem value={2}>Équipe 2</MenuItem>
                        <MenuItem value={3}>Équipe 3</MenuItem>
                        <MenuItem value={4}>Équipe 4</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="center">
                      <EditPlayerDialog player={player} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      ))}
    </Paper>
  );
}
