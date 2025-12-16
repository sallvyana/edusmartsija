import { supabase } from '@/lib/supabaseClient'
import { NextResponse } from 'next/server'

export async function POST(request) {
  console.log('🔵 API Route: Menerima request POST')
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json()
      console.log('📥 Body request:', body)
    } catch (parseError) {
      console.error('❌ Error parsing request body:', parseError)
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      )
    }

    const { name, score, totalSoal, waktu, category } = body
    
    console.log('📝 Data extracted:', { name, score, totalSoal, waktu, category })
    
    // Validasi input
    if (!name || !name.trim()) {
      console.error('❌ Validasi gagal: name kosong')
      return NextResponse.json(
        { error: "Nama tidak boleh kosong" },
        { status: 400 }
      )
    }
    
    if (score === undefined || score === null) {
      console.error('❌ Validasi gagal: score kosong')
      return NextResponse.json(
        { error: "Score tidak boleh kosong" },
        { status: 400 }
      )
    }
    
    if (!category || !category.trim()) {
      console.error('❌ Validasi gagal: category kosong')
      return NextResponse.json(
        { error: "Kategori tidak boleh kosong" },
        { status: 400 }
      )
    }
    
    if (!totalSoal) {
      console.error('❌ Validasi gagal: totalSoal kosong')
      return NextResponse.json(
        { error: "Total soal tidak boleh kosong" },
        { status: 400 }
      )
    }
    
    if (waktu === undefined || waktu === null) {
      console.error('❌ Validasi gagal: waktu kosong')
      return NextResponse.json(
        { error: "Waktu tidak boleh kosong" },
        { status: 400 }
      )
    }

    console.log('✅ Validasi berhasil')
    
    // Prepare data untuk insert
    const dataToInsert = {
      name: name.trim(),
      score: parseInt(score),
      total_soal: parseInt(totalSoal),
      waktu: parseInt(waktu),
      category: category.trim()
    }
    
    console.log('📤 Data yang akan di-insert:', dataToInsert)
    console.log('🔵 Menyimpan ke Supabase...')
    
    // Insert ke database
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([dataToInsert])
      .select()
    
    if (error) {
      console.error('❌ Supabase error:', error)
      console.error('❌ Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      )
    }
    
    console.log('✅ Data berhasil disimpan:', data)
    
    return NextResponse.json(
      { 
        success: true, 
        data: data 
      },
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
    
  } catch (error) {
    console.error('❌ API Error (catch):', error)
    console.error('❌ Error name:', error.name)
    console.error('❌ Error message:', error.message)
    console.error('❌ Error stack:', error.stack)
    
    return NextResponse.json(
      { error: `Server error: ${error.message}` }, 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}