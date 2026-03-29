import { useState } from "react";
import { Tooltip, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import type { Player } from "./types";

interface CopyPlayersButtonProps {
  players: Player[];
}

const CopyPlayersButton = ({ players }: CopyPlayersButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const names = players.map((p, i) => `${i + 1}. ${p.name}`).join("\n");
    navigator.clipboard.writeText(names).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Tooltip title={copied ? "Copié !" : "Copier les noms"}>
      <Button
        size="small"
        onClick={handleCopy}
        startIcon={<ContentCopyIcon fontSize="small" />}
        color={copied ? "success" : "primary"}
        variant="outlined"
      >
        Copier
      </Button>
    </Tooltip>
  );
};

export default CopyPlayersButton;
