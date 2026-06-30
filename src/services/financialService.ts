import FirestoreApi, { type UserMeta } from "@/services/firestoreApi";
import {
  listPublishedOrgProjects,
  listProjectSubItems,
} from "@/services/projectManagementService";
import {
  PROJECT_SUBCOLLECTIONS,
  type ProjectFinancialSummary,
  type ProjectReport,
} from "@/types/project-management";

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

export type PublishedFinancialRollup = {
  projectCount: number;
  donationAmount: number;
  expenses: number;
  remaining: number;
  currency: string;
};

export async function getPublishedProjectsFinancialRollup(): Promise<PublishedFinancialRollup> {
  const projects = await listPublishedOrgProjects();
  let donationAmount = 0;
  let expenses = 0;
  let currency = "USD";

  for (const project of projects) {
    const fin = await getProjectFinancial(project.id);
    donationAmount += fin.donationAmount;
    expenses += fin.expenses;
    if (fin.currency) currency = fin.currency;
  }

  return {
    projectCount: projects.length,
    donationAmount,
    expenses,
    remaining: donationAmount - expenses,
    currency,
  };
}

export type PublicProjectReport = ProjectReport & {
  projectId: string;
  projectName: string;
};

export async function listPublicProjectReports(): Promise<PublicProjectReport[]> {
  const projects = await listPublishedOrgProjects();
  const reports: PublicProjectReport[] = [];

  for (const project of projects) {
    const items = await listProjectSubItems<ProjectReport>(
      project.id,
      PROJECT_SUBCOLLECTIONS.reports
    );
    for (const item of items) {
      if (item.file) {
        reports.push({ ...item, projectId: project.id, projectName: project.projectName });
      }
    }
  }

  return reports.sort((a, b) => (b.uploadedAt ?? "").localeCompare(a.uploadedAt ?? ""));
}
