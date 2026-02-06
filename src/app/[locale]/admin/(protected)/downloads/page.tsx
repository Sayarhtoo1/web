export const runtime = 'edge';
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import { Plus, Edit, Trash2, Download, FileText, Smartphone, Search, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import DeleteDownloadButton from "@/components/admin/DeleteDownloadButton";

export default async function AdminDownloadsPage() {
    const supabase = await createClient();

    const { data: attachments } = await supabase
        .from("attachments")
        .select("*, posts(id, title_mm, slug, status)")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold font-mm">Manage Downloads</h1>
                <Link
                    href="/admin/downloads/new"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-lg"
                >
                    <Plus size={20} />
                    New Download
                </Link>
            </div>

            {/* Downloads Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-muted text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4 font-medium">Title</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Linked Post</th>
                                <th className="px-6 py-4 font-medium">Size</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 text-right font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {attachments?.map((attachment) => (
                                <tr key={attachment.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${attachment.type === 'pdf'
                                                    ? 'bg-red-100 dark:bg-red-950/30 text-red-600'
                                                    : 'bg-green-100 dark:bg-green-950/30 text-green-600'
                                                }`}>
                                                {attachment.type === 'pdf' ? <FileText size={20} /> : <Smartphone size={20} />}
                                            </div>
                                            <div>
                                                <span className="font-medium font-mm block">{attachment.title_mm}</span>
                                                {attachment.title_en && (
                                                    <span className="text-xs text-muted-foreground font-sans">{attachment.title_en}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${attachment.type === 'pdf'
                                                ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                                                : 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                                            }`}>
                                            {attachment.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {attachment.posts ? (
                                            <Link
                                                href={`/admin/posts/${attachment.posts.id}/edit`}
                                                className="text-primary hover:underline font-mm text-sm flex items-center gap-1"
                                            >
                                                {attachment.posts.title_mm?.substring(0, 30)}...
                                                <ExternalLink size={12} />
                                            </Link>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">—</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground/70">
                                        {attachment.file_size || '—'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground/70">
                                        {format(new Date(attachment.created_at), 'MMM d, yyyy')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <a
                                                href={attachment.drive_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-foreground/50 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                                                title="Open Link"
                                            >
                                                <ExternalLink size={18} />
                                            </a>
                                            <Link
                                                href={`/admin/downloads/${attachment.id}/edit`}
                                                className="p-2 text-foreground/50 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>
                                            <DeleteDownloadButton attachmentId={attachment.id} attachmentTitle={attachment.title_mm} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!attachments || attachments.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-4">
                                            <Download className="w-12 h-12 text-muted-foreground/30" />
                                            <p>No downloads found. Create one to get started.</p>
                                            <Link
                                                href="/admin/downloads/new"
                                                className="text-primary hover:underline font-medium"
                                            >
                                                Add your first download →
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-border">
                    {attachments?.map((attachment) => (
                        <div key={attachment.id} className="p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${attachment.type === 'pdf'
                                            ? 'bg-red-100 dark:bg-red-950/30 text-red-600'
                                            : 'bg-green-100 dark:bg-green-950/30 text-green-600'
                                        }`}>
                                        {attachment.type === 'pdf' ? <FileText size={20} /> : <Smartphone size={20} />}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-medium font-mm truncate">{attachment.title_mm}</h3>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {format(new Date(attachment.created_at), 'MMM d, yyyy')} • {attachment.file_size || 'Unknown size'}
                                        </p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase shrink-0 ${attachment.type === 'pdf'
                                        ? 'bg-red-50 text-red-700'
                                        : 'bg-green-50 text-green-700'
                                    }`}>
                                    {attachment.type}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                                <a
                                    href={attachment.drive_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-foreground/50 hover:text-primary transition-colors"
                                >
                                    <ExternalLink size={18} />
                                </a>
                                <Link
                                    href={`/admin/downloads/${attachment.id}/edit`}
                                    className="p-2 text-foreground/50 hover:text-primary transition-colors"
                                >
                                    <Edit size={18} />
                                </Link>
                                <DeleteDownloadButton attachmentId={attachment.id} attachmentTitle={attachment.title_mm} />
                            </div>
                        </div>
                    ))}
                    {(!attachments || attachments.length === 0) && (
                        <div className="p-8 text-center text-muted-foreground">
                            No downloads found. Create one to get started.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
