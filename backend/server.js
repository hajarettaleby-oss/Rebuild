const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = "rebuild_btp_morocco_2026_secret";

app.use(cors({ origin: "*" }));
app.use(express.json());
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, uuidv4() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ═══════════════════════════════════════════════════════════════
// SEED DATA — REAL MOROCCAN BTP MARKET PRICES (MAD, 2025-2026)
// ═══════════════════════════════════════════════════════════════
let users = [
  { id:"u1", fullName:"Karim Bakkali", email:"karim@btp.ma", phone:"+212612345678", password:bcrypt.hashSync("demo1234",10), city:"Casablanca", neighborhood:"Hay Hassani", companyName:"BTP Bakkali & Associés", businessType:"General contractor", ice:"001234567000058", yearsInBusiness:8, accountTypes:["sell","buy","rent"], isVerified:true, rating:4.6, ratingCount:31, totalTransactions:31, bio:"Specialized in residential & commercial BTP projects. 8 years in Casablanca region.", createdAt:new Date("2025-01-15") },
  { id:"u2", fullName:"Mohamed Benali", email:"benali@btpma.ma", phone:"+212661234567", password:bcrypt.hashSync("demo1234",10), city:"Rabat", neighborhood:"Hay Riad", companyName:"Benali Construction SARL", businessType:"Real estate developer", ice:"009876543000012", yearsInBusiness:14, accountTypes:["sell","buy"], isVerified:true, rating:4.8, ratingCount:47, totalTransactions:47, bio:"Real estate developer. Projects across Rabat, Salé and Kénitra. FNBTP certified.", createdAt:new Date("2024-06-10") },
  { id:"u3", fullName:"Youssef Amrani", email:"amrani@carrelage.ma", phone:"+212655432100", password:bcrypt.hashSync("demo1234",10), city:"Marrakech", neighborhood:"Guéliz", companyName:"Amrani Tiles & Carrelage", businessType:"Tiling specialist", ice:"007654321000034", yearsInBusiness:11, accountTypes:["sell","rent"], isVerified:true, rating:4.9, ratingCount:62, totalTransactions:62, bio:"Specialist in Zellige, imported tiles and floor coverings. Official supplier for 3 hotel chains.", createdAt:new Date("2024-11-20") },
  { id:"u4", fullName:"Fatima Zahra Idrissi", email:"fatima@gmail.com", phone:"+212698765432", password:bcrypt.hashSync("demo1234",10), city:"Casablanca", neighborhood:"Ain Diab", companyName:null, businessType:"Individual homeowner", ice:null, yearsInBusiness:null, accountTypes:["buy"], isVerified:false, rating:4.9, ratingCount:5, totalTransactions:5, bio:"Doing home renovation project.", createdAt:new Date("2025-09-01") },
  { id:"u5", fullName:"Hassan Tazi", email:"tazi@bois.ma", phone:"+212677891234", password:bcrypt.hashSync("demo1234",10), city:"Fès", neighborhood:"Fès Médina", companyName:"Tazi Bois & Menuiserie", businessType:"Carpentry & wood specialist", ice:"003456789000091", yearsInBusiness:19, accountTypes:["sell","rent"], isVerified:true, rating:4.7, ratingCount:28, totalTransactions:28, bio:"Wood and timber supplier. Forest-certified materials. 19 years in Fès and Meknès.", createdAt:new Date("2024-03-05") },
];

