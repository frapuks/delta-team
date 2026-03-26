export interface Player {
  id: string;
  name: string;
  team: number; // 1,2,3 ou 4
  injured: boolean;
  present: boolean;
}
