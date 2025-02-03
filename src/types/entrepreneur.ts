export interface CreateIdeaDto {
  title: string;
  abstract: string;
  expectedInvestment: number;
  categoryId: string;
}

export interface UpdateIdeaDto {
  title?: string;
  abstract?: string;
  expectedInvestment?: number;
  categoryId?: string;
}