// REAL MOROCCAN BTP MARKET PRICES (MAD, sourced from Batiprix MA, local suppliers 2025)
let listings = [
  // ── TILES & ZELLIGE ──────────────────────────────────────────
  { id:"l1", sellerId:"u3", type:"sale", category:"tiles", title:"Zellige artisanal blanc 10×10 cm — 45 m²", description:"Zellige authentique fabriqué à Fès. Coloris blanc cassé ivoire. Issu d'un chantier d'hôtel terminé. Toutes les boîtes intactes, stockage couvert. Prix marché neuf: 280 MAD/m². Idéal salles de bain, cuisines, riads.", quantity:"45 m²", unitPrice:145, totalPrice:6525, condition:"New, unused", city:"Marrakech", neighborhood:"Guéliz", images:[], available:true, views:89, createdAt:new Date("2026-03-10") },
  { id:"l2", sellerId:"u3", type:"sale", category:"tiles", title:"Carrelage grès cérame 60×60 gris anthracite — 120 m²", description:"Carrelage rectifié grès cérame pleine masse. Format 60×60. Coloris gris anthracite. Épaisseur 10mm. Surplus chantier bureaux Casablanca. R9 antidérapant. Prix usine 95 MAD/m², vendu 60 MAD/m².", quantity:"120 m²", unitPrice:60, totalPrice:7200, condition:"New, unused", city:"Casablanca", neighborhood:"Sidi Maarouf", images:[], available:true, views:134, createdAt:new Date("2026-03-14") },
  { id:"l3", sellerId:"u1", type:"sale", category:"tiles", title:"Faïence murale blanc brillant 25×40 — 60 m²", description:"Faïence murale standard. Très bon état, palette non ouverte. Surplus appartements Hay Hassani. Marque Sonasid Céramique. Prix normal 55 MAD/m².", quantity:"60 m²", unitPrice:28, totalPrice:1680, condition:"New, unused", city:"Casablanca", neighborhood:"Hay Hassani", images:[], available:true, views:67, createdAt:new Date("2026-03-20") },

  // ── CEMENT & CONCRETE ────────────────────────────────────────
  { id:"l4", sellerId:"u2", type:"sale", category:"cement", title:"Ciment Portland CEM I 42.5 Lafarge — 80 sacs 50kg", description:"Ciment Lafarge CEM I 42.5 N. 80 sacs de 50 kg. Stockés en entrepôt couvert, date de fabrication mars 2026, DLC juin 2026. Parfait état. Prix marché: 105–115 MAD/sac.", quantity:"80 sacs (4 000 kg)", unitPrice:72, totalPrice:5760, condition:"New, unused", city:"Rabat", neighborhood:"Hay Riad", images:[], available:true, views:201, createdAt:new Date("2026-03-08") },
  { id:"l5", sellerId:"u1", type:"sale", category:"cement", title:"Sable 0/4 lavé — 15 m³ livraison incluse Casablanca", description:"Sable de rivière lavé, granulométrie 0/4. 15 m³. Idéal pour mortier et enduit. Livraison possible dans un rayon de 20 km autour de Casablanca. Prix marché: 180–220 MAD/m³.", quantity:"15 m³", unitPrice:140, totalPrice:2100, condition:"Good condition", city:"Casablanca", neighborhood:"Sidi Bernoussi", images:[], available:true, views:88, createdAt:new Date("2026-03-22") },
  { id:"l6", sellerId:"u2", type:"sale", category:"cement", title:"Gravier 8/15 concassé — 20 m³", description:"Gravier concassé 8/15 pour béton. 20 m³ disponibles immédiatement. Carrière de Benslimane. Certificat de conformité disponible. Prix marché: 200–240 MAD/m³.", quantity:"20 m³", unitPrice:165, totalPrice:3300, condition:"Good condition", city:"Rabat", neighborhood:"Temara", images:[], available:true, views:112, createdAt:new Date("2026-03-18") },

  // ── BRICKS & BLOCKS ──────────────────────────────────────────
  { id:"l7", sellerId:"u2", type:"sale", category:"bricks", title:"Brique creuse 20×20×40 — 3 000 unités", description:"Briques creuses standard maçonnerie. Dimensions 20×20×40 cm. 3000 pièces disponibles, surplus d'un chantier R+4 terminé. Bon état, moins de 5% de casse. Prix marché: 4.80–5.50 MAD/unité.", quantity:"3 000 unités", unitPrice:3.2, totalPrice:9600, condition:"Good condition", city:"Rabat", neighborhood:"Salé", images:[], available:true, views:156, createdAt:new Date("2026-03-12") },
  { id:"l8", sellerId:"u1", type:"sale", category:"bricks", title:"Parpaing plein 15×20×40 — 500 unités", description:"Parpaings pleins pour murs porteurs. 500 unités, récupérés démolition partielle. Nettoyés. Prix marché neuf: 6.50–7 MAD/unité.", quantity:"500 unités", unitPrice:3.5, totalPrice:1750, condition:"Good condition", city:"Casablanca", neighborhood:"Hay Mohammadi", images:[], available:true, views:74, createdAt:new Date("2026-03-25") },

  // ── STEEL & IRON ─────────────────────────────────────────────
  { id:"l9", sellerId:"u2", type:"sale", category:"steel", title:"Acier HA Fe500 Ø12 — 2 tonnes (barres 12m)", description:"Acier haute adhérence Fe500 diamètre 12mm, barres de 12 mètres. 2 tonnes. Surplus chantier. Produit Sonasid. Certificat qualité disponible. Prix marché: 9 500–10 000 MAD/tonne.", quantity:"2 tonnes", unitPrice:8200, totalPrice:16400, condition:"New, unused", city:"Rabat", neighborhood:"Ain Attig", images:[], available:true, views:243, createdAt:new Date("2026-03-05") },
  { id:"l10", sellerId:"u1", type:"sale", category:"steel", title:"Treillis soudé ST50 150×150×5 — 80 panneaux", description:"Treillis soudé ST50, maille 150×150mm, fil Ø5mm. Panneaux 2.4×5.4m. 80 panneaux = 1 036 m². Surplus dalle parking. Prix marché: 380–420 MAD/panneau.", quantity:"80 panneaux", unitPrice:260, totalPrice:20800, condition:"New, unused", city:"Casablanca", neighborhood:"Sidi Maarouf", images:[], available:true, views:98, createdAt:new Date("2026-03-19") },

  // ── WOOD & TIMBER ────────────────────────────────────────────
  { id:"l11", sellerId:"u5", type:"sale", category:"wood", title:"Madriers pin sylvestre 8×15 cm longueur 4m — 60 pièces", description:"Madriers de coffrage en pin. Section 8×15 cm, longueur 4 mètres. 60 pièces, très bon état, utilisés une seule fois sur chantier. Prix marché neuf: 95–110 MAD/ml.", quantity:"60 pièces (240 ml)", unitPrice:58, totalPrice:3480, condition:"Like new", city:"Fès", neighborhood:"Route d'Immouzer", images:[], available:true, views:62, createdAt:new Date("2026-03-17") },
  { id:"l12", sellerId:"u5", type:"sale", category:"wood", title:"Lambourdes chêne 5×7 cm — 180 ml", description:"Lambourdes en chêne certifié FSC, section 5×7 cm. 180 mètres linéaires, surplus terrassement extérieur. Très bonne résistance à l'humidité. Prix marché: 85–100 MAD/ml.", quantity:"180 ml", unitPrice:52, totalPrice:9360, condition:"New, unused", city:"Fès", neighborhood:"Fès Médina", images:[], available:true, views:45, createdAt:new Date("2026-03-22") },

  // ── TOOLS & EQUIPMENT — RENTAL ───────────────────────────────
  { id:"l13", sellerId:"u1", type:"rent", category:"tools", title:"Bétonnière 350L Altrad — Location journalière", description:"Bétonnière professionnelle Altrad 350L. Moteur électrique 230V, 1100W. Disponible à l'heure ou à la journée. Livraison possible Casablanca intramuros (+150 MAD). Consommables non inclus. Remise en main propre après vérification.", quantity:"1 unité", unitPrice:280, totalPrice:280, priceUnit:"day", condition:"Good condition", city:"Casablanca", neighborhood:"Ain Sebaa", images:[], available:true, views:177, createdAt:new Date("2026-03-01") },
  { id:"l14", sellerId:"u2", type:"rent", category:"tools", title:"Échafaudage tubulaire — 200 m² couverture — Location semaine", description:"Échafaudage tubulaire galvanisé, couverture 200 m². Inclus planchers bois, garde-corps, diagonales. Montage/démontage disponible (+1500 MAD). Livraison Rabat-Salé-Temara. Caution 3000 MAD requise.", quantity:"200 m²", unitPrice:1800, totalPrice:1800, priceUnit:"week", condition:"Good condition", city:"Rabat", neighborhood:"Hay Riad", images:[], available:true, views:93, createdAt:new Date("2026-03-05") },
  { id:"l15", sellerId:"u1", type:"rent", category:"tools", title:"Niveau laser rotatif Bosch GRL300 — Location journée", description:"Laser rotatif professionnel Bosch GRL300 HVG. Portée 300m, précision ±0.1mm/m. Inclus trépied, récepteur, mallette. Idéal niveaux de sol, implantation chantier. Caution 2000 MAD.", quantity:"1 unité", unitPrice:350, totalPrice:350, priceUnit:"day", condition:"Good condition", city:"Casablanca", neighborhood:"Hay Hassani", images:[], available:true, views:54, createdAt:new Date("2026-03-10") },
  { id:"l16", sellerId:"u5", type:"rent", category:"tools", title:"Scie à onglets Makita 260mm — Location semaine", description:"Scie à onglets glissante Makita LS1040. Disque 260mm, inclinaison 0–45°. Parfaite pour menuiserie, lambris, parquet. Lame neuve fournie. Caution 1500 MAD.", quantity:"1 unité", unitPrice:650, totalPrice:650, priceUnit:"week", condition:"Good condition", city:"Fès", neighborhood:"Route d'Immouzer", images:[], available:true, views:38, createdAt:new Date("2026-03-15") },

  // ── PLUMBING ─────────────────────────────────────────────────
  { id:"l17", sellerId:"u2", type:"sale", category:"plumbing", title:"Tubes cuivre écroui Ø16 — 120 barres 5m", description:"Tubes cuivre écroui diamètre 16mm, barres de 5m. 120 barres = 600 ml. Surplus installation plomberie chantier résidentiel Rabat. Qualité A selon NM EN 1057. Prix marché: 48–55 MAD/ml.", quantity:"120 barres (600 ml)", unitPrice:32, totalPrice:19200, condition:"New, unused", city:"Rabat", neighborhood:"Salé", images:[], available:true, views:87, createdAt:new Date("2026-03-15") },
  { id:"l18", sellerId:"u1", type:"sale", category:"plumbing", title:"Radiateurs aluminium 700mm — 18 éléments", description:"Radiateurs en aluminium hauteur 700mm. 18 éléments, 6 éléments chacun soit 3 radiateurs doubles. Marque Fondital. Jamais utilisés. Idéal chauffage central. Prix marché: 350–400 MAD/élément.", quantity:"18 éléments", unitPrice:220, totalPrice:3960, condition:"New, unused", city:"Casablanca", neighborhood:"Ain Diab", images:[], available:true, views:41, createdAt:new Date("2026-03-24") },

  // ── ELECTRICAL ───────────────────────────────────────────────
  { id:"l19", sellerId:"u2", type:"sale", category:"electrical", title:"Câble électrique 3G2.5 HO7V-U — 5 rouleaux 100m", description:"Câble souple 3 conducteurs 2.5mm². Norme NFC 32-201. 5 rouleaux de 100m chacun = 500m. Marque Nexans. Surplus chantier tertiaire Rabat. Prix marché: 4.20–5 MAD/ml.", quantity:"5 rouleaux × 100 m", unitPrice:2.8, totalPrice:1400, condition:"New, unused", city:"Rabat", neighborhood:"Agdal", images:[], available:true, views:163, createdAt:new Date("2026-03-11") },
  { id:"l20", sellerId:"u1", type:"sale", category:"electrical", title:"Tableau électrique Schneider 36 modules — 4 pièces", description:"Tableaux de distribution Schneider Easy9 36 modules double rangée. 4 unités. Inclus coffrets, sans disjoncteurs. Prix marché: 450–520 MAD/pièce.", quantity:"4 pièces", unitPrice:280, totalPrice:1120, condition:"New, unused", city:"Casablanca", neighborhood:"Sidi Maarouf", images:[], available:true, views:79, createdAt:new Date("2026-03-21") },
];

