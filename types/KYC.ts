import { UserType } from "./User";

export enum VerificationStatus {
  "verified",
  "pending",
  "reject",
}

export enum VerificationType {
  PASSPORT = "passport",
  ID_CARD = "id",
}

export type KYCStatus = "verified" | "pending" | "rejected";

interface BaseKYC {
  _id: string;
  user: UserType;
  verificationType: VerificationType;
  status: KYCStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDCardKYC extends BaseKYC {
  verificationType: VerificationType.ID_CARD;
  frontImage: string;
  backImage: string;
}

export interface PassportKYC extends BaseKYC {
  verificationType: VerificationType.PASSPORT;
  passportImage: string;
  passportNumber?: string;
  nationality?: string;
  expiryDate?: Date;
  issueDate?: Date;
}

export type KYC = IDCardKYC | PassportKYC;

export type KYCWithType<T extends VerificationType> = Extract<
  KYC,
  { verificationType: T }
>;
