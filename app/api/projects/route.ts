import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper untuk validasi atau penanganan error standar
const TABLE_NAME = 'projects'; // Sesuaikan dengan nama tabel Supabase kamu

// GET: Mengambil semua data proyek
export async function GET() {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || [], { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Membuat proyek baru atau memperbarui data/media proyek
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Jika menggunakan FormData (untuk upload file / media)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const projectId = formData.get('projectId') as string;
      const field = formData.get('field') as 'thumbnail' | 'previewVideo' | 'gallery';
      const action = (formData.get('action') as string) || 'append';
      const replaceIndexStr = formData.get('replaceIndex') as string;
      const files = formData.getAll('files') as File[];

      if (!projectId) {
        return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
      }

      // Ambil data project saat ini dari database
      const { data: existingProject, error: fetchError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', projectId)
        .single();

      // Jika project belum ada di DB (misal baru dibuat di client state), buat baru dulu atau sesuaikan logic
      let currentData = existingProject;
      if (fetchError || !currentData) {
        // Fallback jika project belum tersimpan di DB, buat objek dasarnya
        currentData = {
          id: projectId,
          title: 'New Project',
          category: 'DESIGN',
          gallery: [],
        };
      }

      // Proses upload file ke Supabase Storage (pastikan bucket 'portfolio' sudah dibuat)
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${projectId}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `${field}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio') // Ganti dengan nama bucket Supabase Storage kamu
          .upload(filePath, file);

        if (uploadError) {
          return NextResponse.json({ error: uploadError.message }, { status: 500 });
        }

        // Ambil Public URL dari file yang di-upload
        const { data: publicUrlData } = supabase.storage
          .from('portfolio')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      // Modifikasi field berdasarkan aksi (append/replace)
      let updatedFieldVal: any = currentData[field];

      if (field === 'thumbnail' || field === 'previewVideo') {
        updatedFieldVal = uploadedUrls[0] || currentData[field];
      } else if (field === 'gallery') {
        let galleryList: string[] = Array.isArray(currentData.gallery) ? [...currentData.gallery] : [];

        if (action === 'replace' && replaceIndexStr !== null && replaceIndexStr !== '') {
          const idx = parseInt(replaceIndexStr, 10);
          if (!isNaN(idx) && uploadedUrls[0]) {
            galleryList[idx] = uploadedUrls[0];
          }
        } else {
          galleryList.push(...uploadedUrls);
        }
        updatedFieldVal = galleryList;
      }

      // Simpan perubahan ke database Supabase
      const { data: savedProject, error: updateError } = await supabase
        .from(TABLE_NAME)
        .upsert({
          ...currentData,
          [field]: updatedFieldVal,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ project: savedProject }, { status: 200 });
    }

    // Jika Request berupa JSON (Update teks biasa / Create project JSON body)
    const body = await request.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    const { data: savedProject, error: upsertError } = await supabase
      .from(TABLE_NAME)
      .upsert({
        id,
        ...rest,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (upsertError) {
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    // Ambil seluruh data terbaru setelah di-update untuk dikembalikan ke frontend
    const { data: allProjects } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    return NextResponse.json({ projects: allProjects || [savedProject], project: savedProject }, { status: 200 });

 } catch (err: any) {
    console.error("API Error Detail:", err);
    return NextResponse.json({ 
      error: err.message || 'Internal Server Error',
      stack: err.stack 
    }, { status: 500 });
  }
}

// DELETE: Menghapus proyek atau item galeri tertentu
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const field = searchParams.get('field');
    const indexStr = searchParams.get('index');

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Jika ingin menghapus salah satu item di galeri
    if (field === 'gallery' && indexStr !== null) {
      const index = parseInt(indexStr, 10);
      
      const { data: currentProject, error: fetchErr } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('id', projectId)
        .single();

      if (fetchErr || !currentProject) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      const galleryList: string[] = Array.isArray(currentProject.gallery) ? [...currentProject.gallery] : [];
      galleryList.splice(index, 1);

      const { data: updatedProject, error: updateErr } = await supabase
        .from(TABLE_NAME)
        .update({ gallery: galleryList, updated_at: new Date().toISOString() })
        .eq('id', projectId)
        .select()
        .single();

      if (updateErr) {
        return NextResponse.json({ error: updateErr.message }, { status: 500 });
      }

      return NextResponse.json({ project: updatedProject }, { status: 200 });
    }

    // Jika menghapus seluruh proyek
    const { error: deleteError } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', projectId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Ambil sisa data proyek setelah dihapus
    const { data: remainingProjects } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    return NextResponse.json(remainingProjects || [], { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}