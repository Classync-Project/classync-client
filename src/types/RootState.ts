import { User } from "./User";

export interface RootState {
  user: {
    user: User | null;
    loading: boolean;
    error: string | null;
  };
}
