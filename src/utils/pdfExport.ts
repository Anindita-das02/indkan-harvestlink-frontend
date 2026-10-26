import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type EnquiryItemForPDF = {
  id: number;
  reference_id: string;
  secret_pin?: string;
  buyer_name: string;
  company_name: string;
  buyer_type: string;
  email: string;
  phone: string;
  country: string;
  destination_port: string;
  delivery_address: string;
  tax_id: string;
  business_website?: string;
  status: string;
  status_label?: string;
  admin_notes?: string;
  created_at: string;
  items?: Array<{
    id?: number;
    product_name?: string;
    product_code?: string;
    quantity: number;
    unit: string;
    packaging_requested?: string;
  }>;
};

// Colors matching INDKAN branding
const COLOR_PRIMARY = [32, 59, 44] as [number, number, number]; // Forest Green
const COLOR_GOLD = [201, 164, 81] as [number, number, number]; // Harvest Gold
const COLOR_DARK = [33, 43, 37] as [number, number, number]; // Slate Dark
const COLOR_MUTED = [100, 116, 139] as [number, number, number]; // Slate Muted
const COLOR_LIGHT = [250, 249, 245] as [number, number, number]; // Warm Cream

/**
 * Format status label cleanly
 */
function getStatusDisplay(status: string, label?: string): string {
  if (label) return label.toUpperCase();
  return status.replace(/_/g, " ").toUpperCase();
}

/**
 * Exports a single enquiry to a high-quality, professional PDF document
 */
export function exportSingleEnquiryPDF(enq: EnquiryItemForPDF) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  let currentY = 16;

  // 1. BRAND HEADER BANNER
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 28, "F");

  // Gold accent strip
  doc.setFillColor(...COLOR_GOLD);
  doc.rect(0, 28, pageWidth, 2, "F");

  // Brand Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("INDKAN HARVESTLINK", margin, 13);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(209, 221, 213);
  doc.text("Agricultural Commodities Export Trade Desk • APEDA & Global Standards", margin, 19);

  // Document Type Header (Right aligned)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_GOLD);
  doc.text("COMMERCIAL ENQUIRY DOSSIER", pageWidth - margin, 13, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(220, 230, 225);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-GB")}`, pageWidth - margin, 19, {
    align: "right",
  });

  currentY = 36;

  // 2. ENQUIRY OVERVIEW BOX
  doc.setFillColor(...COLOR_LIGHT);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, pageWidth - margin * 2, 24, 2, 2, "FD");

  // Left side: Reference ID & Secret PIN
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("ENQUIRY REFERENCE ID", margin + 5, currentY + 7);

  doc.setFontSize(14);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text(enq.reference_id, margin + 5, currentY + 15);

  if (enq.secret_pin) {
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_MUTED);
    doc.text(`Security PIN: ${enq.secret_pin}`, margin + 5, currentY + 20);
  }

  // Right side: Status & Date
  const rightColX = pageWidth - margin - 5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...COLOR_MUTED);
  doc.text("CURRENT STAGE & STATUS", rightColX, currentY + 7, { align: "right" });

  const statusText = getStatusDisplay(enq.status, enq.status_label);
  doc.setFontSize(13);
  doc.setTextColor(...COLOR_GOLD);
  doc.text(`● ${statusText}`, rightColX, currentY + 15, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(`Submitted On: ${enq.created_at}`, rightColX, currentY + 20, { align: "right" });

  currentY += 30;

  // 3. BUYER & ENTITY INFORMATION TABLE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("1. BUYER & TRADE ENTITY DETAILS", margin, currentY);
  currentY += 3;

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLOR_DARK,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 42, fillColor: [248, 249, 250] },
      1: { cellWidth: 50 },
      2: { fontStyle: "bold", cellWidth: 42, fillColor: [248, 249, 250] },
      3: { cellWidth: 48 },
    },
    body: [
      ["Buyer Name", enq.buyer_name, "Company / Entity", enq.company_name || "N/A"],
      ["Buyer Classification", enq.buyer_type ? enq.buyer_type.toUpperCase() : "WHOLESALER", "Tax ID / Registration", enq.tax_id || "Pending KYC"],
      ["Email Address", enq.email, "Phone / Mobile", enq.phone],
      ["Country of Origin", enq.country || "India", "Destination Discharge Port", enq.destination_port || "To be confirmed"],
      ["Delivery Address", { content: enq.delivery_address || "Standard CIF/FOB Delivery Terms", colSpan: 3 }],
    ],
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // 4. REQUESTED COMMODITIES & VOLUMES TABLE
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("2. REQUESTED COMMODITY SPECIFICATIONS", margin, currentY);
  currentY += 3;

  const commodityRows =
    enq.items && enq.items.length > 0
      ? enq.items.map((item, idx) => [
          idx + 1,
          item.product_name || "Agri Commodity",
          item.product_code || "IK-AGRI-001",
          `${item.quantity} ${item.unit}`,
          item.packaging_requested || "25 kg / 50 kg Export Bags",
        ])
      : [
          [
            1,
            "Agricultural Bulk Commodity",
            "IK-GEN-001",
            "Bulk Container Consignment",
            "Export Woven Bags",
          ],
        ];

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: "striped",
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 9,
      textColor: COLOR_DARK,
    },
    columnStyles: {
      0: { cellWidth: 12, halign: "center" },
      1: { cellWidth: 60, fontStyle: "bold" },
      2: { cellWidth: 32 },
      3: { cellWidth: 36, fontStyle: "bold", textColor: COLOR_PRIMARY },
      4: { cellWidth: 42 },
    },
    head: [["#", "Commodity Name", "Product Code", "Requested Quantity", "Packaging Option"]],
    body: commodityRows,
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // 5. COMMERCIAL EXPORT TERMS & ADMIN NOTES
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_PRIMARY);
  doc.text("3. TRADE AUDIT & DISPATCH STAGES", margin, currentY);
  currentY += 3;

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: COLOR_PRIMARY,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: COLOR_DARK,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 45, fillColor: [248, 249, 250] },
      1: { cellWidth: 137 },
    },
    body: [
      ["Standard Incoterms", "FOB (Free on Board) / CIF (Cost, Insurance & Freight) from JNPT Mumbai or Mundra Port."],
      ["Shipment Verification", "Subject to Phytosanitary Inspection, SGS/Lab Certificate of Analysis, and container moisture safety."],
      [
        "Admin Notes & Status",
        enq.admin_notes
          ? enq.admin_notes
          : "Enquiry officially verified under INDKAN Export Trade Desk protocols. Quotation and cargo space allocation in progress.",
      ],
    ],
  });

  // 6. OFFICIAL FOOTER
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setDrawColor(201, 164, 81);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLOR_MUTED);
  doc.text(
    "INDKAN HarvestLink • Export Trade Desk • support@indkan.com • Official B2B Trade Record",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  doc.text(
    `Page 1 of 1 • Ref: ${enq.reference_id}`,
    pageWidth - margin,
    pageHeight - 10,
    { align: "right" }
  );

  // Trigger browser download
  doc.save(`INDKAN-Enquiry-${enq.reference_id}.pdf`);
}

