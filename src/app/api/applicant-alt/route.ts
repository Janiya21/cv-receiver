import dbConnect from "@/lib/dbConnect";
import ApplicantALT from "@/model/ApplicantALT";
import Position from "@/model/Position";
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        Position.find({});
        const applications = await ApplicantALT.find({}).populate("position")
        // .populate('vacancies');
        return NextResponse.json(applications, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching Applicants', error);
        return NextResponse.json({ error: 'Error fetching Applicants' }, { status: 500 });
    }
  }

