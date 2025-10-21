import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import InitiativeCard from '@/components/features/initiatives/InitiativeCard';
import Filters from '@/components/features/filters/Filters';
import Aside from '@/components/layout/Aside';
import { initiativesService } from '@/services/initiatives';
import type { Initiative } from '@/types/initiative';

const Home = () => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchInitiatives = async () => {
      try {
        const data = await initiativesService.getInitiatives();
        setInitiatives(data);
      } catch (error) {
        console.error("Erro ao buscar iniciativas:", error);
      }
    };

    fetchInitiatives();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-white p-2 rounded-lg shadow-sm border border-gray-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-sm font-medium">Menu</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-6 lg:space-y-0">
          {isSidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}>
              <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Menu</h3>
                    <button
                      onClick={() => setIsSidebarOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <Aside initiatives={initiatives} />
                </div>
              </div>
            </div>
          )}

          <div className="hidden lg:block">
            <Aside initiatives={initiatives} />
          </div>

          <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
            <Filters initiatives={initiatives} onChange={async (params) => {
              try {
                const data = await initiativesService.getInitiatives(params);
                setInitiatives(data);
              } catch (err) {
                console.error('Erro ao buscar iniciativas com filtros', err);
              }
            }} />
            
            <div className="space-y-4 sm:space-y-6">
              {initiatives.map((initiative) => (
                <InitiativeCard key={initiative.id} initiative={initiative} isManaged={false}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/create-initiative"
        className="fixed bottom-6 right-6 bg-[var(--green-primary)] text-white p-4 rounded-full shadow-xl hover:bg-green-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--green-primary)]"
        aria-label="Conversar com o assistente"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="sr-only">Abrir chat com o assistente</span>
      </Link>
    </div>
  );
};

export default Home;
