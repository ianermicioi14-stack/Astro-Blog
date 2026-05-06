import type { APIRoute } from 'astro';
import { db } from '@/db';
import { comments } from '@/db/schema';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const userId = cookies.get('userId')?.value;
  const username = cookies.get('username')?.value;

  if (!userId || !username) {
    return new Response('Unauthorized', { status: 401 });
  }

  const data = await request.formData();
  const postId = data.get('postId') as string;
  const postSlug = data.get('postSlug') as string;
  const content = (data.get('content') as string)?.trim();

  if (!postId || !content || !postSlug) {
    return new Response('Bad Request', { status: 400 });
  }

  const numericAuthorId = parseInt(userId);

  await db.insert(comments).values({
    postId: parseInt(postId),
    authorId: numericAuthorId > 0 ? numericAuthorId : null,
    username,
    content,
    createdAt: new Date(),
  });

  return redirect(`/blog/${postSlug}#comments`);
};
