import type { APIRoute } from 'astro';
import { db } from '@/db';
import { comments } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const userId = cookies.get('userId')?.value;
  const isAdmin = cookies.get('isAdmin')?.value === 'true';

  if (!userId) return new Response('Unauthorized', { status: 401 });

  const data = await request.formData();
  const commentId = data.get('commentId') as string;
  const postSlug = data.get('postSlug') as string;

  if (!commentId) return new Response('Bad Request', { status: 400 });

  if (isAdmin) {
    await db.delete(comments).where(eq(comments.id, parseInt(commentId)));
  } else {
    await db.delete(comments).where(
      and(
        eq(comments.id, parseInt(commentId)),
        eq(comments.authorId, parseInt(userId))
      )
    );
  }

  return redirect(`/blog/${postSlug}`);
};
