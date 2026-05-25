import { useQuery } from "@tanstack/react-query";
import { contratacaoRepository } from "../../infrastructure/di/container";
import { Plan } from "../../domain/repositories/IContratacaoRepository";

export function usePlanos() {
  return useQuery<Plan[], Error>({
    queryKey: ["planos"],
    queryFn: () => contratacaoRepository.buscarPlanos(),
  });
}
