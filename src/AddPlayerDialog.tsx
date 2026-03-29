import { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Add } from "@mui/icons-material";

const AddPlayerDialog = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [group, setGroup] = useState(1);

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    await addDoc(collection(db, "players"), {
      name: trimmed,
      injured: false,
      present: false,
      team: 0,
      group: group,
    });

    setName("");
    setGroup(1);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        startIcon={<Add />}
      >
        Ajouter un joueur
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
          <FormControl fullWidth margin="dense">
            <InputLabel id="group-label">Groupe</InputLabel>
            <Select
              labelId="group-label"
              value={group}
              label="Groupe"
              onChange={(e) => setGroup(e.target.value as number)}
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
            </Select>
          </FormControl>
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

export default AddPlayerDialog;