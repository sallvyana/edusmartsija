import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, score, totalSoal, waktu, category} = body
    
     if (!name || !score || !category || !totalSoal || !waktu) {
      return NextResponse.json(
        { error: "Payload tidak lengkap" },
        { status: 400 }
      )
    }

    console.log('Data yang akan disimpan:', { name, score, totalSoal, waktu, category })
    
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([{
        name: name,                    // sesuai kolom 'name'
        score: parseInt(score),         // sesuai kolom 'score'
        total_soal: parseInt(totalSoal), // sesuai kolom 'total_soal'
        waktu: waktu,                  // sesuai kolom 'waktu'
        category: category            // sesuai kolom 'category'
        // user_id dan created_at akan diisi otomatis jika ada default value
      }])
      .select()
    
    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('Data berhasil disimpan:', data)
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}