import { NextResponse } from 'next/server';
import { fetchProjects } from '@/services/projectService';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || '';
  const priority = url.searchParams.get('priority') || '';
  const page = parseInt(url.searchParams.get('page') || '1', 10);

  const { data, total, totalPages } = await fetchProjects({ page, search, status, priority });

  return NextResponse.json({ data, total, page, totalPages });
}
