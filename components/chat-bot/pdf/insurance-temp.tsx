
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PatientProfileData } from '@/lib/firebase/service/patients/service';
import { addMedoraHeader, addSectionHeader, addFooter, MEDORA_COLORS } from '@/utils/pdf-utils';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

export const generateInsuranceInfoPDF = async (data: PatientProfileData) => {
  // Create new PDF document
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);

  // Add Header (await since it's async now)
  let y = await addMedoraHeader(
    pdf, 
    'Insurance Information', 
    'Coverage Details & Policy Documents',
    `${data.personalInfo.firstName} ${data.personalInfo.lastName}`
  );

  // Insurance Provider Card
  pdf.setFillColor(MEDORA_COLORS.background[0], MEDORA_COLORS.background[1], MEDORA_COLORS.background[2]);
  pdf.roundedRect(margin, y, contentWidth, 45, 3, 3, 'F');
  
  pdf.setFontSize(12);
  pdf.setTextColor(MEDORA_COLORS.primary[0], MEDORA_COLORS.primary[1], MEDORA_COLORS.primary[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INSURANCE PROVIDER', margin + 5, y + 7);

  pdf.setFontSize(10);
  pdf.setTextColor(MEDORA_COLORS.text.primary[0], MEDORA_COLORS.text.primary[1], MEDORA_COLORS.text.primary[2]);
  
  // Two column layout
  const leftCol = margin + 5;
  const rightCol = margin + (contentWidth / 2) + 5;
  const detailY = y + 16;

  // Left column
  pdf.setFont('helvetica', 'bold');
  pdf.text('Provider:', leftCol, detailY);
  pdf.text('Policy Number:', leftCol, detailY + 8);
  pdf.text('Group Number:', leftCol, detailY + 16);
  pdf.text('Insurance Type:', leftCol, detailY + 24);

  pdf.setFont('helvetica', 'normal');
  pdf.text(data.insuranceInfo.providerName || 'Not provided', leftCol + 30, detailY);
  pdf.text(data.insuranceInfo.policyNumber || 'Not provided', leftCol + 30, detailY + 8);
  pdf.text(data.insuranceInfo.groupNumber || 'Not provided', leftCol + 30, detailY + 16);
  
  const insuranceType = data.insuranceInfo.insuranceType?.replace('-', ' ').toUpperCase() || 'Not specified';
  pdf.text(insuranceType, leftCol + 30, detailY + 24);

  // Right column
  pdf.setFont('helvetica', 'bold');
  pdf.text('Valid Until:', rightCol, detailY);
  pdf.text('Coverage:', rightCol, detailY + 8);

  pdf.setFont('helvetica', 'normal');
  
  // Format date
  const validUntil = data.insuranceInfo.validUntil 
    ? new Date(data.insuranceInfo.validUntil).toLocaleDateString() 
    : 'Not specified';
  pdf.text(validUntil, rightCol + 30, detailY);
  
  // Coverage details with word wrap
  const coverageText = data.insuranceInfo.coverageDetails || 'Standard coverage';
  const coverageLines = pdf.splitTextToSize(coverageText, 70);
  pdf.text(coverageLines, rightCol + 30, detailY + 8);

  y += 55;

  // Insurance Documents
  if (data.insuranceInfo.documents && data.insuranceInfo.documents.length > 0) {
    y = addSectionHeader(pdf, y, 'Insurance Documents', MEDORA_COLORS.success);

    const documentsBody = data.insuranceInfo.documents.map(doc => [
      doc.type.replace(/-/g, ' ').toUpperCase(),
      doc.number || 'N/A',
      doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'
    ]);

    // Use autoTable with proper initialization
    autoTable(pdf, {
      startY: y,
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
      head: [['Document Type', 'Document Number', 'Uploaded Date']],
      body: documentsBody,
      headStyles: { fillColor: MEDORA_COLORS.success, textColor: 255, fontSize: 9 },
      bodyStyles: { fontSize: 8 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Get the final Y position after the table
    y = (pdf as any).lastAutoTable.finalY + 10;
  }

  // Coverage Summary
  if (y > 250) {
    pdf.addPage();
    y = margin;
    // On new page, add header again but with await
    y = await addMedoraHeader(pdf, 'Insurance Information (Continued)', '', `${data.personalInfo.firstName} ${data.personalInfo.lastName}`);
    y += 20;
  }

  y = addSectionHeader(pdf, y, 'Coverage Summary', MEDORA_COLORS.warning);

  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
  
  pdf.setFontSize(9);
  pdf.setTextColor(MEDORA_COLORS.text.primary[0], MEDORA_COLORS.text.primary[1], MEDORA_COLORS.text.primary[2]);
  
  const summaryText = data.insuranceInfo.coverageDetails || 'Standard insurance coverage applies as per policy terms and conditions.';
  const summaryLines = pdf.splitTextToSize(summaryText, contentWidth - 10);
  pdf.text(summaryLines, margin + 5, y + 7);

  y += 30;

  // Important Notes
  pdf.setFillColor(255, 243, 224);
  pdf.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
  
  pdf.setFontSize(9);
  pdf.setTextColor(MEDORA_COLORS.warning[0], MEDORA_COLORS.warning[1], MEDORA_COLORS.warning[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text('IMPORTANT:', margin + 5, y + 7);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(MEDORA_COLORS.text.secondary[0], MEDORA_COLORS.text.secondary[1], MEDORA_COLORS.text.secondary[2]);
  pdf.text('Please verify coverage details with your insurance provider.', margin + 25, y + 7);
  pdf.text('Keep your insurance card and documents readily accessible.', margin + 5, y + 14);

  // Get total pages
  const totalPages = pdf.internal.pages.length - 1;
  addFooter(pdf, totalPages);

  // Save the PDF
  const fileName = `Medora_Insurance_${data.personalInfo.lastName}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
  
  return fileName;
};