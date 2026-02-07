// src/app/api/revalidate/route.ts
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';


export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const tag = searchParams.get('tag');
  const category = searchParams.get('category');

  if (!tag && !category) {
    return NextResponse.json(
      { message: 'Missing tag or category parameter' },
      { status: 400 }
    );
  }

  if (tag) {
    revalidateTag(`/tags/${tag}`, { expire: 0 });  
  }

  if (category) {
    revalidateTag(`/categories/${category}`, { expire: 0 }); 
  }

  return NextResponse.json({
    revalidated: true,
    now: Date.now(),
  });
}