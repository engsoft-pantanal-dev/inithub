#!/bin/bash

# Script para atualizar iniciativas existentes e gerar embeddings automaticamente
# Este script faz UPDATE das iniciativas criadas pelo seed.ts para disparar a regeneração de embeddings

API_URL="http://localhost:3000"
INITIATIVES_ENDPOINT="$API_URL/api/initiatives"
CONTENT_TYPE="Content-Type: application/json"
MAX_RETRIES=3
RETRY_DELAY=2

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Função para verificar se a API está disponível
check_api_health() {
    log_info "Verificando saúde da API..."
    
    response=$(curl -s -w "%{http_code}" -o /dev/null "$API_URL" --connect-timeout 5)
    
    if [ "$response" -eq 200 ] || [ "$response" -eq 404 ]; then
        log_success "API está disponível em $API_URL"
        return 0
    else
        log_error "API não está disponível. Código: $response"
        log_error "Certifique-se de que o backend está rodando em $API_URL"
        return 1
    fi
}

# Função para atualizar uma iniciativa com retry
update_initiative() {
    local initiative_id="$1"
    local title="$2"
    local json_data="$3"
    local attempt=1
    
    while [ $attempt -le $MAX_RETRIES ]; do
        log_info "Atualizando: $title (ID: $initiative_id) (tentativa $attempt/$MAX_RETRIES)"
        
        response=$(curl -s -w "%{http_code}" -X PATCH \
            "$INITIATIVES_ENDPOINT/$initiative_id" \
            -H "accept: */*" \
            -H "$CONTENT_TYPE" \
            -d "$json_data" \
            -o /tmp/response.json)
        
        if [ "$response" -eq 200 ]; then
            log_success "$title atualizada com sucesso! (Embeddings serão gerados automaticamente)"
            return 0
        else
            log_warning "$title falhou (HTTP $response). Tentando novamente em ${RETRY_DELAY}s..."
            if [ -f /tmp/response.json ]; then
                echo "Resposta da API: $(cat /tmp/response.json)"
            fi
            sleep $RETRY_DELAY
            ((attempt++))
        fi
    done
    
    log_error "Falha ao atualizar $title após $MAX_RETRIES tentativas"
    return 1
}

# Verificar se a API está disponível antes de continuar
if ! check_api_health; then
    exit 1
fi

echo ""
log_info "🔄 Iniciando atualização de iniciativas para gerar embeddings..."
log_info "📝 As iniciativas existentes serão atualizadas para disparar a geração de embeddings"
echo "=================================================================="

