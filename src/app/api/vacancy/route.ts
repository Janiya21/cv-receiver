import dbConnect from "@/lib/dbConnect";
import Vacancy from "@/model/Vacancy";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();

    try {
        const vacancies = await Vacancy.find({});
        console.log(vacancies);
        return NextResponse.json(vacancies);
    } catch (e: any) {
        return NextResponse.json({ error: e.message });
    }
}