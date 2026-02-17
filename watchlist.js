// watchlist.js
// Holds ONLY product data (no logic)

window.products = [
  // ===== MEN (Rolex) =====
  {id:1,  name:"Daytona (Black/Gold)", brand:"Rolex", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-1.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:2,  name:"Daytona (Gold)",       brand:"Rolex", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-2.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:3,  name:"Daytona (Black)",      brand:"Rolex", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:4,  name:"Daytona (White)",      brand:"Rolex", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:5,  name:"GMT Master II (Batman)",brand:"Rolex",category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-5.png", details:"Quartz, rubber strap, men watch, Grade A"},
  {id:6,  name:"GMT Master II (Black)", brand:"Rolex",category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-6.png", details:"Quartz, rubber strap, men watch, Grade A"},
  {id:7,  name:"GMT Master II (Pepsi)", brand:"Rolex",category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-7.png", details:"Quartz, rubber strap, men watch, Grade A"},
  {id:8,  name:"GMT Master II (Coke)",  brand:"Rolex",category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, rubber strap, men watch, Grade A"},

  // ===== MEN (Patek Philippe) =====
  {id:9,  name:"Nautilus (Blue)",  brand:"Patek Philippe", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-9.png",  details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:10, name:"Nautilus (Black)", brand:"Patek Philippe", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-10.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:11, name:"Nautilus (White)", brand:"Patek Philippe", category:"mens", grade:"A", price:25, stock:1, label:"", img:"images/men/men-11.png", details:"Quartz, stainless steel case, men watch, Grade A"},

  // ===== WOMEN (Franck Muller) =====
  {id:12, name:"Vanguard (White)", brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-1.png", details:"Quartz, leather strap, women watch, Grade A"},
  {id:13, name:"Vanguard (Black)", brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-2.png", details:"Quartz, leather strap, women watch, Grade A"},
  {id:14, name:"Vanguard (Pink)",  brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, leather strap, women watch, Grade A"},
  {id:15, name:"Cintree Curvex (Black)", brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-4.png", details:"Quartz, leather strap, women watch, Grade A"},
  {id:16, name:"Master Square", brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:2, label:"NEW", img:"images/women/women-5.png", details:"Quartz, leather strap, women watch, Grade A"},
  {id:17, name:"Cintree Curvex (Pink)", brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, leather strap, women watch, Grade A"},
  {id:18, name:"Oalet (Black)", brand:"Franck Muller", category:"womens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, leather strap, women watch, Grade A"},

  // ===== CARTIER =====
  {id:19, name:"Santos (White)",    brand:"Cartier", category:"mens",   grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-8.png",  details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:20, name:"Santos (Black)",    brand:"Cartier", category:"mens",   grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-9.png",  details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:21, name:"Santos (Sapphire)", brand:"Cartier", category:"mens",   grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-10.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:22, name:"Santos (Emerald)",  brand:"Cartier", category:"mens",   grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-11.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:23, name:"Santos (Gold/Black)",   brand:"Cartier", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-12.png", details:"Quartz, stainless steel case, women watch, Grade A"},
  {id:24, name:"Santos (Silver/White)", brand:"Cartier", category:"womens", grade:"A", price:25, stock:0, label:"NEW", img:"images/women/women-13.png", details:"Quartz, stainless steel case, women watch, Grade A"},
  {id:25, name:"Santos (Silver/Black)", brand:"Cartier", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-14.png", details:"Quartz, stainless steel case, women watch, Grade A"},
  {id:26, name:"Santos (Gold/White)",   brand:"Cartier", category:"womens", grade:"A", price:25, stock:0, label:"NEW", img:"images/women/women-15.png", details:"Quartz, stainless steel case, women watch, Grade A"},

  // ===== MICHAEL KORS =====
  {id:27, name:"Slim Runaway (Silver)", brand:"Michael Kors", category:"mens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-17.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:28, name:"Slim Runaway (Blue)",   brand:"Michael Kors", category:"mens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-18.png", details:"Quartz, stainless steel case, men watch, Grade A"},
  {id:29, name:"Portia (White)",        brand:"Michael Kors", category:"womens", grade:"A", price:25, stock:2, label:"NEW", img:"images/women/women-19.png", details:"Quartz, stainless steel case, women watch, Grade A"},
  {id:30, name:"Portia (Gold)",         brand:"Michael Kors", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-20.png", details:"Quartz, stainless steel case, women watch, Grade A"},
  {id:31, name:"Portia (Black)",        brand:"Michael Kors", category:"womens", grade:"A", price:25, stock:1, label:"NEW", img:"images/women/women-21.png", details:"Quartz, stainless steel case, women watch, Grade A"},

  // ===== AUDEMARS PIGUET =====
  {id:32, name:"Royal Oak (Black)", brand:"Audemars Piguet", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/men-12.png", details:"Quartz, rubber strap, men watch, Grade A"},
  {id:33, name:"Royal Oak (White)", brand:"Audemars Piguet", category:"mens", grade:"A", price:25, stock:0, label:"NEW", img:"images/men/unknown.png", details:"Quartz, stainless steel case, men watch, Grade A"},

  // ===== COUPLE (Rolex) =====
  {id:34, name:"Couple (Red)",          brand:"Rolex", category:"couple", grade:"A", price:40, stock:0, label:"NEW", img:"images/couple/couple-1.png", details:"Quartz, stainless steel case, couple watch, Grade A"},
  {id:35, name:"Couple (Green)",        brand:"Rolex", category:"couple", grade:"A", price:40, stock:1, label:"NEW", img:"images/couple/couple-2.png", details:"Quartz, stainless steel case, couple watch, Grade A"},
  {id:36, name:"Couple (Black)",        brand:"Rolex", category:"couple", grade:"A", price:40, stock:0, label:"NEW", img:"images/couple/couple-3.png", details:"Quartz, stainless steel case, couple watch, Grade A"},
  {id:37, name:"Couple (White/Silver)", brand:"Rolex", category:"couple", grade:"A", price:40, stock:0, label:"NEW", img:"images/couple/couple-4.png", details:"Quartz, stainless steel case, couple watch, Grade A"},
  {id:38, name:"Couple (Yellow)",       brand:"Rolex", category:"couple", grade:"A", price:40, stock:1, label:"NEW", img:"images/couple/couple-5.png", details:"Quartz, stainless steel case, couple watch, Grade A"},

  // ===== COMING SOON =====
  {id:39, name:"GA2100 (Manga L.Gray W)",     brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs39.jpeg", images: ["images/men/gspackaging.jpeg","images/men/gs39.jpeg"], details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:40, name:"GA2100 (Manga Green B)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs40.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:41, name:"GA2100 (Manga Green W)",      brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs41.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:42, name:"GA2100 (Manga Gray W)",    brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs42.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:43, name:"GA2100 (Manga Beach B)",     brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs43.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:44, name:"GA2100 (Manga Blue W)",      brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs44.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:45, name:"GA2100 (Manga Red B)",      brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs45.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:46, name:"GA2100 (Manga Red W)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs46.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:47, name:"GA2100 (Manga Brown B)",     brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs47.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:48, name:"GA2100 (Titanium)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs48.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:49, name:"GA2100 (TP Turquoise)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs49.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:50, name:"GA2100 (TP Yellow)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs50.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:51, name:"GA2100 (TP Baby Blue)",     brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs51.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:52, name:"GA2100 (TP Red)",    brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs52.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:53, name:"GA2100 (TP Salmon)", brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs53.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:54, name:"GA2100 (TP Yellow/Rbw)", brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs54.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:55, name:"GA2100 (TP Turquoise/Rbw)",brand:"G-Shock",category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs55.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:56, name:"GA2100 (TP White/Rbw)", brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs56.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:57, name:"GA2100 (All Tp/Rainbow)",brand:"G-Shock",category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs57.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:58, name:"GA2100 (TP Turquoise)", brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs58.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:59, name:"GA2100 (Abstract Yellow)",  brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs59.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:60, name:"GA2100 (Abstract Turquoise)",brand:"G-Shock",category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs60.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:61, name:"GA2100 (Gundam)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs61.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:62, name:"GA2100 (Silver)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs62.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:63, name:"GA2100 (Neon)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs63.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:64, name:"GA2100 (Wine Metallic)",  brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs64.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:65, name:"GA2100 (Black/Gold)",brand:"G-Shock",category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs65.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:66, name:"GA2100 (black/Red)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs66.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:67, name:"GA2100 (Black/White)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs67.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:68, name:"GA2100 (Stealth Black)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/gs68.jpeg", details:"Rubber, complete with box & paper bag, Grade Premium"},

  // ===== DEFECTS / PROMO =====
  {id:69, name:"Nautilus (Black) — Defect", brand:"Patek Philippe", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-1.PNG", details:"Complete with box, Grade A (Slight dent)"},
  {id:70, name:"Lexington (Bronze) — Defect", brand:"Michael Kors", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-4.PNG", details:"Complete with box, Grade A (Slight dirty inside)"},
  {id:71, name:"Oalet (Black) — Defect", brand:"Franck Muller", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-5.PNG", details:"Complete with box, Grade A (Scratch on the glass)"},
  {id:72, name:"Nautilus (Blue) — Defect", brand:"Patek Philippe", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-2.PNG", details:"Complete with box, Grade A (Faded colour & scratches)"},
  {id:73, name:"Royal Oak (White) — Defect", brand:"Audemars Piguet", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-3.PNG", details:"Complete with box, Grade A (Faded colour & scratches)"},

  // ===== Casio =====
  {id:74, name:"MTP 9203 (Black)",          brand:"Casio", category:"mens", grade:"Premium", price:50, stock:1, label:"NEW", img:"images/women/women-17.png", details:"Quartz, stainless steel case, date & date display, men watch, Premium Grade, Casio Premium box included"},
  {id:75, name:"MTP 9203 (Black/sapphire)", brand:"Casio", category:"mens", grade:"Premium", price:50, stock:1, label:"NEW", img:"images/women/women-17.png", details:"Quartz, stainless steel case, date & date display, men watch, Premium Grade, Casio Premium box included"},
  {id:76, name:"MTP 9203 (White)",          brand:"Casio", category:"mens", grade:"Premium", price:50, stock:1, label:"NEW", img:"images/women/women-17.png", details:"Quartz, stainless steel case, date & date display, men watch, Premium Grade, Casio Premium box included"},
  {id:77, name:"MTP 9203 (White/Sapphire)", brand:"Casio", category:"mens", grade:"Premium", price:50, stock:1, label:"NEW", img:"images/women/women-17.png", details:"Quartz, stainless steel case, date & date display, men watch, Premium Grade, Casio Premium box included"},
  {id:78, name:"MTP 9203 (Navy Blue)",      brand:"Casio", category:"mens", grade:"Premium", price:50, stock:1, label:"NEW", img:"images/women/women-17.png", details:"Quartz, stainless steel case, date & date display, men watch, Premium Grade, Casio Premium box included"},
  {id:79, name:"MTP 9203 (Cyan)",           brand:"Casio", category:"mens", grade:"Premium", price:50, stock:1, label:"NEW", img:"images/women/women-17.png", details:"Quartz, stainless steel case, date & date display, men watch, Premium Grade, Casio Premium box included"},
  {id:80, name:"MTP/LTP V002GL (black/gold)",   brand:"Casio", category:"couple", grade:"Premium", price:55, stock:1, label:"NEW", img:"images/women/women-18.png", details:"Quartz, leather strap, couple watch, Premium Grade , complete with Casio white box"},
  {id:81, name:"MTP/LTP V002GL (black/black)",  brand:"Casio", category:"couple", grade:"Premium", price:55, stock:1, label:"NEW", img:"images/women/women-18.png", details:"Quartz, leather strap, couple watch, Premium Grade , complete with Casio white box"},
  {id:82, name:"MTP/LTP V002GL (black/silver)", brand:"Casio", category:"couple", grade:"Premium", price:55, stock:1, label:"NEW", img:"images/women/women-18.png", details:"Quartz, leather strap, couple watch, Premium Grade , complete with Casio white box"},
  {id:83, name:"MTP/LTP V002GL (brown/black)",  brand:"Casio", category:"couple", grade:"Premium", price:55, stock:1, label:"NEW", img:"images/women/women-18.png", details:"Quartz, leather strap, couple watch, Premium Grade , complete with Casio white box"},
  {id:84, name:"MTP/LTP V002GL (brown/white)",  brand:"Casio", category:"couple", grade:"Premium", price:55, stock:1, label:"NEW", img:"images/women/women-18.png", details:"Quartz, leather strap, couple watch, Premium Grade , complete with Casio white box"},
  {id:85, name:"CT5013 Arabic Couple (black/silver)", brand:"Casio", category:"couple", grade:"Premium", price:65, stock:1, label:"NEW", img:"images/women/women-18.png", details:"Quartz, stainless steel case, couple watch, premium grade, arabic font, complete with Casio white box"},
  {id:86, name:"CT5013 Arabic Couple (black/gold)",   brand:"Casio", category:"couple", grade:"Premium", price:65, stock:1, label:"NEW", img:"images/women/women-18.png", details:"Quartz, stainless steel case, couple watch, premium grade, arabic font, complete with Casio white box"},
  {id:87, name:"CT5013 Arabic Couple (white/silver)", brand:"Casio", category:"couple", grade:"Premium", price:65, stock:1, label:"NEW", img:"images/women/women-18.png", details:"Quartz, stainless steel case, couple watch, premium grade, arabic font, complete with Casio white box"},
  {id:88, name:"CT5013 Arabic Couple (white/gold)",   brand:"Casio", category:"couple", grade:"Premium", price:65, stock:1, label:"NEW", img:"images/women/women-18.png", details:"Quartz, stainless steel case, couple watch, premium grade, arabic font, complete with Casio white box"},
  {id:89, name:"LTP VT01L (Pixel)",   brand:"Casio", category:"womens", grade:"Premium", price:25, stock:2, label:"NEW", img:"images/women/women-19.png", details:"Quartz, leather strap, women watch, Premium grade, Casio White box included"},
  {id:90, name:"LTP VT01L (Classic)", brand:"Casio", category:"womens", grade:"Premium", price:25, stock:1, label:"NEW", img:"images/women/women-20.png", details:"Quartz, leather strap, women watch, premium grade, Casio White box included"},
  {id:91, name:"LTP VT01L (Mini)",    brand:"Casio", category:"womens", grade:"Premium", price:25, stock:1, label:"NEW", img:"images/women/women-21.png", details:"Quartz, leather strap, women watch, premium grade, Casio White box included"},
  {id:92, name:"LTP VT01L (Line)",    brand:"Casio", category:"womens", grade:"Premium", price:25, stock:1, label:"NEW", img:"images/women/women-21.png", details:"Quartz, leather strap, women watch, premium grade, Casio White box included"},
];

window.products = products;
