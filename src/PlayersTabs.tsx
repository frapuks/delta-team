import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import type { Player, Teams } from "./types";
import { Typography, Tabs, Tab, Box } from "@mui/material";
import CopyPlayersButton from "./CopyPlayersButton";
import PlayersTable from "./PlayersTable";

const PlayersTabs = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Teams[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  // 🔥 Firestore en temps réel trié par nom
  useEffect(() => {
    const playersQuery = query(
      collection(db, "players"),
      orderBy("group"),
      orderBy("name"),
    );
    const unsubscribePlayers = onSnapshot(playersQuery, (snapshot) => {
      const data: Player[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Player,
      );
      setPlayers(data);
    });
    const teamsQuery = query(collection(db, "teams"), orderBy("number"));
    const unsubscribeTeams = onSnapshot(teamsQuery, (snapshot) => {
      const data: Teams[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Teams,
      );
      setTeams(data);
    });
    return () => {
      unsubscribePlayers();
      unsubscribeTeams();
    };
  }, []);

  const tabs = [
    {
      index: 0,
      label: "Tous",
      filter: () => players,
      description:
        "Tous les joueurs sans filtre, ordonnés par groupe puis par ordre alphabétique",
    },
    {
      index: 1,
      label: "Dispo",
      filter: () => players.filter((p) => !p.injured && p.present),
      description: "Joueurs disponibles : non blessés et présents.",
    },
    {
      index: 2,
      label: "À répartir",
      filter: () =>
        players.filter((p) => !p.injured && p.present && p.team === 0),
      description:
        "Joueurs disponibles (non blessés, présents) mais sans équipe assignée.",
    },
    {
      index: 3,
      label: "Équipe 1",
      filter: () => players.filter((p) => p.team === 1),
      description: "Joueurs assignés à l'Équipe 1.",
    },
    {
      index: 4,
      label: "Équipe 2",
      filter: () => players.filter((p) => p.team === 2),
      description: "Joueurs assignés à l'Équipe 2.",
    },
    {
      index: 5,
      label: "Équipe 3",
      filter: () => players.filter((p) => p.team === 3),
      description: "Joueurs assignés à l'Équipe 3.",
    },
    {
      index: 6,
      label: "Équipe 4",
      filter: () => players.filter((p) => p.team === 4),
      description: "Joueurs assignés à l'Équipe 4.",
    },
  ];

  return (
    <>
      <Tabs
        value={tabIndex}
        onChange={(_, newValue) => setTabIndex(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((tab, i) => (
          <Tab key={i} label={`${tab.label} (${tab.filter().length})`} />
        ))}
      </Tabs>

      {tabs.map((tab, i) => {
        const tabPlayers = tab.filter();
        return (
          <div key={i} hidden={tabIndex !== i}>
            {tabIndex === i && (
              <>
                <Box display="flex" alignItems="center" sx={{ p: 2 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic", flex: 1 }}
                  >
                    {tab.description}
                  </Typography>
                  <CopyPlayersButton players={tabPlayers} />
                </Box>
                <PlayersTable players={tabPlayers} teams={teams} />
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export default PlayersTabs;
