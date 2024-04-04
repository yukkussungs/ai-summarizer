import { NextResponse } from "next/server";
import summarize from "./summarize/summarize";
export const dynamic = "force-dynamic";


export async function GET(req, res) {
    try {
      const url = req.nextUrl.searchParams.get('url');
      if (!url) {
        return res.status(400).json({ message: 'url parameter is required' });
      }
      const data = await summarize(url);
      return NextResponse.json({ message: "Success", data }, { status: 200 });
    } catch (err) {
		return NextResponse.json({ message: "Error", err }, { status: 500 });
	}
}