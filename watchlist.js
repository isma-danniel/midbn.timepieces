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
  {id:11, name:"Nautilus (White)", brand:"Patek Philippe", category:"mens", grade:"A", price:25, stock:1, label:"NEW", img:"images/men/men-11.png", details:"Quartz, stainless steel case, men watch, Grade A"},

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
  {id:39, name:"GA2100 (Manga Green)", brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:40, name:"GA2100 (Manga D.Green)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:41, name:"GA2100 (Manga Gray)",      brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:42, name:"GA2100 (Manga D.gray)",    brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:43, name:"GA2100 (Manga Beach)",     brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:44, name:"GA2100 (Manga Brown)",     brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:45, name:"GA2100 (Manga Blue)",      brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:46, name:"GA2100 (TP all Red)",      brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:47, name:"GA2100 (TP all Yellow)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:48, name:"GA2100 (TP all Gray)",     brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:49, name:"GA2100 (TP White/Blue)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:50, name:"GA2100 (TP Black/Gold)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:51, name:"GA2100 (TP Yellow/rbw)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:52, name:"GA2100 (TP Blue/rbw)",     brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:53, name:"GA2100 (TP White Rbw)",    brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:54, name:"GA2100 (Solid Black/Rbw)", brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:55, name:"GA2100 (Solid Red/Black)", brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:56, name:"GA2100 (Solid White/Black)",brand:"G-Shock",category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:57, name:"GA2100 (Solid Black/Gold)", brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:58, name:"GA2100 (Solid Salmon/Black)",brand:"G-Shock",category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:59, name:"GA2100 (Solid Gray/Black)", brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:60, name:"GA2100 (Solid all Gray)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:61, name:"GA2100 (Solid TP Rainbow)", brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:62, name:"GA2100 (Abstract Tp Gold)",  brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:63, name:"GA2100 (Abstract TP Turquoise)",brand:"G-Shock",category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:64, name:"GA2100 (Abstract TP Rainbow)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:65, name:"GA2100 (Abstract Blue/White)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},
  {id:66, name:"GA2100 (Abstract Gray/Green)",   brand:"G-Shock", category:"coming", grade:"Premium", price:35, stock:0, label:"COMING SOON", img:"images/men/unknown.png", details:"Rubber, complete with box & paper bag, Grade Premium"},

  // ===== DEFECTS / PROMO =====
  {id:67, name:"Nautilus (Black) — Defect", brand:"Patek Philippe", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-1.PNG", details:"Complete with box, Grade A (Slight dent)"},
  {id:68, name:"Lexington (Bronze) — Defect", brand:"Michael Kors", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-4.PNG", details:"Complete with box, Grade A (Slight dirty inside)"},
  {id:69, name:"Oalet (Black) — Defect", brand:"Franck Muller", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-5.PNG", details:"Complete with box, Grade A (Scratch on the glass)"},
  {id:70, name:"Nautilus (Blue) — Defect", brand:"Patek Philippe", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-2.PNG", details:"Complete with box, Grade A (Faded colour & scratches)"},
  {id:71, name:"Royal Oak (White) — Defect", brand:"Audemars Piguet", category:"promo", grade:"A", price:15, stock:1, label:"DEFECT", img:"images/defect/defect-3.PNG", details:"Complete with box, Grade A (Faded colour & scratches)"},
];

window.products = products;