# Array com as iniciativas existentes (IDs do seed.ts) e dados de atualização
declare -a initiative_updates=(
    'rxpzm-vbktj-qwlgn|Ferramenta de Revisão Automática com IA|{"title": "Ferramenta de Revisão Automática com IA", "description": "Sistema inteligente para revisão automática de propostas internas utilizando modelos de linguagem avançados (LLMs). A ferramenta analisará documentos, identificará inconsistências, sugerirá melhorias de redação e verificará conformidade com políticas internas. Incluirá análise de sentimento, detecção de viés e sugestões de estruturação para maximizar clareza e impacto das propostas.", "theme": "Inteligência Artificial", "context": "O processo manual de revisão de propostas internas consome tempo excessivo das equipes e apresenta inconsistências na qualidade. Com o volume crescente de documentos e a necessidade de padronização, uma solução automatizada baseada em IA pode acelerar significativamente o processo mantendo alta qualidade.", "deliverable": "Sistema web integrado com workflow de aprovação, API para upload de documentos, dashboard de métricas de qualidade e relatórios de sugestões implementadas", "evaluationCriteria": "Redução de 70% no tempo de revisão, aumento de 85% na satisfação com qualidade das propostas revisadas e economia de 40 horas/semana de trabalho manual"}'

    'kqwxn-mrhzv-tlpjg|Pipeline de Anonimização Automática para ML|{"title": "Pipeline de Anonimização Automática para ML", "description": "Sistema automatizado para anonimização de dados sensíveis em pesquisas internas de Machine Learning, utilizando técnicas avançadas de preservação de privacidade como differential privacy, k-anonymity e synthetic data generation. O pipeline garantirá conformidade com LGPD/GDPR enquanto mantém a utilidade dos dados para análises e treinamento de modelos.", "theme": "Privacy Tech", "context": "Pesquisas internas de ML frequentemente requerem dados sensíveis que não podem ser compartilhados diretamente. A falta de um pipeline robusto de anonimização limita experimentos e pesquisas, criando gargalos para inovação enquanto expõe a empresa a riscos de compliance e vazamento de dados.", "deliverable": "Pipeline automatizado de anonimização, API para processamento batch e streaming, dashboard de métricas de privacidade e documentação de conformidade LGPD", "evaluationCriteria": "100% de conformidade em auditorias de privacidade, redução de 90% no tempo de preparação de dados para pesquisa e aumento de 200% no volume de experimentos ML internos"}'

    'zmvtx-jbqpr-wkghl|Chatbot IA para Onboarding de Colaboradores|{"title": "Chatbot IA para Onboarding de Colaboradores", "description": "Assistente virtual inteligente para apoiar novos colaboradores durante o processo de integração, fornecendo informações personalizadas, respondendo dúvidas em tempo real e guiando através de procedimentos internos. O chatbot utilizará processamento de linguagem natural avançado e estará integrado aos sistemas de RH para acesso contextual a informações relevantes.", "theme": "Recursos Humanos", "context": "O processo de onboarding atual é fragmentado e gera muitas dúvidas repetitivas que sobrecarregam o time de RH. Novos colaboradores frequentemente se sentem perdidos nos primeiros dias, impactando produtividade inicial e satisfação. Um assistente IA pode padronizar e acelerar essa experiência.", "deliverable": "Chatbot integrado ao portal interno, base de conhecimento dinâmica, analytics de interações e satisfação, e sistema de escalação para casos complexos", "evaluationCriteria": "Redução de 60% nas consultas manuais ao RH, aumento de 40% na satisfação de onboarding (NPS > 80) e redução de 50% no tempo até produtividade plena"}'

    'blvzq-thxpn-mjkwr|Sistema de Detecção de Anomalias com ML|{"title": "Sistema de Detecção de Anomalias com ML", "description": "Plataforma de machine learning para detecção proativa de anomalias em processos críticos de negócio, utilizando algoritmos de detecção não supervisionada e redes neurais. O sistema monitorará KPIs em tempo real, identificará padrões atípicos e alertará automaticamente as equipes responsáveis com análise de causa raiz sugerida.", "theme": "Monitoramento Inteligente", "context": "Anomalias em processos críticos frequentemente passam despercebidas até causarem impactos significativos. A detecção manual é reativa e ineficiente, resultando em perdas operacionais e financeiras que poderiam ser evitadas com monitoramento inteligente proativo.", "deliverable": "Sistema de monitoramento em tempo real, dashboard de alertas inteligentes, modelos de ML para diferentes tipos de processos e relatórios de análise de tendências", "evaluationCriteria": "Detecção de 95% das anomalias críticas em até 5 minutos, redução de 80% no tempo de resposta a incidentes e economia de R$ 500k anuais em perdas evitadas"}'

    'bxktn-rmvzq-phjlw|Assistente IA para Análise de Dados|{"title": "Assistente IA para Análise de Dados", "description": "Ferramenta de inteligência artificial que democratiza análise de dados complexos, permitindo que usuários não-técnicos façam consultas em linguagem natural e recebam insights automatizados. O sistema utilizará LLMs especializados em análise de dados, geração automática de visualizações e interpretação estatística inteligente.", "theme": "Data Democratization", "context": "Análises de dados complexas estão concentradas em poucos especialistas, criando gargalos e limitando o acesso a insights críticos para tomada de decisão. A democratização através de IA pode acelerar a cultura data-driven em toda organização.", "deliverable": "Interface conversacional para consultas de dados, gerador automático de relatórios, biblioteca de visualizações inteligentes e sistema de recomendações de análises", "evaluationCriteria": "Aumento de 300% no número de análises realizadas por mês, redução de 70% no tempo de geração de relatórios e adoção por 90% dos gestores não-técnicos"}'

    'hzvpk-nxqtr-wmglj|Sistema de Recomendação Personalizada com Deep Learning|{"title": "Sistema de Recomendação Personalizada com Deep Learning", "description": "Motor de recomendação avançado utilizando redes neurais profundas para personalizar experiências de usuários internos, sugerindo conteúdos relevantes, treinamentos, projetos e conexões baseados em comportamento, preferências e objetivos profissionais. Incluirá aprendizado contínuo e explicabilidade das recomendações.", "theme": "Personalização IA", "context": "Com o crescimento da base de conhecimento interna e diversidade de perfis profissionais, colaboradores frequentemente perdem oportunidades relevantes por falta de descoberta eficiente. Um sistema inteligente pode conectar pessoas, projetos e conhecimentos de forma otimizada.", "deliverable": "Engine de recomendação em tempo real, API de personalização, dashboard de métricas de engajamento e sistema de feedback para melhoria contínua", "evaluationCriteria": "Aumento de 150% no engajamento com conteúdos internos, melhoria de 60% na assertividade de matches projeto-pessoa e redução de 40% no tempo de descoberta de recursos relevantes"}'

    'kmnxz-rlvtq-pwhjg|Automação de Documentação Técnica com IA|{"title": "Automação de Documentação Técnica com IA", "description": "Sistema automatizado para geração e manutenção de documentação técnica utilizando análise de código, processamento de linguagem natural e modelos generativos. A ferramenta extrairá automaticamente informações de repositórios, gerará documentação padronizada e manterá sincronização com mudanças no código.", "theme": "DevOps Inteligente", "context": "Documentação técnica frequentemente está desatualizada ou inexistente, criando barreiras para onboarding de desenvolvedores e manutenção de sistemas. O processo manual é custoso e raramente priorizado, resultando em débito técnico significativo.", "deliverable": "Sistema de geração automática de docs, integração com Git, templates inteligentes e dashboard de cobertura de documentação", "evaluationCriteria": "Aumento de 400% na cobertura de documentação, redução de 80% no tempo de onboarding técnico e melhoria de 90% na satisfação de desenvolvedores com qualidade da documentação"}'

    'nwxzq-jmktv-rbghl|Otimização Inteligente de Recursos Computacionais|{"title": "Otimização Inteligente de Recursos Computacionais", "description": "Sistema de IA para otimização automática de alocação de recursos computacionais baseado em padrões de uso, previsão de demanda e análise de performance. Utilizará reinforcement learning para tomar decisões dinâmicas de scaling, migração e balanceamento de cargas, maximizando eficiência e minimizando custos.", "theme": "Cloud Optimization", "context": "Recursos computacionais são frequentemente subutilizados ou super-provisionados, resultando em desperdício financeiro significativo. A gestão manual é reativa e não consegue acompanhar padrões complexos de demanda, especialmente em ambientes cloud dinâmicos.", "deliverable": "Sistema de auto-scaling inteligente, dashboard de otimização de custos, alertas preditivos de capacidade e relatórios de eficiência de recursos", "evaluationCriteria": "Redução de 35% nos custos de infraestrutura, melhoria de 50% na utilização de recursos e redução de 90% em incidentes relacionados a capacidade"}'
)