/**
 * Exports multiple selected enquiries to a consolidated batch PDF report
 */
export function exportMultipleEnquiriesPDF(enquiriesList: EnquiryItemForPDF[]) {
  if (!enquiriesList || enquiriesList.length === 0) return;

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 16;

  // 1. HEADER BANNER
  doc.setFillColor(...COLOR_PRIMARY);
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setFillColor(...COLOR_GOLD);
  doc.rect(0, 28, pageWidth, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("INDKAN HARVESTLINK", margin, 13);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(209, 221, 213);
  doc.text("Consolidated Export Quotations & Enquiries Batch Master Report", margin, 19);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...COLOR_GOLD);
  doc.text(`TOTAL ENQUIRIES: ${enquiriesList.length}`, pageWidth - margin, 13, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(220, 230, 225);
  doc.text(`Generated: ${new Date().toLocaleString("en-GB")}`, pageWidth - margin, 19, {
    align: "right",
  });

  currentY = 38;

  // 2. SUMMARY TABLE
  const tableRows = enquiriesList.map((enq, idx) => {
    const productsSummary =
      enq.items && enq.items.length > 0
        ? enq.items.map((i) => `${i.product_name || "Agri Product"} (${i.quantity} ${i.unit})`).join("; ")
        : "General Agricultural Bulk";

    return [
      idx + 1,
      enq.reference_id,
      enq.buyer_name,
      enq.company_name || "—",
      enq.country || "India",
      enq.destination_port || "—",
      productsSummary,
      getStatusDisplay(enq.status, enq.status_label),
      enq.created_at,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    theme: "grid",
    headStyles: {
      fillColor: COLOR_PRIMARY,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: COLOR_DARK,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 28, fontStyle: "bold", textColor: COLOR_GOLD },
      2: { cellWidth: 32, fontStyle: "bold" },
      3: { cellWidth: 32 },
      4: { cellWidth: 20 },
      5: { cellWidth: 26 },
      6: { cellWidth: 62 },
      7: { cellWidth: 32, fontStyle: "bold", halign: "center" },
      8: { cellWidth: 27, fontSize: 7.5 },
    },
    head: [
      [
        "#",
        "Ref ID",
        "Buyer Name",
        "Company / Entity",
        "Country",
        "Port",
        "Commodities & Volume",
        "Current Stage",
        "Date",
      ],
    ],
    body: tableRows,
    didDrawPage: (data) => {
      // Header/Footer on each page
      doc.setDrawColor(201, 164, 81);
      doc.setLineWidth(0.4);
      doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...COLOR_MUTED);
      doc.text(
        "INDKAN HarvestLink • Internal Export Trade Desk Registry • Confidential",
        margin,
        pageHeight - 7
      );

      doc.text(
        `Page ${data.pageNumber}`,
        pageWidth - margin,
        pageHeight - 7,
        { align: "right" }
      );
    },
  });

  // Trigger browser download
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`INDKAN-Enquiries-Batch-${dateStr}.pdf`);
}
