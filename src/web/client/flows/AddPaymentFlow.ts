// flows/AddPaymentFlow.ts
import { Page } from "@playwright/test";
import { ClientPaymentCenterPage } from "../pages/payment-center/ClientPaymentCenterPage";
import { ClientAddPaymentModalPage } from "../pages/payment-center/ClientAddPaymentModalPage";

export class AddPaymentFlow {
    static async add(page: Page, paymentType: string, component: string) {
        const paymentCenter = new ClientPaymentCenterPage(page);
        if (component === 'PAYMENT') {
            await paymentCenter.navAddPayment();
        } else if (component === 'TEMPLATE') {
            await paymentCenter.navAddTemplate();
        }
        const modal = new ClientAddPaymentModalPage(page);
        await modal.selectPaymentType(paymentType);
    }
}
