
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PatientProfileData } from '@/lib/firebase/service/patients/service';
import { addMedoraHeader, addSectionHeader, addFooter, MEDORA_COLORS } from '@/utils/pdf-utils';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

export const generateIdentificationPDF = async (data: PatientProfileData) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);

  // Add Header
  let y = await addMedoraHeader(
    pdf, 
    'Identification Documents', 
    'Government ID & Verification Records',
    `${data.personalInfo.firstName} ${data.personalInfo.lastName}`
  );

  // Primary ID Card
  pdf.setFillColor(MEDORA_COLORS.background[0], MEDORA_COLORS.background[1], MEDORA_COLORS.background[2]);
  pdf.roundedRect(margin, y, contentWidth, 35, 3, 3, 'F');
  
  pdf.setFontSize(12);
  pdf.setTextColor(MEDORA_COLORS.primary[0], MEDORA_COLORS.primary[1], MEDORA_COLORS.primary[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PRIMARY IDENTIFICATION', margin + 5, y + 7);

  pdf.setFontSize(10);
  pdf.setTextColor(MEDORA_COLORS.text.primary[0], MEDORA_COLORS.text.primary[1], MEDORA_COLORS.text.primary[2]);
  
  // ID details
  const leftCol = margin + 5;
  const rightCol = margin + (contentWidth / 2) + 5;
  const detailY = y + 16;

  // Left column
  pdf.setFont('helvetica', 'bold');
  pdf.text('ID Type:', leftCol, detailY);
  pdf.text('ID Number:', leftCol, detailY + 8);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(data.identification.type?.replace('-', ' ').toUpperCase() || 'Not provided', leftCol + 30, detailY);
  
  // Mask ID number for privacy (show last 4 digits)
  const idNumber = data.identification.number || 'Not provided';
  const maskedNumber = idNumber.length > 4 ? `XXXX${idNumber.slice(-4)}` : idNumber;
  pdf.text(maskedNumber, leftCol + 30, detailY + 8);

  // Right column
  pdf.setFont('helvetica', 'bold');
  pdf.text('Issue Date:', rightCol, detailY);
  pdf.text('Expiry Date:', rightCol, detailY + 8);

  pdf.setFont('helvetica', 'normal');
  pdf.text(data.identification.issueDate ? new Date(data.identification.issueDate).toLocaleDateString() : 'Not provided', rightCol + 30, detailY);
  pdf.text(data.identification.expiryDate ? new Date(data.identification.expiryDate).toLocaleDateString() : 'Not provided', rightCol + 30, detailY + 8);

  y += 45;

  // ID Documents
  if (data.identification.documents && data.identification.documents.length > 0) {
    y = addSectionHeader(pdf, y, 'Uploaded ID Documents', MEDORA_COLORS.success);

    const documentsBody = data.identification.documents.map(doc => [
      doc.type.replace(/-/g, ' ').toUpperCase(),
      doc.number ? `XXXX${doc.number.slice(-4)}` : 'N/A',
      doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'
    ]);

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

    y = (pdf as any).lastAutoTable.finalY + 10;
  }

  // Verification Status
  if (y > 250) {
    pdf.addPage();
    y = margin;
    y = await addMedoraHeader(pdf, 'Identification (Continued)', '', `${data.personalInfo.firstName} ${data.personalInfo.lastName}`);
    y += 20;
  }

  y = addSectionHeader(pdf, y, 'Verification Status', MEDORA_COLORS.warning);

  pdf.setFillColor(232, 245, 233);
  pdf.roundedRect(margin, y, contentWidth, 15, 2, 2, 'F');
  
  pdf.setFontSize(10);
  pdf.setTextColor(MEDORA_COLORS.success[0], MEDORA_COLORS.success[1], MEDORA_COLORS.success[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text('✓ VERIFIED', margin + 5, y + 10);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(MEDORA_COLORS.text.secondary[0], MEDORA_COLORS.text.secondary[1], MEDORA_COLORS.text.secondary[2]);
  pdf.text('Identity documents have been verified in our system.', margin + 35, y + 10);

  y += 25;

  // Security Notice
  pdf.setFillColor(255, 235, 238);
  pdf.roundedRect(margin, y, contentWidth, 20, 2, 2, 'F');
  
  pdf.setFontSize(9);
  pdf.setTextColor(MEDORA_COLORS.error[0], MEDORA_COLORS.error[1], MEDORA_COLORS.error[2]);
  pdf.setFont('helvetica', 'bold');
  pdf.text('SECURITY NOTICE:', margin + 5, y + 7);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(MEDORA_COLORS.text.secondary[0], MEDORA_COLORS.text.secondary[1], MEDORA_COLORS.text.secondary[2]);
  pdf.text('This document contains sensitive personal information.', margin + 35, y + 7);
  pdf.text('Handle with care and store securely.', margin + 5, y + 14);

  const totalPages = pdf.internal.pages.length - 1;
  addFooter(pdf, totalPages);

  const fileName = `Medora_Identification_${data.personalInfo.lastName}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
  
  return fileName;
};