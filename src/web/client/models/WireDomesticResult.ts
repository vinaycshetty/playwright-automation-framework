export interface WireDomesticResult {
  status: string;
  amount: string;
  paymentType: string;
  valueDate?: string;
  paymentId?: string;
  invalidAccountMessage?: string;
  templateCode?: string;
}
