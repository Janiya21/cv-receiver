import dbConnect from "@/lib/dbConnect";
import Applicant from "@/model/Applicant";
import Vacancy from "@/model/Vacancy";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    await Vacancy.find({});
    const applications = await Applicant.find({}).populate("vacancies")
    // .populate('vacancies');
      return NextResponse.json(applications, { status: 200 });
  } catch (error: any) {
      console.error('Error fetching applications', error);
      return NextResponse.json({ error: 'Error fetching applications' }, { status: 500 });
  }
}