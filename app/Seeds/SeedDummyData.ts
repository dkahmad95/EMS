"use client";

export const seedDummyData = () => {
  // ----- Governorates -----
  const governorates = [
    { id: 1765178613266, name: "جبل لبنان" },
    { id: 1765178614000, name: "بيروت" },
    { id: 1765178615000, name: "الشمال" },
    { id: 1765178616000, name: "الجنوب" },
  ];

  localStorage.setItem("governorates", JSON.stringify(governorates));
  // ----- Districts -----
  const districts = [
    {
      id: 1765179248637,
      name: "بعبدا",
      parentId: 1765178613266, // جبل لبنان
    },
    {
      id: 1765179249000,
      name: "بيروت",
      parentId: 1765178614000, // بيروت
    },
    {
      id: 1765179249100,
      name: "طرابلس",
      parentId: 1765178615000, // الشمال
    },
    {
      id: 1765179249200,
      name: "صيدا",
      parentId: 1765178616000, // الجنوب
    },
  ];

  localStorage.setItem("districts", JSON.stringify(districts));

  // ----- Cities -----
  const cities = [
    {
      id: 1762929247910,
      name: "بيروت",
      parentId: 1765179249000, // بيروت district
    },
    {
      id: 1762929247911,
      name: "طرابلس",
      parentId: 1765179249100, // طرابلس district
    },
    {
      id: 1762929247912,
      name: "صيدا",
      parentId: 1765179249200, // صيدا district
    },
    {
      id: 1765183727192,
      name: "boroj",
      parentId: 1765179248637, // بعبدا district
    },
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
    {
      id: 1762928590386,
      name: "Admin",
      permissions: ["add_employee", "view_reports"],
    },
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
      address: "بيروت",
      detailedAddress: "بناية الهدى، الطابق الثالث، قرب مسجد الغفران",
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
      address: "صيدا",
      detailedAddress: "بناية الريحان، الطابق الأول، مقابل مركز البريد",
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
      address: "الدكوانة",
      detailedAddress: "عمارة الزهراء، الطابق الثالث، بجانب سوبرماركت الريف",
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
  // ----- Users (New) -----
  const users = [
    {
      id: 1,
      name: "أحمد دقماق",
      phoneNumber: "78940697",
      city: "بيروت",
      office: "بيروت",
      permissionGroup: "Admin",
      joinDate: "2025-01-10",
    },
    {
      id: 2,
      name: "سارة علي",
      phoneNumber: "71234567",
      office: "طرابلس",
      permissionGroup: "User",
      joinDate: "2025-02-15",
    },
    {
      id: 3,
      name: "محمد حسن",
      phoneNumber: "71234568",
      office: "صيدا",
      permissionGroup: "Admin",
      joinDate: "2025-03-20",
    },
    {
      id: 4,
      name: "ليلى خوري",
      phoneNumber: "71234569",
      office: "بيروت",
      permissionGroup: "User",
      joinDate: "2025-04-10",
    },
    {
      id: 5,
      name: "جورج نصر",
      phoneNumber: "71234570",
      office: "طرابلس",
      permissionGroup: "User",
      joinDate: "2025-05-05",
    },
  ];

  localStorage.setItem("users", JSON.stringify(users));

  alert("تم إدخال جميع البيانات التجريبية في localStorage بنجاح!");
};
