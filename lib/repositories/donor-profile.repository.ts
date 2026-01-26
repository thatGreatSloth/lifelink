
import { Decimal } from "../../generated/prisma/internal/prismaNamespace";
import { BloodType } from "../../generated/prisma/enums";

import { BaseRepository } from "./base.repository";

export class donorProfileRepository extends BaseRepository {

    //create donor profile
    static async createDonorProfile(data: {
        donorProfileId: string;
        userId: string;
        bloodType: BloodType;
        lastDonationDate: Date;
        donationCount: number;
        location: string;
        latitude: Decimal;
        longitude: Decimal;
        medicalNotes?: string;
        createdAt?: Date;
        updatedAt?: Date;
    }) {

        return this.db.donorProfile.create({
            data: {
                id: data.donorProfileId,
                userId: data.userId,
                bloodType: data.bloodType,
                lastDonationDate: data.lastDonationDate,
                donationCount: data.donationCount,
                location: data.location,
                latitude: data.latitude,
                longitude: data.longitude,
              //  medicalNotes: data.medicalNotes || "",
                createdAt: data.createdAt || new Date(),
                updatedAt: data.updatedAt || new Date(),
            },
        })

    }

    //edit donor profile
    static async editDonorProfile(donorProfileId: string, data: {}){
         //edit the location, medical notes
    }
   

    //get donor profile
    static async getDonorProfile(donorProfileId: string) {
        return this.db.donorProfile.findUnique({
            where: {
                id: donorProfileId,
            },
        })
    }

    //delete donor profile
    static async deleteDonorProfile(donorProfileId: string) {
        return this.db.donorProfile.delete({
            where: {
                id: donorProfileId,
            },
        })
    }


    //list donor profiles
    static async listDonorProfiles() {
        //do pagination later 😭
        return this.db.donorProfile.findMany()
    }


    // list active donor
    static async listActiveDonors(){
        //need to find some metric to define active donor
    }

    // search donor by blood type and location
    static async searchDonors(bloodType: BloodType, location: string){
        return this.db.donorProfile.findMany({
            where: {
                bloodType: bloodType,
                location: {
                    contains: location,
                },
            },
        })
    }

    // update last donation date
    static async updateLastDonationDate(donorProfileId: string, date: Date){
        return this.db.donorProfile.update({
            where: {
                id: donorProfileId,
            },
            data: {
                lastDonationDate: date,
            },
        })
    }

    // increment donation count
    static async incrementDonationCount(donorProfileId: string){
        return this.db.donorProfile.update({
            where: {
                id: donorProfileId,
            },
            data: {
                donationCount: {
                    increment: 1,
                },
            },
        })
    }
}

