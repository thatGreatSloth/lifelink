import { NextRequest, NextResponse } from "next/server";
import { donorProfileServices } from "../../../../lib/services/donor-profile.services";
import { BloodType } from "../../../../generated/prisma/enums";
import { Decimal } from "../../../../generated/prisma/internal/prismaNamespace";

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const body = await req.json();

        // Validate required fields
        const { 
            donorProfileId, 
            userId, 
            bloodType, 
            location, 
            latitude, 
            longitude,
            lastDonationDate,
            donationCount,
            medicalNotes 
        } = body;

        if (!donorProfileId || !userId || !bloodType || !location || latitude === undefined || longitude === undefined) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: "Missing required fields: donorProfileId, userId, bloodType, location, latitude, longitude" 
                },
                { status: 400 }
            );
        }

        // Validate blood type
        if (!Object.values(BloodType).includes(bloodType)) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: `Invalid blood type. Must be one of: ${Object.values(BloodType).join(", ")}` 
                },
                { status: 400 }
            );
        }

        // Convert latitude and longitude to Decimal
        const latDecimal = new Decimal(latitude);
        const longDecimal = new Decimal(longitude);

        // Call service to create donor profile
        const result = await donorProfileServices.createDonorProfile({
            donorProfileId,
            userId,
            bloodType,
            location,
            latitude: latDecimal,
            longitude: longDecimal,
            lastDonationDate: lastDonationDate ? new Date(lastDonationDate) : undefined,
            donationCount: donationCount || 0,
            medicalNotes,
        });

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { 
                success: true, 
                data: result.data,
                message: "Donor profile created successfully" 
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error in POST /api/create-donor-profile:", error);
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : "Internal server error" 
            },
            { status: 500 }
        );
    }
}