let orders = [];
let messages = [];
let notifications = [];
let reviews = [];

// ════════════════════════════════════════════════════════════════
// MIDDLEWARE
// ════════════════════════════════════════════════════════════════
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: "Invalid token" }); }
};

const safe = (u) => ({ id:u.id, fullName:u.fullName, email:u.email, phone:u.phone, city:u.city, neighborhood:u.neighborhood, companyName:u.companyName, businessType:u.businessType, ice:u.ice, yearsInBusiness:u.yearsInBusiness, accountTypes:u.accountTypes, isVerified:u.isVerified, rating:u.rating, ratingCount:u.ratingCount, totalTransactions:u.totalTransactions, bio:u.bio, createdAt:u.createdAt });

// ════════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════════
app.post("/api/auth/register", async (req, res) => {
  const { fullName, email, phone, password, city, neighborhood, companyName, businessType, ice, yearsInBusiness, accountTypes } = req.body;
  if (!fullName || !email || !password) return res.status(400).json({ error: "Missing required fields" });
  if (users.find(u => u.email === email)) return res.status(400).json({ error: "Email already registered" });
  const hashed = await bcrypt.hash(password, 10);
  const u = { id:uuidv4(), fullName, email, phone:phone||"", password:hashed, city:city||"Casablanca", neighborhood:neighborhood||"", companyName:companyName||null, businessType:businessType||"Individual", ice:ice||null, yearsInBusiness:yearsInBusiness||null, accountTypes:accountTypes||["buy"], isVerified:!!(ice&&ice.length>5), rating:0, ratingCount:0, totalTransactions:0, bio:"", createdAt:new Date() };
  users.push(u);
  const token = jwt.sign({ id:u.id, email:u.email }, JWT_SECRET, { expiresIn:"30d" });
  res.status(201).json({ token, user: safe(u) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const u = users.find(u => u.email === email);
  if (!u || !(await bcrypt.compare(password, u.password))) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ id:u.id, email:u.email }, JWT_SECRET, { expiresIn:"30d" });
  res.json({ token, user: safe(u) });
});

