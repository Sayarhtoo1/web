export const runtime = 'edge';
import { createClient } from "@/lib/supabase/server";
import { Plus, Search } from "lucide-react";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryItem from "@/components/admin/CategoryItem";

export default async function AdminCategoriesPage() {
    const supabase = await createClient();

    const { data: categories } = await supabase
        .from("categories")
        .select("*, post_categories(count)")
        .order("name_mm");

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-mm">Categories</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create New Category Form */}
                <div className="lg:col-span-1">
                    <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Plus size={20} className="text-primary" />
                            New Category
                        </h2>
                        <CategoryForm />
                    </div>
                </div>

                {/* Categories List */}
                <div className="lg:col-span-2">
                    <div className="bg-card rounded-xl border border-border overflow-hidden">
                        <div className="p-4 border-b border-border bg-muted/30">
                            <h2 className="font-bold">All Categories ({categories?.length || 0})</h2>
                        </div>

                        <div className="divide-y divide-border">
                            {categories?.map((category) => (
                                <CategoryItem
                                    key={category.id}
                                    category={category}
                                    postCount={category.post_categories?.[0]?.count || 0}
                                />
                            ))}

                            {(!categories || categories.length === 0) && (
                                <div className="p-12 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center gap-4">
                                        <Search className="w-12 h-12 text-muted-foreground/30" />
                                        <p>No categories yet. Create one to get started.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
