import { donorProfileRepository } from "../repositories/donor-profile.repository";
import { BloodType } from "../../generated/prisma/enums";
import { Decimal } from "../../generated/prisma/internal/prismaNamespace";
import { auth } from "@clerk/nextjs/server";

export class donorProfileServices {

    //create donor profile
    static async createDonorProfile(data: {
        donorProfileId: string;
        userId: string;
        bloodType: BloodType;
        lastDonationDate?: Date;
        donationCount?: number;
        location: string;
        latitude: Decimal;
        longitude: Decimal;
        medicalNotes?: string;
    }) {
        try {
            // Check if user is logged in
            const { userId: clerkUserId } = await auth();
            if (!clerkUserId) {
                throw new Error("Unauthorized: User must be logged in");
            }

            // Verify the logged-in user matches the userId in data
            if (clerkUserId !== data.userId) {
                throw new Error("Unauthorized: Cannot create profile for another user");
            }

            // Validate required fields
            if (!data.userId || !data.bloodType || !data.location) {
                throw new Error("Missing required fields: userId, bloodType, and location are required");
            }

            // Validate blood type is valid enum value
            if (!Object.values(BloodType).includes(data.bloodType)) {
                throw new Error("Invalid blood type");
            }

            // Check if donor profile already exists for this user
            const existingProfile = await donorProfileRepository.getDonorProfile(data.donorProfileId);
            if (existingProfile) {
                throw new Error("Donor profile already exists for this user");
            }

            // Call repository method to create donor profile
            const donorProfile = await donorProfileRepository.createDonorProfile({
                donorProfileId: data.donorProfileId,
                userId: data.userId,
                bloodType: data.bloodType,
                lastDonationDate: data.lastDonationDate || new Date(),
                donationCount: data.donationCount || 0,
                location: data.location,
                latitude: data.latitude,
                longitude: data.longitude,
                medicalNotes: data.medicalNotes,
            });

            return {
                success: true,
                data: donorProfile,
            };
        } catch (error) {
            console.error("Error creating donor profile:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to create donor profile",
            };
        }
    }

    //get donor profile
    static async getDonorProfile(donorProfileId: string) {
        try {
            // Check if user is logged in
            const { userId: clerkUserId } = await auth();
            if (!clerkUserId) {
                throw new Error("Unauthorized: User must be logged in");
            }

            const donorProfile = await donorProfileRepository.getDonorProfile(donorProfileId);
            
            if (!donorProfile) {
                return {
                    success: false,
                    error: "Donor profile not found",
                };
            }

            return {
                success: true,
                data: donorProfile,
            };
        } catch (error) {
            console.error("Error getting donor profile:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to get donor profile",
            };
        }
    }

    //edit donor profile
    static async editDonorProfile(donorProfileId: string, data: {
        location?: string;
        latitude?: Decimal;
        longitude?: Decimal;
        medicalNotes?: string;
        lastDonationDate?: Date;
        donationCount?: number;
    }) {
        try {
            // Check if user is logged in
            const { userId: clerkUserId } = await auth();
            if (!clerkUserId) {
                throw new Error("Unauthorized: User must be logged in");
            }

            // Check if donor profile exists
            const existingProfile = await donorProfileRepository.getDonorProfile(donorProfileId);
            if (!existingProfile) {
                throw new Error("Donor profile not found");
            }

            // Verify the logged-in user owns this profile
            if (existingProfile.userId !== clerkUserId) {
                throw new Error("Unauthorized: Cannot edit another user's profile");
            }

            // Call repository method to edit donor profile
            const updatedProfile = await donorProfileRepository.editDonorProfile(donorProfileId, data);

            return {
                success: true,
                data: updatedProfile,
            };
        } catch (error) {
            console.error("Error editing donor profile:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to edit donor profile",
            };
        }
    }
}