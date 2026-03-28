import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "./firebase";

export default function ResetTeamsButton() {
  const [open, setOpen] = useState(false);

  const handleReset = async () => {
    // Réinitialiser les équipes des joueurs
    const playersSnapshot = await getDocs(collection(db, "players"));
    const batch = writeBatch(db);
    playersSnapshot.docs.forEach((player) => {
      batch.update(doc(db, "players", player.id), { team: 0 });
    });

    // Déverrouiller toutes les équipes
    const teamsSnapshot = await getDocs(collection(db, "teams"));
    teamsSnapshot.docs.forEach((team) => {
      batch.update(doc(db, "teams", team.id), { isLocked: false });
    });

    await batch.commit();
    setOpen(false);
  };

  return (
    <>
      <Button variant="outlined" color="warning" onClick={() => setOpen(true)}>
        Réinitialiser les équipes
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Réinitialiser les équipes ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tous les joueurs seront remis en attente. Cette action est
            irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleReset} variant="contained" color="warning">
            Réinitialiser
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
