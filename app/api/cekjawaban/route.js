import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
export async function POST(req) {
  try {
    const { username, category, number, jawaban } = await req.json();

    if (!username || !category || !number || !jawaban) {
      return NextResponse.json(
        { error: "Parameter kurang lengkap" },
        { status: 400 }
      );
    }

    // ambil soal dari quizData
    const soalArr = quizData[category];
    if (!soalArr) {
      return NextResponse.json(
        { error: "Kategori tidak ditemukan" },
        { status: 404 }
      );
    }

    const idx = parseInt(number, 10) - 1;
    if (isNaN(idx) || idx < 0 || idx >= soalArr.length) {
      return NextResponse.json(
        { error: "Nomor soal tidak valid" },
        { status: 400 }
      );
    }

    const kunci = soalArr[idx];
    const isCorrect = jawaban.toUpperCase() === kunci.answer;
    const skor = isCorrect ? 10 : 0;

    // simpan ke Supabase
    const { error } = await supabase.from("leaderboard").insert([
      {
        username,
        skor,
      },
    ]);

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      isCorrect,
      skor,
      explanation: kunci.explanation,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}