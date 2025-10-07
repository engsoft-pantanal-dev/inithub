import { useCallback, useState } from "react";
import ConversationAgent from "@/components/features/chat/ChatMessages";
import PreviewPanel from "@/components/features/chat/ChatInitiativePreview";
import type { ChatInitiative } from "@/services/agent";
import { initiativesService } from "@/services/initiatives";
import Modal from "@/ui/modal";
  
const CreateInitiative = () => {
    const [initiative, setInitiative] = useState<ChatInitiative | null>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState<string | undefined>(undefined);
    const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);
    const [onConfirmAction, setOnConfirmAction] = useState<(() => void) | undefined>(
        undefined
    );

    const openModal = (title?: string, message?: string, onConfirm?: () => void) => {
        setModalTitle(title);
        setModalMessage(message);
        setOnConfirmAction(() => onConfirm);
        setModalOpen(true);
    };

    const handlePublish = useCallback(async () => {
        const i = initiative;
        if (!i) {
            openModal("Atenção", "Nenhuma ideia para publicar.");
            return;
        }

        const required: Array<[keyof ChatInitiative, string]> = [
            ["title", "Título"],
            ["theme", "Tema"],
            ["context", "Descrição"],
            ["deliverable", "Entregável"],
            ["evaluationCriteria", "Critérios de Avaliação"]
        ];

        const missing = required
            .filter(([k]) => !i[k] || String(i[k]).trim().length === 0)
            .map(([, label]) => label);

        if (missing.length > 0) {
            openModal("Campos faltando", `Preencha os campos: ${missing.join(", ")}`);
            return;
        }

        try {
            await initiativesService.createInitiative({
                title: String(i.title),
                description: String(i.context) || "",
                theme: String(i.theme),
                context: String(i.context),
                deliverable: String(i.deliverable),
                evaluationCriteria: String(i.evaluationCriteria),
            });
            openModal("Sucesso", "Ideia publicada com sucesso!", () => {
                // Reload to reset agent session and clear all fields/state
                window.location.reload();
            });
        } catch (e: any) {
            const msg = e?.message || "Falha ao publicar a ideia.";
            openModal("Erro", msg);
        }
    }, [initiative]);

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 py-8 h-full">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 ">
                <div className="bg-slate-50 h-full lg:col-span-3">
                    <ConversationAgent onInitiativeUpdate={setInitiative} />
                </div>
            
                <div className="bg-slate-50 lg:col-span-2">
                    <PreviewPanel initiative={initiative} onChange={setInitiative} onPublish={handlePublish} />
                </div>
            </div>
            <Modal
                open={modalOpen}
                title={modalTitle}
                message={modalMessage}
                confirmText={onConfirmAction ? "Confirmar" : "OK"}
                cancelText={onConfirmAction ? "Cancelar" : "Fechar"}
                onClose={() => setModalOpen(false)}
                onConfirm={onConfirmAction}
            />
        </div>   
    );
};
  
export default CreateInitiative;
