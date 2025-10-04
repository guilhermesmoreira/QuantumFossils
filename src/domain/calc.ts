// Fórmulas de custo/produção/capacidade
// Cálculos matemáticos do jogo

export const calculateCost = (baseCost: number, level: number, multiplier: number) => {
  // TODO: Implementar fórmula de custo progressivo
  return Math.floor(baseCost * Math.pow(multiplier, level))
}
