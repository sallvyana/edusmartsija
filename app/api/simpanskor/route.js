import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { nama, skor, totalSoal, waktu, kategori } = body
    
    console.log('Data yang akan disimpan:', { nama, skor, totalSoal, waktu, kategori })
    
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([{
        name: nama,                    // sesuai kolom 'name'
        score: parseInt(skor),         // sesuai kolom 'score'
        total_soal: parseInt(totalSoal), // sesuai kolom 'total_soal'
        waktu: waktu,                  // sesuai kolom 'waktu'
        category: kategori             // sesuai kolom 'category'
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