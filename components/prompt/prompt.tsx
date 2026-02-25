// lib/ai/prompts.ts

export interface FormattedUserData {
  personalInfo: any;
  medicalInfo: any;
  insuranceInfo: any;
  identification: any;
  documentSummary: {
    total: number;
    byType: Record<string, number>;
  };
  accountInfo: {
    email: string;
    username: string;
    onboardingCompleted: boolean;
    onboardingDate: string;
  };
}

export function formatUserDataForPrompt(patientData: any, userData: any): FormattedUserData {
  // Format personal information
  const personalInfo = patientData?.personalInfo ? {
    name: `${patientData.personalInfo.firstName} ${patientData.personalInfo.lastName}`,
    dateOfBirth: patientData.personalInfo.dateOfBirth,
    gender: patientData.personalInfo.gender,
    phone: patientData.personalInfo.phoneNumber,
    emergencyContact: patientData.personalInfo.emergencyContact ? {
      name: patientData.personalInfo.emergencyContact.name,
      relationship: patientData.personalInfo.emergencyContact.relationship,
      phone: patientData.personalInfo.emergencyContact.phoneNumber
    } : null
  } : null;

  // Format medical information
  const medicalInfo = patientData?.medicalInfo ? {
    bloodType: patientData.medicalInfo.bloodType,
    height: patientData.medicalInfo.height,
    weight: patientData.medicalInfo.weight,
    allergies: patientData.medicalInfo.allergies?.length > 0 
      ? patientData.medicalInfo.allergies 
      : ['None reported'],
    currentMedications: patientData.medicalInfo.currentMedications?.map(
      (med: any) => ({
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency
      })
    ) || [],
    chronicConditions: patientData.medicalInfo.chronicConditions?.length > 0
      ? patientData.medicalInfo.chronicConditions
      : ['None'],
    pastSurgeries: patientData.medicalInfo.pastSurgeries?.map(
      (surgery: any) => ({
        name: surgery.name,
        year: surgery.year
      })
    ) || []
  } : null;

  // Format insurance information
  const insuranceInfo = patientData?.insuranceInfo ? {
    provider: patientData.insuranceInfo.providerName,
    policyNumber: patientData.insuranceInfo.policyNumber,
    groupNumber: patientData.insuranceInfo.groupNumber,
    type: patientData.insuranceInfo.insuranceType,
    validUntil: patientData.insuranceInfo.validUntil,
    coverageDetails: patientData.insuranceInfo.coverageDetails
  } : null;

  // Format identification
  const identification = patientData?.identification ? {
    type: patientData.identification.type,
    number: patientData.identification.number,
    issueDate: patientData.identification.issueDate,
    expiryDate: patientData.identification.expiryDate
  } : null;

  // Get document summary
  const documents = patientData?.documents || [];
  const documentSummary = {
    total: documents.length,
    byType: documents.reduce((acc: any, doc: any) => {
      acc[doc.type] = (acc[doc.type] || 0) + 1;
      return acc;
    }, {})
  };

  // Account info
  const accountInfo = {
    email: userData?.email || 'Not available',
    username: userData?.username || 'Not available',
    onboardingCompleted: patientData?.hasCompletedOnboarding || false,
    onboardingDate: patientData?.onboardingCompletedAt || 'Not available'
  };

  return {
    personalInfo,
    medicalInfo,
    insuranceInfo,
    identification,
    documentSummary,
    accountInfo
  };
}

// Detect what type of information the user is requesting
export function detectRequestType(userMessage: string): 'personal' | 'medical' | 'insurance' | 'identification' | 'general' {
  const message = userMessage.toLowerCase();
  
  // Personal info keywords
  if (message.match(/\b(personal|name|age|dob|date of birth|birthday|gender|phone|contact|emergency|address)\b/)) {
    return 'personal';
  }
  
  // Medical info keywords
  if (message.match(/\b(medical|health|allerg|medication|medicine|drug|prescription|surgery|surgical|operation|chronic|condition|blood|height|weight|bmi|lab|test|report)\b/)) {
    return 'medical';
  }
  
  // Insurance keywords
  if (message.match(/\b(insurance|policy|coverage|provider|insurer|claim|premium|deductible|network)\b/)) {
    return 'insurance';
  }
  
  // Identification keywords
  if (message.match(/\b(id|identification|aadhaar|pan|passport|license|driving|voter|identity)\b/)) {
    return 'identification';
  }
  
  return 'general';
}

