
import { AppError } from '../errors/app.errors';
import PDFDocument from 'pdfkit'
import { IInvoiceData } from '../modules/payment/payment.interface';

// just create buffer
export const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer<ArrayBufferLike>> => {
    try {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({ size: "A4", margin: 50 });
            const buffer: Uint8Array[] = [];

            doc.on("data", (chunk) => buffer.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffer)));
            doc.on('error', (e) => reject(e));

            // pdf content layout
            generateHeader(doc);
            generateCustomerInformation(doc, invoiceData);
            generateInvoiceTable(doc, invoiceData);
            generateFooter(doc);

            doc.end();
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        // eslint-disable-next-line no-console
        console.log(e);
        throw new AppError(401, `pdf creation error ${e.message}`);
    }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateHeader(doc: any) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Tour Management", 50, 57)
        .fontSize(10)
        .text("Tour Management Inc.", 200, 50, { align: "right" })
        .text("123 Tour Street", 200, 65, { align: "right" })
        .text("Cityville, State, 12345", 200, 80, { align: "right" })
        .moveDown();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateCustomerInformation(doc: any, invoice: IInvoiceData) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("INVOICE", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    // Left column - Invoice details
    doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(invoice.transactionId, 50, customerInformationTop + 15)
        
        .font("Helvetica")
        .fontSize(10)
        .text("Invoice Date:", 50, customerInformationTop + 40)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(new Date(invoice.bookingDate).toLocaleDateString(), 50, customerInformationTop + 55);

    // Right column - Billed To
    doc
        .font("Helvetica")
        .fontSize(10)
        .text("Billed To:", 320, customerInformationTop)
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(invoice.userName, 320, customerInformationTop + 15)
        .font("Helvetica");

    doc.moveDown();
    generateHr(doc, 290);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateInvoiceTable(doc: any, invoice: IInvoiceData) {
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Description",
        "Guests",
        "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    const position = invoiceTableTop + 30;

    generateTableRow(
        doc,
        position,
        "Tour Package",
        invoice.tourTitle,
        invoice.guestCount.toString(),
        `$${invoice.totalAmount.toFixed(2)}`
    );

    generateHr(doc, position + 20);

    const subtotalPosition = position + 40;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Grand Total",
        `$${invoice.totalAmount.toFixed(2)}`
    );
    doc.font("Helvetica");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateFooter(doc: any) {
    doc
        .fontSize(10)
        .text(
            "Payment is processed securely. Thank you for your business.",
            50,
            750,
            { align: "center", width: 500 }
        );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateTableRow(doc: any, y: number, item: string, description: string, quantity: string, lineTotal: string) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(description, 150, y, { width: 190, align: "left" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 450, y, { width: 90, align: "right" });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateHr(doc: any, y: number) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}
