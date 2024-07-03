import dbConnect from "@/lib/dbConnect";
import Position from "@/model/Position";
import Vacancy from "@/model/Vacancy";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  await dbConnect();
  try {
    const vacancies = await Vacancy.find({})
    .populate('position');
      return NextResponse.json(vacancies, { status: 200 });
  } catch (error: any) {
      console.error('Error fetching vacancies', error);
      return NextResponse.json({ error: 'Error fetching Vacancies' }, { status: 500 });
  }
}
export async function POST(req: NextRequest) {
    try {
      await dbConnect();
      const {
        location,
        description,
        title,
        position,
        status,
        createDate,
        endDate
      } = await req.json();
  
      if (!location || !description || !title || !position || !status || !createDate || !endDate) {
        return NextResponse.json({ error: 'Fill all the Reqired Fields' }, { status: 400 });
      }
  
      const newVacancy = new Vacancy({
        location,
        description,
        title,
        position,
        status,
        createDate,
        endDate
      });
  
      await newVacancy.save();
      return NextResponse.json(newVacancy, { status: 201 });
    } catch (error) {
      console.error('Error creating Vacancy:', error);
      return NextResponse.json({ error: 'Error creating Vacancy' }, { status: 500 });
    }
  }