// Create the main system prompt with formatting instructions
export function createSystemPrompt(formattedData: FormattedUserData, requestType: string = 'general'): string {
  
  const baseData = `📋 **USER'S COMPLETE PROFILE:**

--- PERSONAL INFORMATION ---
${JSON.stringify(formattedData.personalInfo, null, 2)}

--- MEDICAL HISTORY ---
${JSON.stringify(formattedData.medicalInfo, null, 2)}

--- INSURANCE DETAILS ---
${JSON.stringify(formattedData.insuranceInfo, null, 2)}

--- IDENTIFICATION ---
${JSON.stringify(formattedData.identification, null, 2)}

--- DOCUMENTS SUMMARY ---
Total documents: ${formattedData.documentSummary.total}
Document types: ${JSON.stringify(formattedData.documentSummary.byType, null, 2)}`;

  // Personal Information Format
  if (requestType === 'personal') {
    return `You are MedoraAI, a helpful medical assistant. The user is asking for their PERSONAL INFORMATION.

${baseData}

🎯 **RESPONSE FORMAT INSTRUCTIONS:**
Format your response EXACTLY like this template, matching the structure of our PDF generator:

# 👤 Personal Information

## 📝 Basic Details
- **Full Name**: [value]
- **Date of Birth**: [value]
- **Gender**: [value]  
- **Phone Number**: [value]

## 🆘 Emergency Contact
- **Name**: [value]
- **Relationship**: [value]  
- **Phone**: [value]

## 📎 Personal Documents
[List any personal documents the user has uploaded]

---
📥 **DOWNLOAD OPTION:** A complete PDF with all personal information is available. Click the download button below.

CRITICAL RULES:
1. ONLY use the provided data
2. If information is missing, show "Not provided"
3. Keep the exact structure above
4. Add emojis for visual appeal
5. End with the download prompt`;
  }

  // Medical Information Format
  if (requestType === 'medical') {
    return `You are MedoraAI, a helpful medical assistant. The user is asking for their MEDICAL INFORMATION.

${baseData}

🎯 **RESPONSE FORMAT INSTRUCTIONS:**
Format your response EXACTLY like this template, matching the structure of our PDF generator:

# 🏥 Medical Information

## 📊 Vital Signs
- **Blood Type**: [value]
- **Height**: [value] cm
- **Weight**: [value] kg
- **BMI**: [calculated if height and weight available]

## ⚠️ Allergies
[List allergies or "No known allergies"]

## 💊 Current Medications
| Medication | Dosage | Frequency |
|------------|--------|-----------|
| [name] | [dosage] | [frequency] |

## 🔄 Chronic Conditions
[List conditions or "None reported"]

## 🏨 Past Surgeries
| Procedure | Year |
|-----------|------|
| [name] | [year] |

## 📄 Medical Documents
[List uploaded medical documents]

---
📥 **DOWNLOAD OPTION:** A complete PDF with all medical information is available. Click the download button below.

CRITICAL RULES:
1. ONLY use the provided data
2. Create a table for medications if any exist
3. Create a table for surgeries if any exist
4. If no data, show appropriate message
5. End with the download prompt`;
  }

  // Insurance Information Format
  if (requestType === 'insurance') {
    return `You are MedoraAI, a helpful medical assistant. The user is asking for their INSURANCE INFORMATION.

${baseData}

🎯 **RESPONSE FORMAT INSTRUCTIONS:**
Format your response EXACTLY like this template, matching the structure of our PDF generator:

# 🛡️ Insurance Information

## 📋 Policy Details
- **Provider**: [value]
- **Policy Number**: [value]
- **Group Number**: [value]
- **Insurance Type**: [value]
- **Valid Until**: [value]

## 📝 Coverage Summary
[coverage details]

## 📄 Insurance Documents
[List uploaded insurance documents]

---
📥 **DOWNLOAD OPTION:** A complete PDF with all insurance information is available. Click the download button below.

CRITICAL RULES:
1. ONLY use the provided data
2. Format dates properly
3. Keep coverage summary concise
4. End with the download prompt`;
  }

  // Identification Format
  if (requestType === 'identification') {
    return `You are MedoraAI, a helpful medical assistant. The user is asking for their IDENTIFICATION DOCUMENTS.

${baseData}

🎯 **RESPONSE FORMAT INSTRUCTIONS:**
Format your response EXACTLY like this template, matching the structure of our PDF generator:

# 🆔 Identification Documents

## 🔑 Primary ID
- **ID Type**: [value]
- **ID Number**: [value]
- **Issue Date**: [value]
- **Expiry Date**: [value]

## 📄 ID Documents
[List uploaded identification documents]

## ✅ Verification Status
- **Status**: Verified/Not Verified

---
📥 **DOWNLOAD OPTION:** A complete PDF with all identification information is available. Click the download button below.

CRITICAL RULES:
1. ONLY use the provided data
2. Mask sensitive numbers if needed (show last 4 digits)
3. Show expiry status
4. End with the download prompt`;
  }

  // General format for other queries
  return `You are MedoraAI, a helpful medical assistant. You have access to this user's medical data.

${baseData}

🎯 **GENERAL RESPONSE GUIDELINES:**
- Be concise and helpful
- Use markdown formatting with emojis
- For specific information requests, offer to provide detailed PDFs
- Always include a disclaimer for medical advice

CRITICAL RULES:
1. ONLY use the provided user data
2. Never invent information
3. Be clear about what information is available
4. Include medical disclaimer when relevant

Remember: You're helping users understand their own medical data. Be helpful but cautious.`;
}