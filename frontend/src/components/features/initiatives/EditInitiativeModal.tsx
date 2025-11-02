import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import type { Initiative } from "@/types/initiative";

type EditableFields = Pick<
  Initiative,
  "title" | "theme" | "description" | "context" | "deliverable" | "evaluationCriteria"
>;

type EditInitiativeModalProps = {
  open: boolean;
  initiative: Initiative | null;
  onClose: () => void;
  onSave: (values: EditableFields) => Promise<void> | void;
  isSaving: boolean;
  errorMessage?: string | null;
};

const emptyValues: EditableFields = {
  title: "",
  theme: "",
  description: "",
  context: "",
  deliverable: "",
  evaluationCriteria: "",
};

const EditInitiativeModal = ({
  open,
  initiative,
  onClose,
  onSave,
  isSaving,
  errorMessage,
}: EditInitiativeModalProps) => {
  const [formValues, setFormValues] = useState<EditableFields>(emptyValues);

  useEffect(() => {
    if (initiative && open) {
      setFormValues({
        title: initiative.title ?? "",
        theme: initiative.theme ?? "",
        description: initiative.description ?? "",
        context: initiative.context ?? "",
        deliverable: initiative.deliverable ?? "",
        evaluationCriteria: initiative.evaluationCriteria ?? "",
      });
    } else if (!open) {
      setFormValues(emptyValues);
    }
  }, [initiative, open]);

  if (!open || !initiative) {
    return null;
  }

  const handleChange = (field: keyof EditableFields) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = event.target;
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;
    await onSave(formValues);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 md:mx-6 p-6 md:p-8 overflow-y-auto max-h-[90vh]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Editar iniciativa</h2>
            <p className="text-sm text-gray-500 mt-1">
              Atualize as informações da sua iniciativa e salve para ver as mudanças imediatamente.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Fechar edição"
            type="button"
            disabled={isSaving}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="initiative-title">Título</Label>
              <Input
                id="initiative-title"
                value={formValues.title}
                onChange={handleChange("title")}
                placeholder="Ex: Laboratório de Inovação Pantaneiro"
                maxLength={160}
                required
                disabled={isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="initiative-theme">Tema</Label>
              <Input
                id="initiative-theme"
                value={formValues.theme}
                onChange={handleChange("theme")}
                placeholder="Ex: Cultura Organizacional"
                maxLength={120}
                required
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="initiative-description">Descrição</Label>
            <textarea
              id="initiative-description"
              value={formValues.description}
              onChange={handleChange("description")}
              placeholder="Contextualize o problema, a oportunidade e o impacto esperado."
              className="w-full min-h-[120px] rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-primary)] disabled:opacity-50"
              required
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initiative-context">Contexto</Label>
            <textarea
              id="initiative-context"
              value={formValues.context}
              onChange={handleChange("context")}
              placeholder="Explique o cenário atual, stakeholders envolvidos e desafios identificados."
              className="w-full min-h-[120px] rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-primary)] disabled:opacity-50"
              required
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initiative-deliverable">Entregável</Label>
            <textarea
              id="initiative-deliverable"
              value={formValues.deliverable}
              onChange={handleChange("deliverable")}
              placeholder="Descreva o que será entregue ao final da iniciativa."
              className="w-full min-h-[120px] rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-primary)] disabled:opacity-50"
              required
              disabled={isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="initiative-evaluation">Critérios de avaliação</Label>
            <textarea
              id="initiative-evaluation"
              value={formValues.evaluationCriteria}
              onChange={handleChange("evaluationCriteria")}
              placeholder="Liste como o sucesso será medido (KPIs, métricas, indicadores qualitativos)."
              className="w-full min-h-[120px] rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--green-primary)] disabled:opacity-50"
              required
              disabled={isSaving}
            />
          </div>

          {errorMessage && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold text-white bg-[var(--green-primary)] hover:bg-green-700 rounded-lg transition-colors disabled:opacity-60"
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInitiativeModal;
