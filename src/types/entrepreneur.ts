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

export interface UpdateStatusDto {
  status: "AVAILABLE" | "UNDER_DISCUSSION" | "BOOKED" | "INVESTED";
}