app.get("/api/auth/me", auth, (req, res) => {
  const u = users.find(u => u.id === req.user.id);
  if (!u) return res.status(404).json({ error: "Not found" });
  res.json(safe(u));
});

app.put("/api/auth/profile", auth, (req, res) => {
  const idx = users.findIndex(u => u.id === req.user.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  ["fullName","phone","city","neighborhood","companyName","businessType","ice","yearsInBusiness","accountTypes","bio"].forEach(k => { if (req.body[k] !== undefined) users[idx][k] = req.body[k]; });
  if (users[idx].ice && users[idx].ice.length > 5) users[idx].isVerified = true;
  res.json(safe(users[idx]));
});

// ════════════════════════════════════════════════════════════════
// LISTINGS
// ════════════════════════════════════════════════════════════════
app.get("/api/listings", (req, res) => {
  const { category, type, city, search, sort, minPrice, maxPrice } = req.query;
  let result = listings.filter(l => l.available);
  if (category && category !== "all") result = result.filter(l => l.category === category);
  if (type && type !== "all") result = result.filter(l => l.type === type);
  if (city) result = result.filter(l => l.city.toLowerCase().includes(city.toLowerCase()));
  if (minPrice) result = result.filter(l => l.totalPrice >= parseFloat(minPrice));
  if (maxPrice) result = result.filter(l => l.totalPrice <= parseFloat(maxPrice));
  if (search) { const q = search.toLowerCase(); result = result.filter(l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.category.toLowerCase().includes(q)); }
  if (sort === "price_asc") result.sort((a,b) => a.totalPrice - b.totalPrice);
  else if (sort === "price_desc") result.sort((a,b) => b.totalPrice - a.totalPrice);
  else if (sort === "newest") result.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  else result.sort((a,b) => b.views - a.views);
  res.json(result.map(l => ({ ...l, seller: safe(users.find(u => u.id === l.sellerId) || {}) })));
});

app.get("/api/listings/mine", auth, (req, res) => {
  res.json(listings.filter(l => l.sellerId === req.user.id));
});

app.get("/api/listings/:id", (req, res) => {
  const l = listings.find(l => l.id === req.params.id);
  if (!l) return res.status(404).json({ error: "Not found" });
  l.views++;
  const seller = users.find(u => u.id === l.sellerId);
  const sellerReviews = reviews.filter(r => r.sellerId === l.sellerId);
  res.json({ ...l, seller: seller ? safe(seller) : null, reviews: sellerReviews.slice(0,5) });
});

app.post("/api/listings", auth, upload.array("images", 6), (req, res) => {
  const { type, category, title, description, quantity, unitPrice, totalPrice, priceUnit, condition, city, neighborhood } = req.body;
  if (!title || !category || !type) return res.status(400).json({ error: "Missing fields" });
  const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
  const l = { id:uuidv4(), sellerId:req.user.id, type, category, title, description, quantity, unitPrice:parseFloat(unitPrice)||0, totalPrice:parseFloat(totalPrice)||0, priceUnit:priceUnit||null, condition, city, neighborhood:neighborhood||"", images, available:true, views:0, createdAt:new Date() };
  listings.push(l);
  notifications.push({ id:uuidv4(), userId:req.user.id, type:"listing_created", title:"Listing published!", message:`Your listing "${title}" is now live on ReBuild.`, read:false, createdAt:new Date() });
  res.status(201).json(l);
});

app.put("/api/listings/:id", auth, (req, res) => {
  const idx = listings.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  if (listings[idx].sellerId !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  ["title","description","quantity","unitPrice","totalPrice","condition","city","neighborhood","available"].forEach(k => { if (req.body[k] !== undefined) listings[idx][k] = req.body[k]; });
  res.json(listings[idx]);
});

app.delete("/api/listings/:id", auth, (req, res) => {
  const idx = listings.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  if (listings[idx].sellerId !== req.user.id) return res.status(403).json({ error: "Forbidden" });
  listings.splice(idx, 1);
  res.json({ success: true });
});

// ════════════════════════════════════════════════════════════════
// ORDERS
// ════════════════════════════════════════════════════════════════
app.post("/api/orders", auth, (req, res) => {
  const { listingId, deliveryType, deliveryAddress, deliveryCity, deliveryDate, paymentMethod } = req.body;
  const listing = listings.find(l => l.id === listingId);
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  if (!listing.available) return res.status(400).json({ error: "Listing no longer available" });
  if (listing.sellerId === req.user.id) return res.status(400).json({ error: "Cannot buy your own listing" });

  const deliveryFee = deliveryType === "delivery" ? (listing.totalPrice > 10000 ? 500 : 250) : 0;
  const platformFee = Math.round(listing.totalPrice * 0.06);
  const total = listing.totalPrice + deliveryFee + platformFee;
  const orderId = `RB-${new Date().getFullYear()}-${String(Math.floor(Math.random()*90000)+10000)}`;

  const order = { id:uuidv4(), orderId, buyerId:req.user.id, sellerId:listing.sellerId, listingId, listingTitle:listing.title, listingCategory:listing.category, quantity:listing.quantity, itemPrice:listing.totalPrice, deliveryFee, platformFee, totalAmount:total, deliveryType, deliveryAddress:deliveryAddress||null, deliveryCity:deliveryCity||listing.city, deliveryDate:deliveryDate||null, paymentMethod, status:"confirmed", paymentStatus:"paid", deliveryStatus:"pending", agentName:deliveryType==="delivery"?"Logis-BTP Express":null, sellerPayout:listing.totalPrice-platformFee, payoutStatus:"pending", createdAt:new Date() };
  orders.push(order);
  listing.available = false;

  const buyer = users.find(u => u.id === req.user.id);
  const seller = users.find(u => u.id === listing.sellerId);
  if (buyer) buyer.totalTransactions++;
  if (seller) seller.totalTransactions++;

  notifications.push({ id:uuidv4(), userId:listing.sellerId, type:"sale", title:"Your listing was sold!", message:`"${listing.title}" purchased by ${buyer?.fullName}. Payout of ${listing.totalPrice-platformFee} MAD pending delivery confirmation.`, orderId:order.id, read:false, createdAt:new Date() });
  notifications.push({ id:uuidv4(), userId:req.user.id, type:"purchase", title:"Order confirmed!", message:`${listing.title} — Order ${orderId}. ${deliveryType==="delivery"?`Delivery to ${deliveryCity} on ${deliveryDate}.`:"Self-pickup arranged."}`, orderId:order.id, read:false, createdAt:new Date() });

  res.status(201).json({ order, buyer:safe(buyer), seller:safe(seller) });
});

app.get("/api/orders/mine", auth, (req, res) => {
  const mine = orders.filter(o => o.buyerId===req.user.id || o.sellerId===req.user.id);
  res.json(mine.map(o => ({ ...o, buyer:safe(users.find(u=>u.id===o.buyerId)||{}), seller:safe(users.find(u=>u.id===o.sellerId)||{}) })));
});

app.get("/api/orders/:id", auth, (req, res) => {
  const o = orders.find(o => o.id===req.params.id);
  if (!o) return res.status(404).json({ error: "Not found" });
  if (o.buyerId!==req.user.id && o.sellerId!==req.user.id) return res.status(403).json({ error: "Forbidden" });
  res.json({ ...o, buyer:safe(users.find(u=>u.id===o.buyerId)||{}), seller:safe(users.find(u=>u.id===o.sellerId)||{}) });
});

app.put("/api/orders/:id/status", auth, (req, res) => {
  const o = orders.find(o => o.id===req.params.id);
  if (!o) return res.status(404).json({ error: "Not found" });
  if (o.sellerId!==req.user.id && o.buyerId!==req.user.id) return res.status(403).json({ error: "Forbidden" });
  o.deliveryStatus = req.body.deliveryStatus || o.deliveryStatus;
  if (o.deliveryStatus === "delivered") {
    o.payoutStatus = "released";
    notifications.push({ id:uuidv4(), userId:o.sellerId, type:"payout", title:"Payout released!", message:`Delivery confirmed! ${o.sellerPayout} MAD has been sent to your account.`, read:false, createdAt:new Date() });
    notifications.push({ id:uuidv4(), userId:o.buyerId, type:"delivered", title:"Delivery confirmed", message:`Your order ${o.orderId} has been marked as delivered. Thank you for using ReBuild!`, read:false, createdAt:new Date() });
  }
  res.json(o);
});

// ════════════════════════════════════════════════════════════════
// MESSAGES
// ════════════════════════════════════════════════════════════════
app.get("/api/messages/conversations", auth, (req, res) => {
  const mine = messages.filter(m => m.senderId===req.user.id || m.receiverId===req.user.id);
  const map = {};
  mine.forEach(m => {
    const otherId = m.senderId===req.user.id ? m.receiverId : m.senderId;
    if (!map[otherId] || new Date(m.createdAt) > new Date(map[otherId].lastMsg.createdAt)) map[otherId] = { otherId, lastMsg:m, unread:0 };
    if (m.receiverId===req.user.id && !m.read) map[otherId].unread++;
  });
  res.json(Object.values(map).map(c => ({ ...c, other:safe(users.find(u=>u.id===c.otherId)||{}) })).sort((a,b)=>new Date(b.lastMsg.createdAt)-new Date(a.lastMsg.createdAt)));
});

app.get("/api/messages/:userId", auth, (req, res) => {
  const thread = messages.filter(m => (m.senderId===req.user.id&&m.receiverId===req.params.userId)||(m.senderId===req.params.userId&&m.receiverId===req.user.id));
  thread.filter(m=>m.receiverId===req.user.id).forEach(m=>m.read=true);
  res.json(thread.sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt)));
});

