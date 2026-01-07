import { Download, FileText, Smartphone, Package } from "lucide-react";
import { Link } from "@/i18n/routing";

interface Attachment {
    id: string;
    type: string;
    title_mm: string;
    title_en: string | null;
    file_size: string | null;
    drive_url: string;
}

interface AttachmentListProps {
    attachments: Attachment[];
    locale: string;
}

export default function AttachmentList({ attachments, locale }: AttachmentListProps) {
    if (!attachments || attachments.length === 0) return null;

    const getIcon = (type: string) => {
        if (type.includes('apk')) return <Smartphone className="w-6 h-6" />;
        if (type.includes('pdf')) return <FileText className="w-6 h-6" />;
        return <Package className="w-6 h-6" />;
    };

    return (
        <div className="mt-12 bg-secondary/20 border border-primary/10 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-foreground mb-6 font-mm flex items-center gap-2">
                <Download className="w-5 h-5 text-primary" />
                {locale === 'en' ? 'Downloads' : 'ဒေါင်းလုတ်ရယူရန်'}
            </h3>

            <div className="space-y-4">
                {attachments.map((file) => (
                    <div
                        key={file.id}
                        className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors shadow-sm"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                {getIcon(file.type)}
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground font-mm">
                                    {locale === 'en' ? (file.title_en || file.title_mm) : file.title_mm}
                                </h4>
                                <span className="text-xs text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded">
                                    {file.type} {file.file_size && `• ${file.file_size}`}
                                </span>
                            </div>
                        </div>

                        <a
                            href={file.drive_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">{locale === 'en' ? 'Download' : 'ဒေါင်းလုတ်'}</span>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
