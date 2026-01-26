// lib/repositories/user.repository.ts
import { UserRole, UserStatus } from "../../generated/prisma/client";
import { BaseRepository } from "./base.repository";

// Payload structure for creating/updating user from Clerk webhook. If a attribute is not provided then it cannot be accessed.
export interface CreateUserFromClerkPayload {
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  role?: UserRole;
}

export class UserRepository extends BaseRepository {
  /**
   * Create a new user from Clerk webhook payload
   */
  static async createFromClerk(payload: CreateUserFromClerkPayload) {
    return this.db.user.create({
      data: {
        id: payload.clerkId,
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNumber: payload.phoneNumber ,
        passwordHash: "", // Clerk handles auth, no password needed

        isEmailVerified: payload.emailVerified ?? false,
        isPhoneVerified: payload.phoneVerified ?? false,

        lastLoginAt: new Date(),
        updatedAt: new Date(),
        role: UserRole.UNASSIGNED,
      },
    });
  }

  /**
   * Find user by Clerk ID
   */
  static async findByClerkId(clerkId: string) {
    return this.db.user.findUnique({
      where: { id: clerkId },
    });
  }

  /**
   * Update user from Clerk webhook payload
   */
  static async updateFromClerk(
    clerkId: string,
    payload: Partial<CreateUserFromClerkPayload> & { role?: UserRole }
  ) {
    return this.db.user.update({
      where: { id: clerkId },
      data: {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phoneNumber: payload.phoneNumber,
        isEmailVerified: payload.emailVerified,
        isPhoneVerified: payload.phoneVerified,
        role:  UserRole.UNASSIGNED,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Soft delete user
   */
  static async deleteByClerkId(clerkId: string) {
    return this.db.user.update({
      where: { id: clerkId },
      data: {
        deletedAt: new Date(),
        status: UserStatus.PENDING, // or create a DELETED status
      },
    });
  }

  /**
   * Update last login timestamp
   */
  static async updateLastLogin(clerkId: string) {
    return this.db.user.update({
      where: { id: clerkId },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }
}