import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  // Read the districts JSON file
  const filePath = path.join(process.cwd(), "public/data/districts.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");

  // Parse the JSON data
  const districts = JSON.parse(jsonData);

  // Return the districts data as a response
  return NextResponse.json(districts);
}
