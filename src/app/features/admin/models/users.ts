export interface CreateUserRequest {
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileCode: string[];
  sendEmail: boolean;
}

export interface UserResponse {
  id: number;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  profileCode: string[];
}
