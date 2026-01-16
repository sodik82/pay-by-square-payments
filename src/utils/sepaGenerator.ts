import { Document, validateIBAN } from "sepa";
import type { Payment } from "bysquare";

export interface DebtorInfo {
  iban: string;
  bic: string;
  name: string;
}

export function generateSepaXml(
  payment: Payment,
  debtorInfo: DebtorInfo
): string {
  const bankAccount = payment.bankAccounts[0];
  if (!bankAccount) {
    throw new Error("No bank account found in payment data");
  }

  const doc = new Document("pain.001.001.03");

  // Generate unique message ID based on timestamp
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, "");
  const msgId = `PBS${timestamp}`;

  // Group Header
  doc.grpHdr.id = msgId;
  doc.grpHdr.created = new Date();
  doc.grpHdr.initiatorName = debtorInfo.name;

  // Payment Info
  const info = doc.createPaymentInfo();
  info.requestedExecutionDate = new Date();
  info.debtorIBAN = debtorInfo.iban.replace(/\s/g, "");
  info.debtorBIC = debtorInfo.bic.replace(/\s/g, "");
  info.debtorName = debtorInfo.name;

  // Transaction
  const tx = info.createTransaction();
  tx.creditorName = payment.beneficiary?.name || "Unknown";
  tx.creditorIBAN = bankAccount.iban.replace(/\s/g, "");
  tx.creditorBIC = bankAccount.bic?.replace(/\s/g, "") || "";
  tx.amount = payment.amount || 0;
  tx.currency = payment.currencyCode || "EUR";

  // Build reference from payment symbols and note
  const referenceParts: string[] = [];
  if (payment.variableSymbol) referenceParts.push(`VS:${payment.variableSymbol}`);
  if (payment.constantSymbol) referenceParts.push(`KS:${payment.constantSymbol}`);
  if (payment.specificSymbol) referenceParts.push(`SS:${payment.specificSymbol}`);

  // Set end-to-end ID (max 35 chars)
  const end2endRef = referenceParts.join(" ").slice(0, 35) || `E2E${timestamp.slice(-10)}`;
  tx.end2endId = end2endRef;

  // Set remittance info (payment note or reference)
  const remittanceInfo = payment.paymentNote || referenceParts.join(" ") || "";
  if (remittanceInfo) {
    tx.remittanceInfo = remittanceInfo.slice(0, 140); // Max 140 chars
  }

  info.addTransaction(tx);
  doc.addPaymentInfo(info);

  return doc.toString();
}

export function isValidIBAN(iban: string): boolean {
  return validateIBAN(iban.replace(/\s/g, ""));
}

export function isDebtorInfoComplete(info: DebtorInfo): boolean {
  return !!(
    info.iban.trim() &&
    info.bic.trim() &&
    info.name.trim() &&
    isValidIBAN(info.iban)
  );
}
