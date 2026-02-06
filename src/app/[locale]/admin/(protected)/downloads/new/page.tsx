export const runtime = 'edge';
import { Link } from "@/i18n/routing";
import { ArrowLeft, Download } from "lucide-react";
import DownloadForm from "@/components/admin/DownloadForm";

export default function NewDownloadPage() {
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
                        New Download
                    </h1>
                    <p className="text-sm text-muted-foreground">Add a new downloadable file</p>
                </div>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-xl border border-border p-6">
                <DownloadForm />
            </div>
        </div>
    );
}
