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
import { WarningAmber } from "@mui/icons-material";

const ResetTeamsButton = () => {
  const [open, setOpen] = useState(false);

  const handleReset = async () => {
    // Réinitialiser les équipes des joueurs
    const playersSnapshot = await getDocs(collection(db, "players"));
    const batch = writeBatch(db);
    playersSnapshot.docs.forEach((player) => {
      batch.update(doc(db, "players", player.id), { team: 0, present: false });
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
      <Button
        variant="outlined"
        color="warning"
        onClick={() => setOpen(true)}
        startIcon={<WarningAmber />}
      >
        Réinitialiser les équipes
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Réinitialiser les équipes ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tous les joueurs seront remis absents et en attente, et les équipes
            seront déverrouillées. Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button
            onClick={handleReset}
            variant="contained"
            color="warning"
            startIcon={<WarningAmber />}
          >
            Réinitialiser
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ResetTeamsButton;
