// lib/services/user.service.ts
import { UserRepository } from "../repositories/user.repository";
import { UserRole } from "../../generated/prisma/enums";

export class UserService {
  /**
   * Get user role by Clerk ID
   */
  static async getUserRole(clerkId: string): Promise<UserRole | null> {
    try {
      const user = await UserRepository.findByClerkId(clerkId);
      return user?.role ?? null;
    } catch (error) {
      console.error("Error fetching user role:", error);
      return null;
    }
  }

  /**
   * Check if user is super admin
   */
  static async isSuperAdmin(clerkId: string): Promise<boolean> {
    const role = await this.getUserRole(clerkId);
    return role === UserRole.SUPER_ADMIN;
  }

  /**
   * Check if user is admin (includes SUPER_ADMIN and ADMIN)
   */
  static async isAdmin(clerkId: string): Promise<boolean> {
    const role = await this.getUserRole(clerkId);
    return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN;
  }

  /**
   * Get user with all details by Clerk ID
   */
  static async getUserByClerkId(clerkId: string) {
    try {
      return await UserRepository.findByClerkId(clerkId);
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }
}
