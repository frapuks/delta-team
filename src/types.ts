export interface Player {
  id: string;
  name: string;
  team: number;     // 0 (en attente),1,2,3 ou 4
  group: number;    // 1,2,3 ou 4
  injured: boolean;
  present: boolean;
}

export interface Teams {
  id: string;
  name: string;
  number: number;     // 1,2,3 ou 4
  isLocked: boolean;
}
