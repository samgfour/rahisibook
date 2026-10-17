/* Demo settings. Demo mode (no Supabase keys): data stays in the visitor's browser. */
window.RB_CONFIG = {
  name: "Demo Spa & Salon",
  tagline: "Where beauty comes first",
  city: "Nairobi",
  phone: "+254797405682",
  whatsapp: "254797405682",
  currency: "KES",
  openTimes: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"],
  closedDays: [0],
  services: [
    { name: "Knotless box braids", hours: 5, price: 3500 },
    { name: "Facial", hours: 1, price: 2000 },
    { name: "Massage (60 min)", hours: 1, price: 2500 },
    { name: "Manicure", hours: 1, price: 800 }
  ],
  colors: { main: "#27500a", accent: "#ef9f27", bg: "#fcf8ef" },
  supabaseUrl: "",
  supabaseKey: ""
};
