import FirestoreApi, { type UserMeta } from "@/services/firestoreApi";
import type { ProjectFinancialSummary } from "@/types/project-management";

const api = FirestoreApi.Api;

const EMPTY_FINANCIAL: ProjectFinancialSummary = {
  projectValue: 0,
  donationAmount: 0,
  expenses: 0,
  remaining: 0,
  spendRatio: 0,
  currency: "USD",
};

function calcSummary(data: Partial<ProjectFinancialSummary>): ProjectFinancialSummary {
  const projectValue = data.projectValue ?? 0;
  const donationAmount = data.donationAmount ?? 0;
  const expenses = data.expenses ?? 0;
  const remaining = donationAmount - expenses;
  const spendRatio = donationAmount > 0 ? Math.round((expenses / donationAmount) * 100) : 0;
  return {
    projectValue,
    donationAmount,
    expenses,
    remaining,
    spendRatio,
    currency: data.currency ?? "USD",
  };
}

export async function getProjectFinancial(
  projectId: string
): Promise<ProjectFinancialSummary> {
  const data = await api.getData(api.getProjectFinancialDoc(projectId));
  return data ? calcSummary(data as ProjectFinancialSummary) : { ...EMPTY_FINANCIAL };
}

export async function saveProjectFinancial(
  projectId: string,
  data: Partial<ProjectFinancialSummary>,
  user: UserMeta
): Promise<void> {
  const summary = calcSummary(data);
  await api.setData({
    docRef: api.getProjectFinancialDoc(projectId),
    data: summary,
    userData: user,
  });
}