# Contador de sucessos
success_count=0
total_count=${#initiative_updates[@]}

# Atualizar cada iniciativa
for initiative_update in "${initiative_updates[@]}"; do
    IFS='|' read -r initiative_id title json_data <<< "$initiative_update"
    
    if update_initiative "$initiative_id" "$title" "$json_data"; then
        ((success_count++))
    fi
    
    echo ""
    sleep 1  # Pequena pausa entre requisições
done

# Relatório final
echo "=================================================================="
log_success "Processo de atualização concluído!"
log_info "Sucessos: $success_count/$total_count iniciativas atualizadas"

if [ $success_count -eq $total_count ]; then
    log_success "🎉 Todas as iniciativas foram atualizadas com sucesso!"
    log_success "🤖 Embeddings estão sendo gerados automaticamente em background"
    log_info "💡 As iniciativas agora têm embeddings para busca semântica!"
else
    log_warning "⚠️  Algumas iniciativas falharam. Verifique os logs acima."
fi

echo ""
log_info "� Para verificar se os embeddings foram gerados:"
log_info "   - Conecte no banco: psql -h localhost -U postgres -d inithub"
log_info "   - Execute: SELECT id, title, embedding IS NOT NULL as has_embedding FROM initiatives;"
echo ""
log_info "🔗 Acesse http://localhost:3000 para testar a busca semântica"

# Cleanup
rm -f /tmp/response.json