app.post("/api/messages", auth, (req, res) => {
  const { receiverId, content, listingId } = req.body;
  if (!receiverId||!content) return res.status(400).json({ error: "Missing fields" });
  const m = { id:uuidv4(), senderId:req.user.id, receiverId, content, listingId:listingId||null, read:false, createdAt:new Date() };
  messages.push(m);
  const sender = users.find(u=>u.id===req.user.id);
  notifications.push({ id:uuidv4(), userId:receiverId, type:"message", title:"New message", message:`${sender?.fullName}: ${content.slice(0,60)}${content.length>60?"...":""}`, read:false, createdAt:new Date() });
  res.status(201).json(m);
});

// ════════════════════════════════════════════════════════════════
// NOTIFICATIONS
// ════════════════════════════════════════════════════════════════
app.get("/api/notifications", auth, (req, res) => {
  res.json(notifications.filter(n=>n.userId===req.user.id).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)));
});
app.put("/api/notifications/read-all", auth, (req, res) => {
  notifications.filter(n=>n.userId===req.user.id).forEach(n=>n.read=true);
  res.json({ success:true });
});

// ════════════════════════════════════════════════════════════════
// REVIEWS
// ════════════════════════════════════════════════════════════════
app.post("/api/reviews", auth, (req, res) => {
  const { sellerId, orderId, rating, comment } = req.body;
  if (!sellerId||!rating) return res.status(400).json({ error: "Missing fields" });
  const r = { id:uuidv4(), buyerId:req.user.id, sellerId, orderId, rating:parseInt(rating), comment:comment||"", createdAt:new Date() };
  reviews.push(r);
  const seller = users.find(u=>u.id===sellerId);
  if (seller) { const total = reviews.filter(rv=>rv.sellerId===sellerId).reduce((s,rv)=>s+rv.rating,0); seller.ratingCount++; seller.rating = parseFloat((total/seller.ratingCount).toFixed(1)); }
  res.status(201).json(r);
});

