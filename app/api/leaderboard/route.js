import { NextResponse } from "next/server";
import { supabase } from '@/lib/supabaseClient'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const kategori = searchParams.get('kategori')
    
    console.log('Request kategori:', kategori)
    
    let query = supabase
      .from("leaderboard")
      .select("id, name, score, total_soal, waktu, category, created_at") // sesuai struktur DB
      .order("score", { ascending: false })      // score tertinggi dulu
      .order("created_at", { ascending: true })  // jika score sama, yang lebih dulu
      .limit(10)
    
    // Filter berdasarkan kategori jika ada
    if (kategori && kategori !== 'all') {
      query = query.eq('category', kategori)
    }
    
    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('Leaderboard data:', data)
    return NextResponse.json({ data }); // wrap dalam object agar konsisten
    
  } catch (err) {
    console.error('API Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}