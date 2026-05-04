import { UserResponse } from "../../admin/models/users";

export interface ChefProjetOption {
  id: number;
  fullName: string;
}

export function mapToChefProjetOption(user: UserResponse): ChefProjetOption {
  return {
    id: user.id,
    fullName: `${user.firstName} ${user.lastName}`,
  };
}
