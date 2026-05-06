import type { APIRoute } from 'astro';
import { db } from '@/db';
import { posts } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const userId = cookies.get('userId')?.value;
  const isAdmin = cookies.get('isAdmin')?.value === 'true';

  if (!userId) return new Response('Unauthorized', { status: 401 });

  const data = await request.formData();
  const postId = data.get('postId') as string;

  if (!postId) return new Response('Bad Request', { status: 400 });

  if (isAdmin) {
    // Admin can delete any post
    await db.delete(posts).where(eq(posts.id, parseInt(postId)));
  } else {
    // Regular users can only delete their own posts
    await db.delete(posts).where(
      and(
        eq(posts.id, parseInt(postId)),
        eq(posts.authorId, parseInt(userId))
      )
    );
  }

  return redirect('/');
};
