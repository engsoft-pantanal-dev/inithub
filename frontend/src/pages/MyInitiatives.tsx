import { useEffect, useState } from 'react';
import InitiativeCard from '@/components/features/initiatives/InitiativeCard';
import EditInitiativeModal from '@/components/features/initiatives/EditInitiativeModal';
import { initiativesService } from '@/services/initiatives';
import { useAuth } from '@/hooks/useAuth';
import type { Initiative } from '@/types/initiative';

const MyInitiatives = () => {
    const [initiatives, setInitiatives] = useState<Initiative[]>([]);
    const [managedInitiatives, setManagedInitiatives] = useState<Initiative[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingInitiative, setEditingInitiative] = useState<Initiative | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchInitiatives = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                const userInitiatives = await initiativesService.getUserInitiatives();
                setInitiatives(userInitiatives);

                const managed = await initiativesService.getUserManagedInitiatives();
                setManagedInitiatives(managed);
            } catch (error) {
                console.error('Erro ao buscar iniciativas:', error);
            } finally {
                setLoading(false);
            }
        };
        if (user) {
          fetchInitiatives();
        } else {
          setLoading(false);
        }

    }, [user]);

    const handleOpenEditModal = (initiative: Initiative) => {
        setEditingInitiative(initiative);
        setEditError(null);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        if (isSavingEdit) {
            return;
        }
        setIsEditModalOpen(false);
        setEditingInitiative(null);
        setEditError(null);
    };

    const handleSaveEdit = async (values: {
        title: string;
        theme: string;
        description: string;
        context: string;
        deliverable: string;
        evaluationCriteria: string;
    }) => {
        if (!editingInitiative) {
            return;
        }

        setIsSavingEdit(true);
        setEditError(null);

        try {
            const updated = await initiativesService.updateInitiative(editingInitiative.id, values);

            setInitiatives((prev) =>
                prev.map((initiativeItem) =>
                    initiativeItem.id === editingInitiative.id
                        ? {
                              ...initiativeItem,
                              ...values,
                              ...updated,
                          }
                        : initiativeItem,
                ),
            );

            setManagedInitiatives((prev) =>
                prev.map((initiativeItem) =>
                    initiativeItem.id === editingInitiative.id
                        ? {
                              ...initiativeItem,
                              ...values,
                              ...updated,
                          }
                        : initiativeItem,
                ),
            );

            setIsEditModalOpen(false);
            setEditingInitiative(null);
        } catch (error: any) {
            console.error('Erro ao atualizar iniciativa:', error);
            const message =
                error?.response?.data?.message ||
                error?.message ||
                'Não foi possível atualizar a iniciativa. Tente novamente.';
            setEditError(Array.isArray(message) ? message.join(' ') : message);
        } finally {
            setIsSavingEdit(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {loading ? (
                    <div className="flex justify-center items-center min-h-64">
                        <p className="text-gray-600">Carregando suas iniciativas...</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-12">
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">Minhas Iniciativas</h4>
                            {initiatives.length === 0 ? (
                                <p className="text-gray-600 text-center">Nenhuma proposta foi cadastrada por você até o momento. Para começar, crie uma nova iniciativa.</p>
                            ) : (
                                <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
                                    {initiatives.map(initiative => (
                                        <InitiativeCard 
                                            key={initiative.id} 
                                            initiative={initiative} 
                                            isManaged={false}
                                            canEdit={initiative.authorId === user?.id}
                                            onEdit={handleOpenEditModal}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm lg:text-base">Iniciativas que Gerencio</h4>
                            {managedInitiatives.length === 0 ? (
                                <p className="text-gray-600 text-center">Nenhuma iniciativa está sob sua gestão no momento.</p>
                            ) : (
                                <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
                                    {managedInitiatives.map(initiative => (
                                        <InitiativeCard 
                                            key={initiative.id} 
                                            initiative={initiative} 
                                            isManaged={true}
                                            canEdit={initiative.authorId === user?.id}
                                            onEdit={handleOpenEditModal}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <EditInitiativeModal
                open={isEditModalOpen}
                initiative={editingInitiative}
                onClose={handleCloseEditModal}
                onSave={handleSaveEdit}
                isSaving={isSavingEdit}
                errorMessage={editError}
            />
        </div>
    )
}

export default MyInitiatives;