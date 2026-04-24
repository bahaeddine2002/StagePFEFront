export interface CreateRoleRequest {
  code: string;
  libelle: string;
  description: string;
  permissionCodes: string[];
}

export interface RoleResponse {
  id: number;
  code: string;
  libelle: string;
  description: string;
  permissions: string[];
}
