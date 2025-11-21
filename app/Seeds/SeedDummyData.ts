"use client";

export const seedDummyData = () => {
  // ----- Cities -----
  const cities = [
    { id: 1762929247910, name: "بيروت" },
    { id: 1762929247911, name: "طرابلس" },
    { id: 1762929247912, name: "صيدا" },
  ];
  localStorage.setItem("cities", JSON.stringify(cities));

  // ----- Currencies -----
  const currencies = [
    { id: 1762928101741, name: "LBP" },
    { id: 1762928101742, name: "USD" },
    { id: 1762928101743, name: "EUR" },
  ];
  localStorage.setItem("currencies", JSON.stringify(currencies));

  // ----- Destinations -----
  const destinations = [
    { id: 1763620360966, name: "تكفل" },
    { id: 1763620366742, name: "صدقة" },
    { id: 1763620371725, name: "حصالة" },
  ];
  localStorage.setItem("destinations", JSON.stringify(destinations));

  // ----- Education Levels -----
  const educationLevels = ["ابتدائي", "ثانوي", "جامعي"];
  localStorage.setItem("educationLevels", JSON.stringify(educationLevels));

  // ----- Job Titles -----
  const jobTitles = ["محاسب", "مدير", "موظف"];
  localStorage.setItem("jobTitles", JSON.stringify(jobTitles));

  // ----- Offices -----
  const offices = [
    { name: "بيروت", city: "بيروت" },
    { name: "طرابلس", city: "طرابلس" },
    { name: "صيدا", city: "صيدا" },
  ];
  localStorage.setItem("offices", JSON.stringify(offices));

  // ----- Permissions Groups -----
  const permissionGroups = [
    { id: 1762928590386, name: "Admin", permissions: ["add_employee", "view_reports"] },
    { id: 1762928590387, name: "User", permissions: ["read"] },
  ];
  localStorage.setItem("permissionGroups", JSON.stringify(permissionGroups));

  // ----- Permissions -----
  const permissions = ["read", "write", "delete"];
  localStorage.setItem("permissions", JSON.stringify(permissions));

  // ----- Employees -----
  const employees = [
    {
      id: 1762931050429,
      fileNumber: "3",
      name: "احمد دقماق",
      phoneNumbers: "78940697",
      email: "ahmad@example.com",
      jobTitle: "محاسب",
      officeLocation: "بيروت",
      educationLevel: "جامعي",
      permissionGroup: "Admin",
      salary: "1500",
      contractType: "متعاقد",
      insuranceStatus: "نعم",
      gender: "ذكر",
      familyStatus: "متزوج",
      birthDate: "1990-05-07",
      notes: "موظف جديد",
      birthPlace: "بيروت",
      age: "35",
      bloodType: "A+",
      address: "بيروت وسط المدينة",
      childrenCount: "2",
    },
    {
      id: 1762932134824,
      fileNumber: "5",
      name: "سارة علي",
      phoneNumbers: "71234567",
      email: "sarah@example.com",
      jobTitle: "موظف",
      officeLocation: "طرابلس",
      educationLevel: "ثانوي",
      permissionGroup: "User",
      salary: "1000",
      contractType: "متفرغ",
      insuranceStatus: "نعم",
      gender: "أنثى",
      familyStatus: "أعزب",
      birthDate: "1995-11-01",
      notes: "موظف تجريبي",
      birthPlace: "طرابلس",
      age: "28",
      bloodType: "O+",
      address: "طرابلس وسط المدينة",
      childrenCount: "0",
    },
    {
      id: 1762932134825,
      fileNumber: "6",
      name: "محمد حسن",
      phoneNumbers: "71234568",
      email: "mohamed@example.com",
      jobTitle: "مدير",
      officeLocation: "صيدا",
      educationLevel: "جامعي",
      permissionGroup: "Admin",
      salary: "2000",
      contractType: "متعاقد",
      insuranceStatus: "نعم",
      gender: "ذكر",
      familyStatus: "متزوج",
      birthDate: "1985-03-15",
      notes: "مدير الفرع",
      birthPlace: "صيدا",
      age: "40",
      bloodType: "B+",
      address: "صيدا وسط المدينة",
      childrenCount: "3",
    },
  ];
  localStorage.setItem("employees", JSON.stringify(employees));

  // ----- Revenues (20 entries) -----
  const revenues: any[] = [];
  for (let i = 1; i <= 20; i++) {
    const employeeName = employees[i % employees.length].name;
    const office = offices[i % offices.length].name;
    const destination = destinations[i % destinations.length].name;
    const currency = currencies[i % currencies.length].name;
    const date = `2025-11-${String(i).padStart(2, "0")}`;
    const revenueAmount = Math.floor(Math.random() * 100000);
    const notes = `ملاحظة الإيراد ${i}`;

    revenues.push({
      id: Date.now() + i,
      employeeName,
      office,
      destination,
      currency,
      date,
      revenueAmount,
      notes,
    });
  }
  localStorage.setItem("revenues", JSON.stringify(revenues));

  alert("تم إدخال جميع البيانات التجريبية في localStorage بنجاح!");
};
