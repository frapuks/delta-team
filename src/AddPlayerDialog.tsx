import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export default function AddPlayerDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    await addDoc(collection(db, "players"), {
      name: trimmed,
      injured: false,
      present: false,
      team: 0,
    });

    setName("");
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        + Ajouter un joueur
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Ajouter un joueur</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Nom du joueur"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            disabled={!name.trim()}
          >
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
