import { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { Player } from "./types";

interface Props {
  player: Player;
}

export default function EditPlayerDialog({ player }: Props) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [name, setName] = useState(player.name);

  const handleOpen = () => {
    setName(player.name);
    setOpen(true);
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    await updateDoc(doc(db, "players", player.id), { name: trimmed });
    setOpen(false);
  };

  const handleDelete = async () => {
    await deleteDoc(doc(db, "players", player.id));
    setConfirmDelete(false);
    setOpen(false);
  };

  return (
    <>
      <IconButton size="small" onClick={handleOpen}>
        <EditIcon fontSize="small" />
      </IconButton>

      {/* Dialog édition */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Modifier le joueur</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Nom du joueur"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            margin="dense"
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={() => setConfirmDelete(true)} color="error">
            Supprimer
          </Button>
          <Box>
            <Button onClick={() => setOpen(false)}>Annuler</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={!name.trim()}
            >
              Enregistrer
            </Button>
          </Box>
        </DialogActions>
      </Dialog>

      {/* Dialog confirmation suppression */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Supprimer le joueur ?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer <strong>{player.name}</strong> ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Annuler</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
