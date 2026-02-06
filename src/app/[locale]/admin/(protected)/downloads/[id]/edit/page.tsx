export const runtime = 'edge';
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Download } from "lucide-react";
import DownloadForm from "@/components/admin/DownloadForm";

export default async function EditDownloadPage({
    params
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: attachment } = await supabase
        .from("attachments")
        .select("*")
        .eq("id", id)
        .single();

    if (!attachment) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/downloads"
                    className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Download className="text-primary" />
                        Edit Download
                    </h1>
                    <p className="text-sm text-muted-foreground font-mm">{attachment.title_mm}</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-xl border border-border p-6">
                <DownloadForm attachment={attachment} />
            </div>
        </div>
    );
}
