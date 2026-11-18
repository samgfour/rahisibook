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
    { category: "Hair",  type: "Braids",  name: "Knotless box braids", hours: 5,   price: 3500 },
    { category: "Hair",  type: "Braids",  name: "Cornrows",            hours: 2,   price: 1500 },
    { category: "Face",  type: "Facials", name: "Classic Facial",      hours: 1,   price: 2000 },
    { category: "Face",  type: "Facials", name: "Hydra Clay Mask",     hours: 0.5, price: 1200 },
    { category: "Body",  type: "Massage", name: "Massage (60 min)",    hours: 1,   price: 2500 },
    { category: "Hands", type: "Nails",   name: "Manicure",            hours: 1,   price: 800 }
  ],
  bookAheadDays: 60,
  payNote: "Payment is collected at the spa during your visit.",
  colors: { main: "#27500a", accent: "#ef9f27", bg: "#fcf8ef" },
  supabaseUrl: "",
  supabaseKey: ""
};