// ════════════════════════════════════════════════════════════════
// STATS
// ════════════════════════════════════════════════════════════════
app.get("/api/stats/platform", (req, res) => {
  res.json({ totalListings:listings.filter(l=>l.available).length, totalUsers:users.length, totalOrders:orders.length, citiesCovered:[...new Set(listings.map(l=>l.city))].length, totalValue:listings.filter(l=>l.available).reduce((s,l)=>s+l.totalPrice,0), savedWaste:orders.length * 2.3 });
});
app.get("/api/stats/mine", auth, (req, res) => {
  const ml = listings.filter(l=>l.sellerId===req.user.id);
  const ms = orders.filter(o=>o.sellerId===req.user.id);
  const mp = orders.filter(o=>o.buyerId===req.user.id);
  res.json({ activeListings:ml.filter(l=>l.available).length, totalListings:ml.length, totalSales:ms.length, totalRevenue:ms.reduce((s,o)=>s+o.sellerPayout,0), totalPurchases:mp.length, totalSpent:mp.reduce((s,o)=>s+o.totalAmount,0) });
});

app.get("/api/users/:id", (req, res) => {
  const u = users.find(u=>u.id===req.params.id);
  if (!u) return res.status(404).json({ error: "Not found" });
  const userListings = listings.filter(l=>l.sellerId===u.id&&l.available);
  const userReviews = reviews.filter(r=>r.sellerId===u.id);
  res.json({ ...safe(u), listings:userListings, reviews:userReviews });
});

app.listen(PORT, () => console.log(`\n🏗️  ReBuild API running → http://localhost:${PORT}\n`));
