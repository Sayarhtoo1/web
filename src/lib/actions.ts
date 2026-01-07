'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ==================== POSTS ====================

export async function deletePost(postId: string) {
    const supabase = await createClient();

    // Delete the post (attachments will cascade delete due to FK)
    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    return { success: true };
}

export async function publishPost(postId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('posts')
        .update({
            status: 'published',
            published_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', postId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    revalidatePath('/');
    return { success: true };
}

export async function unpublishPost(postId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('posts')
        .update({
            status: 'draft',
            updated_at: new Date().toISOString(),
        })
        .eq('id', postId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    revalidatePath('/');
    return { success: true };
}

// ==================== CATEGORIES ====================

export async function createCategory(data: {
    name_mm: string;
    name_en?: string;
    slug: string;
    description?: string;
}) {
    const supabase = await createClient();

    const { data: category, error } = await supabase
        .from('categories')
        .insert({
            name_mm: data.name_mm,
            name_en: data.name_en || null,
            slug: data.slug,
            description: data.description || null,
        })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    return { success: true, data: category };
}

export async function updateCategory(
    categoryId: string,
    data: {
        name_mm?: string;
        name_en?: string;
        slug?: string;
        description?: string;
    }
) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('categories')
        .update(data)
        .eq('id', categoryId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    return { success: true };
}

export async function deleteCategory(categoryId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/categories');
    revalidatePath('/categories');
    return { success: true };
}

// ==================== TAGS ====================

export async function createTag(data: {
    name_mm: string;
    name_en?: string;
    slug: string;
}) {
    const supabase = await createClient();

    const { data: tag, error } = await supabase
        .from('tags')
        .insert({
            name_mm: data.name_mm,
            name_en: data.name_en || null,
            slug: data.slug,
        })
        .select()
        .single();

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/tags');
    return { success: true, data: tag };
}

export async function deleteTag(tagId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('tags')
        .delete()
        .eq('id', tagId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/tags');
    return { success: true };
}

// ==================== ATTACHMENTS ====================

export async function deleteAttachment(attachmentId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('attachments')
        .delete()
        .eq('id', attachmentId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    revalidatePath('/downloads');
    return { success: true };
}

// ==================== POST-CATEGORY RELATIONS ====================

export async function addPostCategory(postId: string, categoryId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('post_categories')
        .insert({ post_id: postId, category_id: categoryId });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    return { success: true };
}

export async function removePostCategory(postId: string, categoryId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('post_categories')
        .delete()
        .eq('post_id', postId)
        .eq('category_id', categoryId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    return { success: true };
}

// ==================== POST-TAG RELATIONS ====================

export async function addPostTag(postId: string, tagId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('post_tags')
        .insert({ post_id: postId, tag_id: tagId });

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    return { success: true };
}

export async function removePostTag(postId: string, tagId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', postId)
        .eq('tag_id', tagId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/posts');
    return { success: true };
}
