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
    const snapshot = await getDocs(collection(db, "players"));
    const batch = writeBatch(db);
    snapshot.docs.forEach((player) => {
      batch.update(doc(db, "players", player.id), { team: 0 });
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
