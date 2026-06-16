import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { solicitarContratacaoUseCase } from "../../infrastructure/di/container";
import { BrowserStorage } from "../../infrastructure/storage/BrowserStorage";
import { DomainError } from "../../domain/errors/DomainError";

export interface SolicitacaoItem {
  id: string;
  planoId: number;
  planoNome: string;
  nome: string;
  email: string;
  documento: string;
  status: "Pendente" | "Confirmado" | "Falhou";
  timestamp: string;
}

const RECENT_REQUESTS_KEY = "recent-requests";

// Helper para ler/escrever no LocalStorage persistente
function getPersistedRequests(): SolicitacaoItem[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(RECENT_REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function persistRequests(requests: SolicitacaoItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(RECENT_REQUESTS_KEY, JSON.stringify(requests));
}

export function useContratacao() {
  const queryClient = useQueryClient();

  // Query para buscar a lista de solicitações persistida no browser
  const { data: solicitacoes = [] } = useQuery<SolicitacaoItem[]>({
    queryKey: ["minhas-solicitacoes"],
    queryFn: () => getPersistedRequests(),
    initialData: [],
  });

  const mutation = useMutation<
    { status: string; cliente_id: number; mensagem: string },
    Error,
    { planoId: number; planoNome: string; nome: string; email: string; documento: string; documentoUrl: string | null },
    { previousRequests: SolicitacaoItem[] }
  >({
    mutationFn: async (variables) => {
      const token = BrowserStorage.getToken() ?? undefined;
      return await solicitarContratacaoUseCase.execute({
        planoId: variables.planoId,
        nome: variables.nome,
        email: variables.email,
        documento: variables.documento,
        documentoUrl: variables.documentoUrl,
        token,
      });
    },
    onMutate: async (newRequest) => {
      // Cancela refetches em andamento
      await queryClient.cancelQueries({ queryKey: ["minhas-solicitacoes"] });

      // Captura o estado anterior do cache (para rollback se falhar)
      const previousRequests = queryClient.getQueryData<SolicitacaoItem[]>(["minhas-solicitacoes"]) || [];

      // Cria a nova solicitação otimista
      const optimisticRequest: SolicitacaoItem = {
        id: Math.random().toString(36).substring(2, 9),
        planoId: newRequest.planoId,
        planoNome: newRequest.planoNome,
        nome: newRequest.nome,
        email: newRequest.email,
        documento: newRequest.documento,
        status: "Pendente",
        timestamp: new Date().toLocaleTimeString(),
      };

      const updatedRequests = [optimisticRequest, ...previousRequests];

      // Atualiza instantaneamente o cache visual (Atualização Otimista)
      queryClient.setQueryData(["minhas-solicitacoes"], updatedRequests);
      persistRequests(updatedRequests);

      // Retorna o contexto com o cache anterior para o rollback
      return { previousRequests };
    },
    onError: (err, newRequest, context) => {
      // MECANISMO DE ROLLBACK: Restaura o cache para o visual antigo automaticamente se a rede falhar
      if (context?.previousRequests) {
        queryClient.setQueryData(["minhas-solicitacoes"], context.previousRequests);
        persistRequests(context.previousRequests);
      }
    },
    onSuccess: (data, variables) => {
      // Atualiza o status da solicitação pendente para 'Confirmado'
      const current = queryClient.getQueryData<SolicitacaoItem[]>(["minhas-solicitacoes"]) || [];
      const updated = current.map((item) => {
        // Encontra o item pendente correspondente pelos dados preenchidos
        if (
          item.status === "Pendente" &&
          item.documento === variables.documento &&
          item.planoId === variables.planoId
        ) {
          return { ...item, status: "Confirmado" as const };
        }
        return item;
      });
      queryClient.setQueryData(["minhas-solicitacoes"], updated);
      persistRequests(updated);
    },
  });

  return {
    solicitacoes,
    solicitar: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error,
  };
}
