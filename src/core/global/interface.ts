export type UserRole = "systemUser" | "systemAdmin";

export type ITokenSignedPayload = {
  id: string;
  email: string;
  type: UserRole;
};
