"""Sample initiatives for testing the automation."""

SAMPLE_INITIATIVES = [
    {
        "title": "Sistema de Gestão de Biblioteca Digital",
        "theme": "Tecnologia e Educação",
        "context": "A biblioteca da universidade ainda usa um sistema manual de controle de empréstimos, causando filas e dificuldades na busca por livros disponíveis.",
        "description": "Criar uma plataforma web que permita aos alunos pesquisar, reservar e renovar empréstimos de livros de forma online, com notificações automáticas de devolução.",
        "deliverable": "Sistema web completo com busca, reserva, controle de empréstimos e painel administrativo para bibliotecários.",
        "evaluation_criteria": "Redução do tempo de atendimento em 70%, feedback positivo de 80% dos usuários e integração com o sistema acadêmico.",
    },
    {
        "title": "App de Carona Solidária Universitária",
        "theme": "Mobilidade Sustentável",
        "context": "Muitos alunos enfrentam dificuldades de transporte para chegar à universidade, especialmente em horários alternativos, resultando em faltas e atrasos.",
        "description": "Desenvolver um aplicativo mobile que conecte alunos que oferecem caronas com aqueles que precisam, promovendo economia compartilhada e redução da emissão de carbono.",
        "deliverable": "Aplicativo móvel para Android e iOS com sistema de matching, avaliações, chat e compartilhamento de custos.",
        "evaluation_criteria": "Alcançar 500 usuários ativos no primeiro semestre, reduzir em 30% as faltas por falta de transporte e obter NPS acima de 50.",
    },
    {
        "title": "Horta Comunitária Inteligente",
        "theme": "Sustentabilidade e Alimentação",
        "context": "O campus possui áreas verdes subutilizadas enquanto a comunidade acadêmica demonstra interesse em agricultura urbana e alimentação saudável.",
        "description": "Implementar uma horta comunitária com sistema de irrigação automatizado e sensores IoT para monitoramento, onde alunos e funcionários possam cultivar alimentos orgânicos.",
        "deliverable": "Horta equipada com sistema IoT, aplicativo de monitoramento e programa de workshops de agricultura urbana.",
        "evaluation_criteria": "Produção de 200kg de alimentos orgânicos no primeiro ano, engajamento de 100 participantes e redução de 20% no consumo de água através da automação.",
    },
]


def get_initiative(index: int = 0) -> dict:
    """Get a sample initiative by index."""
    return SAMPLE_INITIATIVES[index % len(SAMPLE_INITIATIVES)]


def get_all_initiatives() -> list[dict]:
    """Get all sample initiatives."""
    return SAMPLE_INITIATIVES
