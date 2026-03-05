import { useState, useEffect } from "react";

const C = {
  bg: "#0B0D12", surface: "#13161E", card: "#191D28", border: "#222840",
  accent: "#F47B1A", accentGlow: "rgba(244,123,26,0.18)",
  blue: "#3A7BF5", blueGlow: "rgba(58,123,245,0.15)",
  cyan: "#00C2E0", cyanGlow: "rgba(0,194,224,0.15)",
  purple: "#8B5CF6", purpleGlow: "rgba(139,92,246,0.15)",
  teal: "#14B8A6", tealGlow: "rgba(20,184,166,0.15)",
  green: "#22C55E", red: "#EF4444", yellow: "#EAB308",
  text: "#E8EDF5", muted: "#5A6A88", subtle: "#2A3248",
};

const MODES = {
  road:      { label: "Wegvervoer",   icon: "🚛", color: C.accent,  glow: C.accentGlow },
  air:       { label: "Luchtvracht",  icon: "✈️",  color: C.cyan,    glow: C.cyanGlow   },
  sea:       { label: "Zeevaart",     icon: "🚢",  color: C.blue,    glow: C.blueGlow   },
  breakbulk: { label: "Breakbulk",    icon: "📦",  color: C.purple,  glow: C.purpleGlow },
  roro:      { label: "RoRo",         icon: "🚗",  color: C.teal,    glow: C.tealGlow   },
};

const ALL_SHIPMENTS = [
  { id:"BNL-R-001", mode:"road",      origin:"Rotterdam",      dest:"Antwerpen",         status:"In Transit", carrier:"DHL Freight",           weight:"2.400 kg",  eta:"05 Mrt", progress:65,  type:"FTL",           extra:"2 pallets" },
  { id:"BNL-R-002", mode:"road",      origin:"Amsterdam",      dest:"Brussel",            status:"Delivered",  carrier:"DB Schenker",           weight:"850 kg",    eta:"04 Mrt", progress:100, type:"LTL",           extra:"Koelketen" },
  { id:"BNL-R-003", mode:"road",      origin:"Luik",           dest:"Utrecht",            status:"Pending",    carrier:"Ceva Logistics",        weight:"3.200 kg",  eta:"07 Mrt", progress:0,   type:"FTL",           extra:"Gevaarlijke stoffen" },
  { id:"BNL-R-004", mode:"road",      origin:"Gent",           dest:"Den Haag",           status:"In Transit", carrier:"Kuehne+Nagel",          weight:"1.100 kg",  eta:"06 Mrt", progress:42,  type:"LTL",           extra:"" },
  { id:"BNL-R-005", mode:"road",      origin:"Eindhoven",      dest:"Luxemburg",          status:"Delayed",    carrier:"DHL Freight",           weight:"780 kg",    eta:"08 Mrt", progress:30,  type:"Express",       extra:"Spoedzending" },
  { id:"BNL-A-001", mode:"air",       origin:"AMS Schiphol",   dest:"DXB Dubai",          status:"In Transit", carrier:"KLM Cargo",             weight:"420 kg",    eta:"05 Mrt", progress:72,  type:"Express Air",   extra:"Vlucht KL0571" },
  { id:"BNL-A-002", mode:"air",       origin:"BRU Zaventem",   dest:"JFK New York",       status:"Delivered",  carrier:"Brussels Airlines Cargo",weight:"210 kg",   eta:"03 Mrt", progress:100, type:"General Air",   extra:"Vlucht SN0501" },
  { id:"BNL-A-003", mode:"air",       origin:"AMS Schiphol",   dest:"HKG Hong Kong",      status:"Pending",    carrier:"Cargolux",              weight:"1.800 kg",  eta:"08 Mrt", progress:0,   type:"Charter",       extra:"Koelketen +2C" },
  { id:"BNL-A-004", mode:"air",       origin:"EIN Eindhoven",  dest:"ORD Chicago",        status:"In Transit", carrier:"DHL Aviation",          weight:"340 kg",    eta:"06 Mrt", progress:55,  type:"Express Air",   extra:"Medische lading" },
  { id:"BNL-A-005", mode:"air",       origin:"AMS Schiphol",   dest:"NRT Tokyo",          status:"Delayed",    carrier:"KLM Cargo",             weight:"890 kg",    eta:"09 Mrt", progress:20,  type:"General Air",   extra:"Vlucht vertraging" },
  { id:"BNL-S-001", mode:"sea",       origin:"Rotterdam",      dest:"Shanghai",           status:"In Transit", carrier:"MSC",                   weight:"22.400 kg", eta:"02 Apr", progress:38,  type:"FCL 40HC",      extra:"MSCU7483920" },
  { id:"BNL-S-002", mode:"sea",       origin:"Antwerpen",      dest:"Santos Brazilie",    status:"In Transit", carrier:"Hapag-Lloyd",           weight:"18.200 kg", eta:"28 Mrt", progress:61,  type:"FCL 20'",       extra:"HLXU2839401" },
  { id:"BNL-S-003", mode:"sea",       origin:"Rotterdam",      dest:"New York",           status:"Delivered",  carrier:"Maersk",                weight:"14.600 kg", eta:"28 Feb", progress:100, type:"LCL",           extra:"2 CBM" },
  { id:"BNL-S-004", mode:"sea",       origin:"Rotterdam",      dest:"Singapore",          status:"Pending",    carrier:"CMA CGM",               weight:"26.800 kg", eta:"10 Apr", progress:0,   type:"FCL 40'",       extra:"DG klasse 3" },
  { id:"BNL-S-005", mode:"sea",       origin:"Antwerpen",      dest:"Lagos Nigeria",      status:"Delayed",    carrier:"MSC",                   weight:"9.200 kg",  eta:"15 Mrt", progress:45,  type:"LCL",           extra:"Haven vertraging" },
  { id:"BNL-B-001", mode:"breakbulk", origin:"Rotterdam",      dest:"Houston TX",         status:"In Transit", carrier:"Spliethoff",            weight:"84.000 kg", eta:"18 Mrt", progress:50,  type:"Project Cargo", extra:"Turbine rotor 4.2m" },
  { id:"BNL-B-002", mode:"breakbulk", origin:"Antwerpen",      dest:"Dammam SA",          status:"Pending",    carrier:"BigLift",               weight:"120.000 kg",eta:"25 Mrt", progress:0,   type:"Heavy Lift",    extra:"Drukketel 85T" },
  { id:"BNL-B-003", mode:"breakbulk", origin:"Rotterdam",      dest:"Kaapstad ZA",        status:"Delivered",  carrier:"BBC Chartering",        weight:"36.000 kg", eta:"22 Feb", progress:100, type:"Stukgoed",      extra:"Staaloverlading" },
  { id:"BNL-B-004", mode:"breakbulk", origin:"Gent",           dest:"Durban ZA",          status:"In Transit", carrier:"Spliethoff",            weight:"52.000 kg", eta:"12 Mrt", progress:74,  type:"Project Cargo", extra:"Brug elementen" },
  { id:"BNL-RR-001",mode:"roro",      origin:"Zeebrugge",      dest:"Baltimore USA",      status:"In Transit", carrier:"Wallenius Wilhelmsen",  weight:"48.000 kg", eta:"20 Mrt", progress:58,  type:"PCTC",          extra:"24x voertuigen" },
  { id:"BNL-RR-002",mode:"roro",      origin:"Rotterdam",      dest:"Jeddah SA",          status:"Pending",    carrier:"MOL",                   weight:"62.000 kg", eta:"01 Apr", progress:0,   type:"Con-Ro",        extra:"38x bouwmachines" },
  { id:"BNL-RR-003",mode:"roro",      origin:"Antwerpen",      dest:"Yokohama JP",        status:"In Transit", carrier:"NYK Line",              weight:"35.000 kg", eta:"14 Apr", progress:22,  type:"PCTC",          extra:"18x personenautos" },
  { id:"BNL-RR-004",mode:"roro",      origin:"Zeebrugge",      dest:"Port Elizabeth ZA",  status:"Delivered",  carrier:"Grimaldi Lines",        weight:"29.000 kg", eta:"14 Feb", progress:100, type:"Ferry RoRo",    extra:"12x trailers" },
  { id:"BNL-RR-005",mode:"roro",      origin:"Rotterdam",      dest:"Gothenburg SE",      status:"Delayed",    carrier:"DFDS",                  weight:"18.000 kg", eta:"06 Mrt", progress:40,  type:"Short Sea",     extra:"Port congestion" },
];

const CARRIERS = {
  road:      [
    { name:"DHL Freight",    rating:4.8, active:12, onTime:96, cost:"1.24/km",    unit:"euro", specialty:"Express & Koelketen" },
    { name:"DB Schenker",    rating:4.6, active:8,  onTime:94, cost:"1.18/km",    unit:"euro", specialty:"Full Loads" },
    { name:"Kuehne+Nagel",   rating:4.7, active:5,  onTime:97, cost:"1.32/km",    unit:"euro", specialty:"Gevaarlijke stoffen" },
    { name:"DSV",            rating:4.5, active:9,  onTime:92, cost:"1.15/km",    unit:"euro", specialty:"LTL netwerk" },
    { name:"Geodis",         rating:4.4, active:6,  onTime:91, cost:"1.11/km",    unit:"euro", specialty:"Last mile" },
  ],
  air:       [
    { name:"KLM Cargo",      rating:4.9, active:8,  onTime:97, cost:"4.20/kg",    unit:"euro", specialty:"Schiphol Hub" },
    { name:"Brussels Airlines Cargo", rating:4.6, active:5, onTime:93, cost:"3.95/kg", unit:"euro", specialty:"Zaventem Hub" },
    { name:"Cargolux",       rating:4.7, active:6,  onTime:95, cost:"3.80/kg",    unit:"euro", specialty:"Pharma & DG" },
    { name:"DHL Aviation",   rating:4.8, active:10, onTime:98, cost:"5.10/kg",    unit:"euro", specialty:"Express overnight" },
    { name:"Air France Cargo",rating:4.4,active:4,  onTime:90, cost:"3.60/kg",    unit:"euro", specialty:"Perishables" },
  ],
  sea:       [
    { name:"Maersk",         rating:4.7, active:14, onTime:93, cost:"1.800/TEU",  unit:"dollar", specialty:"Global netwerk" },
    { name:"MSC",            rating:4.6, active:11, onTime:91, cost:"1.650/TEU",  unit:"dollar", specialty:"Bulk volumes" },
    { name:"Hapag-Lloyd",    rating:4.8, active:9,  onTime:95, cost:"1.950/TEU",  unit:"dollar", specialty:"Premium service" },
    { name:"CMA CGM",        rating:4.5, active:7,  onTime:90, cost:"1.720/TEU",  unit:"dollar", specialty:"Far East" },
    { name:"Evergreen",      rating:4.3, active:5,  onTime:88, cost:"1.580/TEU",  unit:"dollar", specialty:"Trans-Pacific" },
  ],
  breakbulk: [
    { name:"Spliethoff",     rating:4.9, active:4,  onTime:96, cost:"Op aanvraag",unit:"", specialty:"Project cargo" },
    { name:"BigLift",        rating:4.8, active:3,  onTime:95, cost:"Op aanvraag",unit:"", specialty:"Heavy lift 200T+" },
    { name:"BBC Chartering", rating:4.6, active:5,  onTime:92, cost:"Op aanvraag",unit:"", specialty:"Multipurpose" },
    { name:"SAL Heavy Lift", rating:4.7, active:3,  onTime:94, cost:"Op aanvraag",unit:"", specialty:"Offshore & energie" },
  ],
  roro:      [
    { name:"Wallenius Wilhelmsen", rating:4.8, active:6, onTime:95, cost:"900/CBM", unit:"dollar", specialty:"Automotive" },
    { name:"MOL",            rating:4.6, active:5,  onTime:92, cost:"850/CBM",  unit:"dollar", specialty:"Machines & voertuigen" },
    { name:"NYK Line",       rating:4.7, active:4,  onTime:94, cost:"870/CBM",  unit:"dollar", specialty:"Automotive PCTC" },
    { name:"Grimaldi Lines", rating:4.5, active:7,  onTime:90, cost:"780/CBM",  unit:"dollar", specialty:"Short sea & trailers" },
    { name:"DFDS",           rating:4.4, active:8,  onTime:89, cost:"720/CBM",  unit:"dollar", specialty:"Europa short sea" },
  ],
};

const statusColor = s => ({ "In Transit":C.blue,"Delivered":C.green,"Pending":C.yellow,"Delayed":C.red }[s]||C.muted);
const statusBg    = s => ({ "In Transit":"rgba(58,123,245,0.12)","Delivered":"rgba(34,197,94,0.12)","Pending":"rgba(234,179,8,0.12)","Delayed":"rgba(239,68,68,0.12)" }[s]||"rgba(90,106,136,0.12)");

const Badge = ({ label, color, bg }) => (
  <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600, background:bg||`${color}1A`, color:color||C.muted, whiteSpace:"nowrap" }}>{label}</span>
);

const Bar = ({ val, max=100, color, h=6 }) => (
  <div style={{ height:h, background:C.border, borderRadius:h/2, overflow:"hidden" }}>
    <div style={{ height:"100%", width:`${Math.min(100,(val/max)*100)}%`, background:color||C.accent, borderRadius:h/2, transition:"width .5s ease" }} />
  </div>
);

const KPI = ({ label, value, icon, color, trend, sub }) => (
  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 22px", flex:1, cursor:"default" }}
    onMouseEnter={e=>e.currentTarget.style.borderColor=color||C.accent}
    onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
  >
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
      <div>
        <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:1.2, marginBottom:8 }}>{label}</div>
        <div style={{ fontSize:28, fontWeight:800, color:C.text, lineHeight:1 }}>{value}</div>
        {trend!==undefined && <div style={{ fontSize:11, color:trend>0?C.green:C.red, marginTop:5 }}>{trend>0?"▲":"▼"} {Math.abs(trend)}% vs vorige maand</div>}
        {sub && <div style={{ fontSize:11, color:C.muted, marginTop:5 }}>{sub}</div>}
      </div>
      <div style={{ width:42, height:42, borderRadius:10, background:color?`${color}1A`:C.accentGlow, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
    </div>
  </div>
);

const Logo = () => (
  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
    <div style={{ width:36, height:36, background:C.accent, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, fontSize:13, color:"#fff", boxShadow:`0 0 16px ${C.accentGlow}` }}>BNL</div>
    <div>
      <div style={{ fontWeight:800, fontSize:15, color:C.text, letterSpacing:.5 }}>BNL Shipping</div>
      <div style={{ fontSize:9, color:C.muted, letterSpacing:1.8, textTransform:"uppercase" }}>TMS Platform</div>
    </div>
  </div>
);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{children}</div>
);

const TextInput = ({ value, onChange, placeholder, mono }) => (
  <input value={value} onChange={onChange} placeholder={placeholder}
    style={{ width:"100%", padding:"10px 14px", background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:8, color:C.text, fontSize:mono?13:14, outline:"none", boxSizing:"border-box",
      fontFamily: mono?"'Courier New',monospace":"inherit", letterSpacing: mono?.5:0 }} />
);

const SectionDivider = ({ icon, title, color }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, margin:"20px 0 14px",
    borderTop:`1px solid ${C.border}`, paddingTop:18 }}>
    <div style={{ width:28, height:28, borderRadius:7, background:`${color}1A`, border:`1px solid ${color}44`,
      display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{icon}</div>
    <span style={{ fontSize:12, fontWeight:700, color:color, textTransform:"uppercase", letterSpacing:1 }}>{title}</span>
  </div>
);

// Container catalogue for sea freight
const SEA_CONTAINERS = [
  { group:"Dry",      types:[
    { code:"20DC",  label:"20' Dry Container",       dims:"L 589 × B 235 × H 239 cm",  payload:"28.200 kg", cbm:"33.2 m³",  cargo:false },
    { code:"40DC",  label:"40' Dry Container",       dims:"L 1200 × B 235 × H 239 cm", payload:"26.700 kg", cbm:"67.7 m³",  cargo:false },
    { code:"40HC",  label:"40' High Cube",           dims:"L 1200 × B 235 × H 269 cm", payload:"26.460 kg", cbm:"76.4 m³",  cargo:false },
    { code:"45HC",  label:"45' High Cube",           dims:"L 1351 × B 235 × H 269 cm", payload:"27.600 kg", cbm:"86.1 m³",  cargo:false },
  ]},
  { group:"Reefer",   types:[
    { code:"20RF",  label:"20' Reefer",              dims:"L 545 × B 225 × H 220 cm",  payload:"27.400 kg", cbm:"27.0 m³",  cargo:false },
    { code:"40RF",  label:"40' Reefer High Cube",    dims:"L 1149 × B 225 × H 250 cm", payload:"29.000 kg", cbm:"64.8 m³",  cargo:false },
  ]},
  { group:"Open Top", types:[
    { code:"20OT",  label:"20' Open Top",            dims:"L 589 × B 235 × H 239 cm",  payload:"28.100 kg", cbm:"32.5 m³",  cargo:true  },
    { code:"40OT",  label:"40' Open Top",            dims:"L 1200 × B 235 × H 239 cm", payload:"26.500 kg", cbm:"66.4 m³",  cargo:true  },
  ]},
  { group:"Flatrack", types:[
    { code:"20FR",  label:"20' Flatrack",            dims:"L 568 × B 224 × H 213 cm",  payload:"30.480 kg", cbm:"—",        cargo:true  },
    { code:"40FR",  label:"40' Flatrack",            dims:"L 1200 × B 224 × H 200 cm", payload:"40.000 kg", cbm:"—",        cargo:true  },
    { code:"20FR-C",label:"20' Flatrack Collapsible",dims:"L 568 × B 224 × H 213 cm",  payload:"30.480 kg", cbm:"—",        cargo:true  },
    { code:"40FR-C",label:"40' Flatrack Collapsible",dims:"L 1200 × B 224 × H 200 cm", payload:"40.000 kg", cbm:"—",        cargo:true  },
  ]},
  { group:"Speciaal", types:[
    { code:"20TK",  label:"20' Tank Container",      dims:"L 610 × ⌀ 244 cm",          payload:"26.000 kg", cbm:"21.6 m³",  cargo:false },
    { code:"LCL",   label:"LCL (Groupage)",          dims:"—",                          payload:"—",         cbm:"Op maat",  cargo:false },
  ]},
];

// Returns true when the form should show cargo details section
const needsCargoDetails = (mode, subtype) =>
  mode === "breakbulk" || mode === "roro" ||
  (mode === "sea" && SEA_CONTAINERS.flatMap(g=>g.types).find(t=>t.code===subtype)?.cargo === true);

// ─── CARGO DETAILS FORM SECTION ───────────────────────────────────────────────
const CargoDetailsSection = ({ cargo, setCargo, modeColor }) => {
  const set = (k) => (e) => setCargo(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div style={{ background:`${modeColor}08`, border:`1px solid ${modeColor}33`, borderRadius:12, padding:18, marginBottom:4 }}>
      {/* Cargo type + quantity */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12, marginBottom:14 }}>
        <div>
          <FieldLabel>Omschrijving lading</FieldLabel>
          <TextInput value={cargo.description} onChange={set("description")} placeholder="Bv. Turbine rotor, Vrachtauto, Drukketel" />
        </div>
        <div>
          <FieldLabel>Aantal stuks</FieldLabel>
          <TextInput value={cargo.qty} onChange={set("qty")} placeholder="Bv. 1" />
        </div>
      </div>

      {/* Dimensions */}
      <div style={{ marginBottom:14 }}>
        <FieldLabel>Afmetingen (L × B × H)</FieldLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {[["length","Lengte (cm)","Bv. 1200"],["width","Breedte (cm)","Bv. 240"],["height","Hoogte (cm)","Bv. 280"]].map(([k,lbl,ph])=>(
            <div key={k}>
              <div style={{ fontSize:10, color:C.muted, marginBottom:4 }}>{lbl}</div>
              <TextInput value={cargo[k]} onChange={set(k)} placeholder={ph} mono />
            </div>
          ))}
        </div>
        <div style={{ fontSize:11, color:C.muted, marginTop:6, display:"flex", gap:6, alignItems:"center" }}>
          <span style={{ color:modeColor }}>ℹ</span>
          {cargo.length && cargo.width && cargo.height
            ? <span>Volume: <strong style={{ color:C.text }}>{((+cargo.length||0)*(+cargo.width||0)*(+cargo.height||0)/1000000).toFixed(2)} m³</strong></span>
            : <span>Vul lengte, breedte en hoogte in voor automatisch volume</span>
          }
        </div>
      </div>

      {/* Weight */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
        <div>
          <FieldLabel>Brutogewicht (kg)</FieldLabel>
          <TextInput value={cargo.grossWeight} onChange={set("grossWeight")} placeholder="Bv. 84000" mono />
        </div>
        <div>
          <FieldLabel>Nettogewicht (kg)</FieldLabel>
          <TextInput value={cargo.netWeight} onChange={set("netWeight")} placeholder="Bv. 80000" mono />
        </div>
      </div>

      {/* Marks & numbers */}
      <div style={{ marginBottom:14 }}>
        <FieldLabel>Marks &amp; Numbers</FieldLabel>
        <textarea value={cargo.marks} onChange={set("marks")}
          placeholder={"Bv.\nBNL-2024/001\nROTTERDAM → HOUSTON\nPO: 4892-TX\nMade in Netherlands"}
          rows={4}
          style={{ width:"100%", padding:"10px 14px", background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:8, color:C.text, fontSize:13, outline:"none", resize:"vertical",
            boxSizing:"border-box", fontFamily:"'Courier New',monospace", lineHeight:1.7,
            letterSpacing:.3 }} />
      </div>

      {/* Special properties */}
      <div style={{ marginBottom:0 }}>
        <FieldLabel>Bijzondere eigenschappen</FieldLabel>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {["OOG (Out of Gauge)","Overlengte","Overwijdte","Overhoogte","Zwaar gewicht","Gevaarlijke stoffen","Koelketen vereist","Dek lading","Fragiel"].map(tag=>{
            const active = (cargo.tags||[]).includes(tag);
            return (
              <button key={tag} type="button"
                onClick={()=>setCargo(prev=>({
                  ...prev,
                  tags: active ? prev.tags.filter(t=>t!==tag) : [...(prev.tags||[]), tag]
                }))}
                style={{ padding:"5px 12px", borderRadius:20, fontSize:11, fontWeight:600, cursor:"pointer",
                  background: active?modeColor:C.surface,
                  border:`1px solid ${active?modeColor:C.border}`,
                  color: active?"#fff":C.muted, transition:"all .12s" }}>
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ onClose }) => {
  const [mode, setMode]   = useState("road");
  const [form, setForm]   = useState({ origin:"", dest:"", carrier:"", weight:"", notes:"", subtype:"" });
  const [cargo, setCargo] = useState({ description:"", qty:"", length:"", width:"", height:"", grossWeight:"", netWeight:"", marks:"", tags:[] });
  const [step, setStep]   = useState(1); // 1 = zending info, 2 = lading gegevens (only for relevant modes)

  const mv = MODES[mode];
  const typesByMode = {
    road:["FTL","LTL","Express"],
    air:["Express Air","General Air","Charter"],
    breakbulk:["Project Cargo","Heavy Lift","Stukgoed","Multipurpose"],
    roro:["PCTC","Con-Ro","Ferry RoRo","Short Sea"],
  };

  // Flat list of all sea container objects
  const allSeaTypes = SEA_CONTAINERS.flatMap(g => g.types);
  const selectedContainer = mode === "sea" ? allSeaTypes.find(t => t.code === form.subtype) : null;

  const showCargoStep = needsCargoDetails(mode, form.subtype);

  const handleModeChange = (k) => { setMode(k); setForm(f=>({...f,subtype:""})); setStep(1); };

  const totalSteps = showCargoStep ? 2 : 1;

  const handleSubmit = () => onClose();

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.80)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }} onClick={onClose}>
      <div style={{ background:C.card, border:`1px solid ${mv.color}55`, borderRadius:18, padding:32, width:580, maxWidth:"94vw", maxHeight:"92vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
          <div>
            <div style={{ fontWeight:700, fontSize:18, color:C.text }}>Nieuwe Zending</div>
            {totalSteps > 1 && (
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>
                Stap {step} van {totalSteps}: {step===1?"Zending informatie":"Lading gegevens"}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:22 }}>✕</button>
        </div>

        {/* Step indicator */}
        {totalSteps > 1 && (
          <div style={{ display:"flex", gap:6, marginBottom:22, marginTop:10 }}>
            {[1,2].map(s=>(
              <div key={s} style={{ flex:1, height:3, borderRadius:2,
                background: s<=step ? mv.color : C.border, transition:"background .3s" }} />
            ))}
          </div>
        )}
        {totalSteps === 1 && <div style={{ marginBottom:22 }} />}

        {/* ── STEP 1: ZENDING INFO ── */}
        {step===1 && (
          <>
            {/* Mode selector */}
            <div style={{ marginBottom:18 }}>
              <FieldLabel>Vervoerswijze</FieldLabel>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {Object.entries(MODES).map(([k,v])=>(
                  <button key={k} onClick={()=>handleModeChange(k)}
                    style={{ padding:"8px 14px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600,
                      display:"flex", alignItems:"center", gap:5,
                      background:mode===k?v.color:C.surface, border:`1px solid ${mode===k?v.color:C.border}`,
                      color:mode===k?"#fff":C.muted }}>{v.icon} {v.label}</button>
                ))}
              </div>
            </div>

            {/* Subtype — dropdown for sea, buttons for others */}
            <div style={{ marginBottom:16 }}>
              <FieldLabel>{mode === "sea" ? "Containertype" : "Type"}</FieldLabel>

              {mode === "sea" ? (
                <>
                  <select
                    value={form.subtype}
                    onChange={e => setForm({ ...form, subtype: e.target.value })}
                    style={{ width:"100%", padding:"10px 14px", background:C.surface,
                      border:`1px solid ${form.subtype ? mv.color : C.border}`,
                      borderRadius:8, color: form.subtype ? C.text : C.muted, fontSize:14, outline:"none" }}
                  >
                    <option value="">— Selecteer containertype —</option>
                    {SEA_CONTAINERS.map(group => (
                      <optgroup key={group.group} label={`── ${group.group} ──`}>
                        {group.types.map(t => (
                          <option key={t.code} value={t.code}>
                            {t.label}{t.cargo ? "  ✦ lading vereist" : ""}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>

                  {/* Container info card */}
                  {selectedContainer && (
                    <div style={{ marginTop:10, padding:"12px 16px",
                      background: selectedContainer.cargo ? `${mv.color}10` : C.surface,
                      border:`1px solid ${selectedContainer.cargo ? mv.color+"55" : C.border}`,
                      borderRadius:10, display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
                      {[
                        ["📐 Binnenm.", selectedContainer.dims],
                        ["⚖️ Max. payload", selectedContainer.payload],
                        ["📦 Volume", selectedContainer.cbm],
                      ].map(([lbl, val]) => (
                        <div key={lbl}>
                          <div style={{ fontSize:10, color:C.muted, marginBottom:3 }}>{lbl}</div>
                          <div style={{ fontSize:12, fontWeight:600, color:C.text, fontFamily:"'Courier New',monospace" }}>{val}</div>
                        </div>
                      ))}
                      {selectedContainer.cargo && (
                        <div style={{ gridColumn:"1/-1", marginTop:4, padding:"6px 10px",
                          background:`${mv.color}18`, borderRadius:6, fontSize:11, color:mv.color, fontWeight:600 }}>
                          🚢 In stap 2 kun je gedetailleerde ladinginformatie, afmetingen en marks opgeven.
                        </div>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                    {(typesByMode[mode]||[]).map(t=>(
                      <button key={t} onClick={()=>setForm({...form,subtype:t})}
                        style={{ padding:"6px 14px", borderRadius:6, cursor:"pointer", fontSize:12, fontWeight:600,
                          background:form.subtype===t?mv.color:C.surface, border:`1px solid ${form.subtype===t?mv.color:C.border}`,
                          color:form.subtype===t?"#fff":C.muted }}>
                        {t}
                      </button>
                    ))}
                  </div>
                  {(mode==="breakbulk"||mode==="roro") && (
                    <div style={{ marginTop:8, padding:"7px 12px", background:`${mv.color}12`, border:`1px solid ${mv.color}33`, borderRadius:7, fontSize:11, color:mv.color }}>
                      {mv.icon} In stap 2 kun je gedetailleerde ladinginformatie, afmetingen en marks opgeven.
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Origin / Dest */}
            {[["Herkomst / Haven","origin","Bv. Rotterdam / Zeebrugge"],
              ["Bestemming / Haven","dest","Bv. Houston TX / Baltimore USA"],
            ].map(([label,key,ph])=>(
              <div key={key} style={{ marginBottom:14 }}>
                <FieldLabel>{label}</FieldLabel>
                <TextInput value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} placeholder={ph} />
              </div>
            ))}

            {/* Weight / volume — only show if NOT going to step 2 (where they fill it in detail) */}
            {!showCargoStep && (
              <div style={{ marginBottom:14 }}>
                <FieldLabel>Gewicht / Volume</FieldLabel>
                <TextInput value={form.weight} onChange={e=>setForm({...form,weight:e.target.value})} placeholder="Bv. 2400 kg / 40 CBM" />
              </div>
            )}

            {/* Carrier */}
            <div style={{ marginBottom:14 }}>
              <FieldLabel>Carrier</FieldLabel>
              <select value={form.carrier} onChange={e=>setForm({...form,carrier:e.target.value})}
                style={{ width:"100%", padding:"10px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:14 }}>
                <option value="">Selecteer carrier...</option>
                {(CARRIERS[mode]||[]).map(c=><option key={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:showCargoStep?8:22 }}>
              <FieldLabel>Notities</FieldLabel>
              <TextInput value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Bv. speciale behandeling, deadlines, contactpersoon..." />
            </div>

            {showCargoStep ? (
              <button onClick={()=>setStep(2)}
                style={{ width:"100%", padding:"12px 0", background:mv.color, border:"none", borderRadius:10,
                  color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", boxShadow:`0 4px 20px ${mv.glow}`,
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                Volgende: Lading gegevens →
              </button>
            ) : (
              <button onClick={handleSubmit}
                style={{ width:"100%", padding:"12px 0", background:mv.color, border:"none", borderRadius:10,
                  color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", boxShadow:`0 4px 20px ${mv.glow}` }}>
                {mv.icon} Zending Aanmaken
              </button>
            )}
          </>
        )}

        {/* ── STEP 2: LADING GEGEVENS ── */}
        {step===2 && (
          <>
            {/* Summary bar */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 16px", marginBottom:20,
              display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:18 }}>{mv.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{form.origin||"…"} → {form.dest||"…"}</div>
                <div style={{ fontSize:11, color:C.muted }}>{mv.label} • {selectedContainer ? selectedContainer.label : form.subtype||"—"} • {form.carrier||"Geen carrier"}</div>
              </div>
              <Badge label={selectedContainer ? selectedContainer.code : form.subtype||"—"} color={mv.color} />
            </div>

            <SectionDivider icon="📦" title="Lading omschrijving" color={mv.color} />
            <CargoDetailsSection cargo={cargo} setCargo={setCargo} modeColor={mv.color} />

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:20 }}>
              <button onClick={()=>setStep(1)}
                style={{ padding:"12px 0", background:"none", border:`1px solid ${C.border}`,
                  borderRadius:10, color:C.muted, fontWeight:600, fontSize:14, cursor:"pointer" }}>
                ← Terug
              </button>
              <button onClick={handleSubmit}
                style={{ padding:"12px 0", background:mv.color, border:"none",
                  borderRadius:10, color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer",
                  boxShadow:`0 4px 20px ${mv.glow}` }}>
                {mv.icon} Zending Aanmaken
              </button>
            </div>

            {/* Preview card */}
            {(cargo.description||cargo.grossWeight||cargo.marks) && (
              <div style={{ marginTop:18, background:C.surface, border:`1px solid ${mv.color}33`, borderRadius:10, padding:16 }}>
                <div style={{ fontSize:11, color:mv.color, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Lading Preview</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:12 }}>
                  {cargo.description && <div><span style={{ color:C.muted }}>Omschrijving: </span><span style={{ color:C.text }}>{cargo.description}</span></div>}
                  {cargo.qty         && <div><span style={{ color:C.muted }}>Aantal: </span><span style={{ color:C.text }}>{cargo.qty} stuks</span></div>}
                  {(cargo.length&&cargo.width&&cargo.height) && (
                    <div><span style={{ color:C.muted }}>Afm.: </span><span style={{ color:C.text, fontFamily:"monospace" }}>{cargo.length}×{cargo.width}×{cargo.height} cm</span></div>
                  )}
                  {cargo.grossWeight && <div><span style={{ color:C.muted }}>Bruto: </span><span style={{ color:C.text, fontFamily:"monospace" }}>{Number(cargo.grossWeight).toLocaleString("nl-NL")} kg</span></div>}
                  {cargo.tags?.length>0 && <div style={{ gridColumn:"1/-1" }}><span style={{ color:C.muted }}>Tags: </span>{cargo.tags.map(t=><Badge key={t} label={t} color={mv.color} />)}</div>}
                </div>
                {cargo.marks && (
                  <div style={{ marginTop:10, padding:"8px 12px", background:C.card, borderRadius:7, fontFamily:"'Courier New',monospace", fontSize:11, color:C.text, whiteSpace:"pre-wrap", borderLeft:`3px solid ${mv.color}` }}>
                    {cargo.marks}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const DashboardTab = ({ onNew }) => {
  const inTransit = ALL_SHIPMENTS.filter(s=>s.status==="In Transit").length;
  const delayed   = ALL_SHIPMENTS.filter(s=>s.status==="Delayed").length;
  const delivered = ALL_SHIPMENTS.filter(s=>s.status==="Delivered").length;
  const chartData = [
    {m:"Sep",v:148},{m:"Okt",v:162},{m:"Nov",v:189},{m:"Dec",v:210},{m:"Jan",v:176},{m:"Feb",v:198},{m:"Mrt",v:ALL_SHIPMENTS.length},
  ];
  const maxV = Math.max(...chartData.map(d=>d.v));
  return (
    <div>
      <div style={{ display:"flex", gap:14, marginBottom:20 }}>
        <KPI label="Totaal zendingen" value={ALL_SHIPMENTS.length} icon="📋" color={C.accent} trend={11} />
        <KPI label="In Transit"       value={inTransit}            icon="🔄" color={C.blue}   trend={5}  />
        <KPI label="Geleverd"         value={delivered}            icon="✅" color={C.green}  trend={8}  />
        <KPI label="Vertraagd"        value={delayed}              icon="⚠️" color={C.red}    trend={-15}/>
        <KPI label="Maandomzet"       value="€ 878K"               icon="💶" color={C.accent} trend={9}  />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:16, marginBottom:16 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Vervoersmix</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Per vervoerswijze</div>
          {Object.entries(MODES).map(([k,v])=>{
            const cnt = ALL_SHIPMENTS.filter(s=>s.mode===k).length;
            return (
              <div key={k} style={{ marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ fontSize:13, display:"flex", alignItems:"center", gap:6 }}>{v.icon} {v.label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:v.color }}>{cnt}</span>
                </div>
                <Bar val={cnt} max={ALL_SHIPMENTS.length} color={v.color} h={6} />
              </div>
            );
          })}
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Zendingen per Maand</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>Sep 2023 — Mrt 2024</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:130 }}>
            {chartData.map((d,i)=>(
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <div style={{ fontSize:10, color:C.muted }}>{d.v}</div>
                <div style={{ width:"100%",
                  background:i===chartData.length-1?`${C.accent}44`:`linear-gradient(180deg,${C.accent}DD,${C.accent}44)`,
                  borderRadius:"4px 4px 0 0", height:`${(d.v/maxV)*100}%`,
                  border:i===chartData.length-1?`1px dashed ${C.accent}`:"none" }} />
                <div style={{ fontSize:10, color:C.muted }}>{d.m}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Recente Activiteit</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ borderBottom:`1px solid ${C.border}` }}>
            {["ID","Modus","Route","Carrier","Status","ETA"].map(h=>(
              <th key={h} style={{ textAlign:"left", padding:"0 12px 10px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1 }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {ALL_SHIPMENTS.slice(0,8).map(s=>{
              const mv=MODES[s.mode];
              return (
                <tr key={s.id} style={{ borderBottom:`1px solid ${C.border}11` }}>
                  <td style={{ padding:"11px 12px", fontSize:13, fontWeight:700, color:mv.color }}>{s.id}</td>
                  <td style={{ padding:"11px 12px" }}>
                    <span style={{ fontSize:11, display:"inline-flex", alignItems:"center", gap:4, padding:"2px 8px", borderRadius:20, background:`${mv.color}18`, color:mv.color, fontWeight:600 }}>
                      {mv.icon} {mv.label}
                    </span>
                  </td>
                  <td style={{ padding:"11px 12px", fontSize:13 }}>{s.origin} → {s.dest}</td>
                  <td style={{ padding:"11px 12px", fontSize:12, color:C.muted }}>{s.carrier}</td>
                  <td style={{ padding:"11px 12px" }}><Badge label={s.status} color={statusColor(s.status)} bg={statusBg(s.status)} /></td>
                  <td style={{ padding:"11px 12px", fontSize:12, color:C.muted }}>{s.eta}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ─── DOSSIER DATA ─────────────────────────────────────────────────────────────
const DOSSIER_DETAILS = {
  "BNL-S-001": {
    created:"01 Mrt 2024", opened:true,
    shipper:    { name:"ASML Holding NV",             address:"De Run 6501, 5504 DR Veldhoven", country:"Nederland",   contact:"M. Jansen",   email:"m.jansen@asml.com",       tel:"+31 40 268 2000" },
    consignee:  { name:"Shanghai Micro Electronics",  address:"No. 385 Nanqiao Rd, Fengxian",   country:"China",       contact:"Li Wei",       email:"li.wei@smee.cn",          tel:"+86 21 6765 4321" },
    notifyParty:{ name:"Sinotrans Shanghai",          address:"88 Pudong Ave, Shanghai 200120",  country:"China" },
    incoterms:"CIF", commodity:"Semiconductor lithography equipment", hsCode:"8486.20.00",
    dg:false, specialInstructions:"Fragiel – schokvrij transport. Klimaatgecontroleerd +20°C.", reference:"PO-ASML-2024-0312", agent:"Sinotrans Shanghai (agent bestemming)",
    cargo: { pieces:3, packType:"Houten kisten", grossWeight:"4.200 kg", netWeight:"3.900 kg", volume:"18,4 m³", length:"380", width:"240", height:"220", marks:"ASML/VEL/2024-001\nSHANGHAI\nPO: ASML-0312\nFragile – This side up" },
    transport: { blNumber:"MSCU748392-01", containerNo:"MSCU7483920", vessel:"MSC Gülsün", voyage:"ME221S", etd:"10 Mrt", eta:"02 Apr", pol:"Rotterdam (RTM)", pod:"Shanghai (SHA)", booking:"MSC-BK-20240301" },
    milestones: [
      { date:"01 Mrt", event:"Dossier aangemaakt",         done:true,  note:"Nav. offerte OFF-2024-001" },
      { date:"03 Mrt", event:"Booking bevestigd",          done:true,  note:"MSC booking: MSC-BK-20240301" },
      { date:"06 Mrt", event:"Lading ontvangen in depot",  done:true,  note:"3 kisten • 4.200 kg" },
      { date:"08 Mrt", event:"Export douaneaangifte",      done:true,  note:"Vrijgegeven 08:42" },
      { date:"10 Mrt", event:"Vertrek Rotterdam (ATD)",    done:false, note:"MSC Gülsün, voyage ME221S" },
      { date:"18 Mrt", event:"Doorvoer Tanjung Pelepas",  done:false, note:"" },
      { date:"02 Apr", event:"Aankomst Shanghai (ETA)",    done:false, note:"" },
      { date:"04 Apr", event:"Import douaneaangifte",      done:false, note:"" },
      { date:"05 Apr", event:"Aflevering consignee",       done:false, note:"" },
    ],
    costs: [
      { desc:"Zeevracht FCL 40HC",       buy:2800, sell:3500, cur:"USD" },
      { desc:"Bunker surcharge (BAF)",   buy:420,  sell:550,  cur:"USD" },
      { desc:"THC Rotterdam",            buy:285,  sell:380,  cur:"EUR" },
      { desc:"Documentatie / B/L fee",   buy:65,   sell:120,  cur:"EUR" },
      { desc:"Export douaneaangifte",    buy:180,  sell:280,  cur:"EUR" },
      { desc:"Ophaalkosten Veldhoven",   buy:380,  sell:580,  cur:"EUR" },
      { desc:"Verzekering (0.15%)",      buy:125,  sell:195,  cur:"EUR" },
    ],
    documents: [
      { name:"House Bill of Lading (HBL)",   type:"Transport",   status:"Concept",     date:"05 Mrt" },
      { name:"Master Bill of Lading (MBL)",  type:"Transport",   status:"Ontvangen",   date:"06 Mrt" },
      { name:"Commercial Invoice",           type:"Handelsdoc",  status:"Ontvangen",   date:"02 Mrt" },
      { name:"Packing List",                 type:"Handelsdoc",  status:"Ontvangen",   date:"02 Mrt" },
      { name:"Certificate of Origin (EUR.1)",type:"Certificaat", status:"Aangevraagd", date:"04 Mrt" },
      { name:"Export douaneaangifte EX-A",   type:"Douane",      status:"Goedgekeurd", date:"08 Mrt" },
      { name:"VGM Certificaat",              type:"Transport",   status:"Ontvangen",   date:"06 Mrt" },
      { name:"Verzekeringsattest",           type:"Verzekering", status:"Concept",     date:"" },
    ],
    notes: [
      { date:"05 Mrt", user:"J. Vermeer", text:"Klant bevestigt kisten op 6 maart klaar voor ophalen. Chauffeur geboekt 07:00u." },
      { date:"03 Mrt", user:"M. de Boer", text:"MSC booking bevestigd. BL draft ontvangen van rederij ter controle." },
      { date:"01 Mrt", user:"J. Vermeer", text:"Dossier aangemaakt nav. gewonnen offerte ASML / OFF-2024-001." },
    ],
  },
};

// Auto-generate skeleton dossiers for remaining shipments
(function(){
  const incoOpts = ["EXW","FOB","CFR","CIF","DAP","DDP"];
  const packTypes = ["Pallets","Houten kisten","Kartons","Colli","IBC containers","Bigbags"];
  ALL_SHIPMENTS.forEach((s,i) => {
    if (DOSSIER_DETAILS[s.id]) return;
    DOSSIER_DETAILS[s.id] = {
      created:"01 Mrt 2024", opened:true,
      shipper:   { name:`Shipper ${s.id}`, address:"Industrieweg 1, Rotterdam", country:"Nederland", contact:"Jan de Vries", email:"jdevries@shipper.nl", tel:"+31 10 123 4567" },
      consignee: { name:`Consignee ${s.id}`, address:"Main St 100, "+s.dest, country:"Zie bestemming", contact:"John Smith", email:"j.smith@consignee.com", tel:"+1 555 123 456" },
      notifyParty:{ name:"Same as consignee", address:"", country:"" },
      incoterms: incoOpts[i%6], commodity: s.extra||"General cargo", hsCode:"", dg: s.extra?.includes("gevaarlijk")||false,
      specialInstructions: s.extra||"",
      reference:`REF-${s.id}`, agent:"",
      cargo:{ pieces: Math.ceil(Math.random()*20)+1, packType: packTypes[i%6], grossWeight:s.weight, netWeight:"", volume:"", length:"", width:"", height:"", marks:`BNL/${s.id}\n${s.origin.toUpperCase()} → ${s.dest.toUpperCase()}\nC/No. 1-UP` },
      transport:{ blNumber:"", containerNo:"", vessel:"", voyage:"", etd:"", eta:s.eta, pol:s.origin, pod:s.dest, booking:"" },
      milestones:[
        { date:"01 Mrt", event:"Dossier aangemaakt",      done:true,             note:"" },
        { date:"02 Mrt", event:"Booking bevestigd",       done:s.progress>0,     note:"" },
        { date:"03 Mrt", event:"Lading ontvangen",        done:s.progress>20,    note:"" },
        { date:"04 Mrt", event:"Douaneformaliteiten",     done:s.progress>35,    note:"" },
        { date:"05 Mrt", event:"Vertrek",                 done:s.progress>50,    note:"" },
        { date:s.eta,    event:"Aankomst bestemming",     done:s.status==="Delivered", note:"" },
        { date:"",       event:"Aflevering",              done:s.status==="Delivered", note:"" },
      ],
      costs:[
        { desc:"Vrachtkosten",           buy:0, sell:0, cur:"EUR" },
        { desc:"Documentatiekosten",     buy:65, sell:120, cur:"EUR" },
        { desc:"Lokale kosten",          buy:0, sell:0, cur:"EUR" },
      ],
      documents:[
        { name:"Transport Document",     type:"Transport",  status: s.progress>30?"Afgegeven":"Concept", date:"" },
        { name:"Commercial Invoice",     type:"Handelsdoc", status:"Ontvangen",  date:"" },
        { name:"Packing List",           type:"Handelsdoc", status:"Ontvangen",  date:"" },
        { name:"Douaneaangifte",         type:"Douane",     status: s.progress>35?"Goedgekeurd":"Aangevraagd", date:"" },
      ],
      notes:[],
    };
  });
})();

const docStatusColor = s => ({ "Ontvangen":C.green,"Goedgekeurd":C.green,"Afgegeven":C.green,"Concept":C.yellow,"Aangevraagd":C.cyan,"Ontbreekt":C.red }[s]||C.muted);
const docStatusBg    = s => ({ "Ontvangen":"rgba(34,197,94,.12)","Goedgekeurd":"rgba(34,197,94,.12)","Afgegeven":"rgba(34,197,94,.12)","Concept":"rgba(234,179,8,.12)","Aangevraagd":"rgba(0,194,224,.12)","Ontbreekt":"rgba(239,68,68,.12)" }[s]||"rgba(90,106,136,.12)");

// ─── DOSSIER DETAIL PANEL ─────────────────────────────────────────────────────
const DossierPanel = ({ shipment, onClose }) => {
  const [tab, setTab] = useState("algemeen");
  const mv = MODES[shipment.mode];
  const d  = DOSSIER_DETAILS[shipment.id] || {};

  const tabs = [
    { id:"algemeen",   label:"Algemeen",   icon:"📋" },
    { id:"cargo",      label:"Cargo",      icon:"📦" },
    { id:"transport",  label:"Transport",  icon:mv.icon },
    { id:"milestones", label:"Milestones", icon:"📍" },
    { id:"kosten",     label:"Kostenblad", icon:"💶" },
    { id:"documenten", label:"Documenten", icon:"🗂" },
    { id:"notities",   label:"Notities",   icon:"💬" },
  ];

  const totalBuy  = (d.costs||[]).reduce((a,c)=>a+c.buy,0);
  const totalSell = (d.costs||[]).reduce((a,c)=>a+c.sell,0);
  const margin    = totalSell - totalBuy;
  const marginPct = totalSell ? Math.round((margin/totalSell)*100) : 0;

  const SL = ({ label, value, mono, accent }) => (
    <div style={{ marginBottom:12 }}>
      <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>{label}</div>
      <div style={{ fontSize:13, fontWeight:accent?700:400, color:accent?mv.color:C.text, fontFamily:mono?"'Courier New',monospace":"inherit" }}>{value||"—"}</div>
    </div>
  );

  const Party = ({ title, data }) => (
    <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:12 }}>
      <div style={{ fontSize:11, fontWeight:700, color:mv.color, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>{title}</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
        <SL label="Naam"     value={data?.name}    />
        <SL label="Land"     value={data?.country} />
        <SL label="Adres"    value={data?.address} />
        <SL label="Contact"  value={data?.contact} />
        <SL label="E-mail"   value={data?.email}   />
        <SL label="Telefoon" value={data?.tel}     />
      </div>
    </div>
  );

  return (
    <div style={{ position:"fixed", top:0, right:0, bottom:0, width:760, background:C.card,
      borderLeft:`1px solid ${mv.color}55`, zIndex:900, display:"flex", flexDirection:"column",
      boxShadow:`-8px 0 40px rgba(0,0,0,.5)` }}>
      {/* Header */}
      <div style={{ padding:"18px 24px", borderBottom:`1px solid ${C.border}`, flexShrink:0,
        background:`linear-gradient(135deg,${C.surface},${C.card})` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
              <span style={{ fontSize:22, fontWeight:900, color:mv.color }}>{shipment.id}</span>
              <Badge label={shipment.status} color={statusColor(shipment.status)} bg={statusBg(shipment.status)} />
              <Badge label={shipment.type} color={mv.color} />
              {d.dg && <Badge label="⚠ DG" color={C.red} bg="rgba(239,68,68,.12)" />}
            </div>
            <div style={{ fontSize:13, color:C.muted }}>{mv.icon} {mv.label} • {shipment.origin} → {shipment.dest} • {shipment.carrier}</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>Aangemaakt: {d.created||"—"} • Ref: {d.reference||"—"} • Incoterms: <span style={{ color:mv.color, fontWeight:700 }}>{d.incoterms||"—"}</span></div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:`1px solid ${C.border}`, color:C.muted, cursor:"pointer", fontSize:18, borderRadius:8, padding:"4px 10px" }}>✕</button>
        </div>
        {/* Progress */}
        <div style={{ marginTop:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:11, color:C.muted }}>Dossier voortgang</span>
            <span style={{ fontSize:11, fontWeight:700, color:mv.color }}>{shipment.progress}%</span>
          </div>
          <Bar val={shipment.progress} color={mv.color} h={6} />
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display:"flex", borderBottom:`1px solid ${C.border}`, flexShrink:0, overflowX:"auto" }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{ display:"flex", alignItems:"center", gap:5, padding:"11px 16px", cursor:"pointer",
              background:"none", border:"none", whiteSpace:"nowrap",
              color: tab===t.id ? mv.color : C.muted, fontWeight: tab===t.id ? 700 : 400, fontSize:12,
              borderBottom: tab===t.id ? `2px solid ${mv.color}` : "2px solid transparent", marginBottom:-1 }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 24px" }}>

        {/* ── ALGEMEEN ── */}
        {tab==="algemeen" && (
          <div>
            <Party title="Shipper / Afzender" data={d.shipper} />
            <Party title="Consignee / Ontvanger" data={d.consignee} />
            <Party title="Notify Party" data={d.notifyParty} />
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:mv.color, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Dossier Details</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0 16px" }}>
                <SL label="Incoterms"    value={d.incoterms}  accent />
                <SL label="HS Code"      value={d.hsCode}     mono />
                <SL label="Commodity"    value={d.commodity}  />
                <SL label="Referentie"   value={d.reference}  mono />
                <SL label="Agent bestemming" value={d.agent} />
                <SL label="Gevaarlijke stoffen" value={d.dg?"Ja – zie DG declaratie":"Nee"} />
              </div>
              {d.specialInstructions && (
                <div style={{ marginTop:8, padding:"10px 14px", background:`${mv.color}0A`, border:`1px solid ${mv.color}33`, borderRadius:8 }}>
                  <div style={{ fontSize:10, color:mv.color, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Bijzondere instructies</div>
                  <div style={{ fontSize:13, color:C.text }}>{d.specialInstructions}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CARGO ── */}
        {tab==="cargo" && (
          <div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:mv.color, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Ladinginformatie</div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0 16px" }}>
                <SL label="Aantal colli"   value={d.cargo?.pieces} />
                <SL label="Verpakkingstype" value={d.cargo?.packType} />
                <SL label="Commodity"      value={d.commodity} />
                <SL label="Brutogewicht"   value={d.cargo?.grossWeight} accent />
                <SL label="Nettogewicht"   value={d.cargo?.netWeight} />
                <SL label="Volume"         value={d.cargo?.volume} accent />
              </div>
              {(d.cargo?.length||d.cargo?.width||d.cargo?.height) && (
                <div style={{ marginTop:8 }}>
                  <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Afmetingen (L × B × H)</div>
                  <div style={{ fontSize:13, fontFamily:"'Courier New',monospace", color:C.text }}>
                    {d.cargo.length||"—"} × {d.cargo.width||"—"} × {d.cargo.height||"—"} cm
                    {d.cargo.length&&d.cargo.width&&d.cargo.height && <span style={{ color:C.muted, marginLeft:8 }}>= {((+d.cargo.length||0)*(+d.cargo.width||0)*(+d.cargo.height||0)/1000000).toFixed(2)} m³</span>}
                  </div>
                </div>
              )}
            </div>
            {d.cargo?.marks && (
              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
                <div style={{ fontSize:11, fontWeight:700, color:mv.color, textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Marks &amp; Numbers</div>
                <pre style={{ fontFamily:"'Courier New',monospace", fontSize:12, color:C.text, lineHeight:1.8, background:C.card, padding:"12px 16px", borderRadius:8, borderLeft:`3px solid ${mv.color}`, margin:0, whiteSpace:"pre-wrap" }}>{d.cargo.marks}</pre>
              </div>
            )}
          </div>
        )}

        {/* ── TRANSPORT ── */}
        {tab==="transport" && (
          <div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:16, marginBottom:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:mv.color, textTransform:"uppercase", letterSpacing:1, marginBottom:12 }}>Transport Details</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px" }}>
                <SL label="Booking referentie"       value={d.transport?.booking}     mono accent />
                <SL label={shipment.mode==="air"?"AWB nummer":"B/L nummer"} value={d.transport?.blNumber} mono accent />
                <SL label={shipment.mode==="air"?"Vlucht":"Containernummer"}  value={d.transport?.containerNo||d.transport?.vessel} mono />
                <SL label={shipment.mode==="air"?"Airline":"Rederij"}         value={shipment.carrier} />
                <SL label={shipment.mode==="air"?"Vlucht nr.":"Voyage"}       value={d.transport?.voyage} mono />
                <SL label="ETD" value={d.transport?.etd} />
                <SL label="ETA" value={d.transport?.eta} accent />
                <SL label="Laadplaats (POL)" value={d.transport?.pol} />
                <SL label="Losplaats (POD)"  value={d.transport?.pod} />
              </div>
            </div>
            {/* Routing visual */}
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:20 }}>
              <div style={{ fontSize:11, fontWeight:700, color:mv.color, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Route</div>
              <div style={{ display:"flex", alignItems:"center", gap:0 }}>
                {[
                  { loc:d.transport?.pol||shipment.origin, label:"Laadplaats", done:shipment.progress>0 },
                  { loc:"Transit", label:"Onderweg", done:shipment.progress>50 },
                  { loc:d.transport?.pod||shipment.dest, label:"Losplaats", done:shipment.status==="Delivered" },
                ].map((stop,i,arr)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", flex:i<arr.length-1?1:0 }}>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ width:36, height:36, borderRadius:"50%", background:stop.done?mv.color:C.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, margin:"0 auto 6px" }}>{stop.done?"✓":mv.icon}</div>
                      <div style={{ fontSize:12, fontWeight:600, color:stop.done?mv.color:C.muted, whiteSpace:"nowrap" }}>{stop.loc}</div>
                      <div style={{ fontSize:9, color:C.muted, marginTop:2 }}>{stop.label}</div>
                    </div>
                    {i<arr.length-1 && (
                      <div style={{ flex:1, height:3, background:stop.done?mv.color:C.border, margin:"0 8px", marginBottom:18, borderRadius:2 }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── MILESTONES ── */}
        {tab==="milestones" && (
          <div>
            <div style={{ position:"relative", paddingLeft:24 }}>
              <div style={{ position:"absolute", left:10, top:0, bottom:0, width:2, background:C.border }} />
              {(d.milestones||[]).map((m,i)=>(
                <div key={i} style={{ position:"relative", marginBottom:20, paddingLeft:16 }}>
                  <div style={{ position:"absolute", left:-20, top:3, width:16, height:16, borderRadius:"50%",
                    background: m.done ? mv.color : C.card, border:`2px solid ${m.done?mv.color:C.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:8, color:"#fff", zIndex:1 }}>
                    {m.done?"✓":""}
                  </div>
                  <div style={{ background:C.surface, border:`1px solid ${m.done?mv.color+"44":C.border}`, borderRadius:10, padding:"12px 16px", opacity:m.done?1:.6 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div style={{ fontWeight:600, fontSize:13, color:m.done?C.text:C.muted }}>{m.event}</div>
                      {m.date && <div style={{ fontSize:11, color:m.done?mv.color:C.muted, fontWeight:m.done?700:400 }}>{m.date}</div>}
                    </div>
                    {m.note && <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>{m.note}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── KOSTENBLAD ── */}
        {tab==="kosten" && (
          <div>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, overflow:"hidden", marginBottom:12 }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ background:C.card }}>
                  {["Omschrijving","Inkoopprijs","Verkoopprijs","Marge","Valuta"].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"11px 14px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, borderBottom:`1px solid ${C.border}` }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {(d.costs||[]).map((c,i)=>{
                    const m = c.sell - c.buy;
                    const mPct = c.sell ? Math.round((m/c.sell)*100) : 0;
                    return (
                      <tr key={i} style={{ borderBottom:`1px solid ${C.border}22` }}>
                        <td style={{ padding:"11px 14px", fontSize:13 }}>{c.desc}</td>
                        <td style={{ padding:"11px 14px", fontSize:13, color:C.red  }}>{c.buy ? fmt(c.buy) : "—"}</td>
                        <td style={{ padding:"11px 14px", fontSize:13, color:C.green}}>{c.sell? fmt(c.sell): "—"}</td>
                        <td style={{ padding:"11px 14px", fontSize:13 }}>
                          {c.sell&&c.buy ? <span style={{ color:mPct>20?C.green:mPct>10?C.yellow:C.red, fontWeight:700 }}>{fmt(m)} <span style={{ fontSize:10 }}>({mPct}%)</span></span> : "—"}
                        </td>
                        <td style={{ padding:"11px 14px", fontSize:11, color:C.muted }}>{c.cur}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Totals */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
              {[["Totaal inkoop", fmt(totalBuy), C.red],["Totaal verkoop", fmt(totalSell), C.green],["Bruto marge", `${fmt(margin)} (${marginPct}%)`, marginPct>20?C.green:marginPct>10?C.yellow:C.red]].map(([l,v,col])=>(
                <div key={l} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 18px" }}>
                  <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{l}</div>
                  <div style={{ fontSize:18, fontWeight:800, color:col }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── DOCUMENTEN ── */}
        {tab==="documenten" && (
          <div>
            <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:14, gap:8 }}>
              <button style={{ padding:"7px 16px", background:mv.color, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>+ Document uploaden</button>
              <button style={{ padding:"7px 16px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, fontWeight:600, fontSize:12, cursor:"pointer" }}>⬇ Alles downloaden</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(d.documents||[]).map((doc,i)=>(
                <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 16px",
                  display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:8, background:`${mv.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>📄</div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{doc.name}</div>
                      <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{doc.type}{doc.date ? " • " + doc.date : ""}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <Badge label={doc.status} color={docStatusColor(doc.status)} bg={docStatusBg(doc.status)} />
                    <div style={{ display:"flex", gap:5 }}>
                      {(doc.status==="Ontvangen"||doc.status==="Goedgekeurd"||doc.status==="Afgegeven") && (
                        <button style={{ padding:"3px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:5, fontSize:11, color:C.muted, cursor:"pointer" }}>PDF</button>
                      )}
                      {doc.status==="Concept" && (
                        <button style={{ padding:"3px 10px", background:mv.color, border:"none", borderRadius:5, fontSize:11, color:"#fff", fontWeight:600, cursor:"pointer" }}>Genereren</button>
                      )}
                      {doc.status==="Aangevraagd" && (
                        <button style={{ padding:"3px 10px", background:C.cyan, border:"none", borderRadius:5, fontSize:11, color:"#000", fontWeight:600, cursor:"pointer" }}>Upload</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── NOTITIES ── */}
        {tab==="notities" && (
          <div>
            <div style={{ marginBottom:16 }}>
              <textarea placeholder="Nieuwe notitie toevoegen..." rows={3}
                style={{ width:"100%", padding:"12px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:13, outline:"none", resize:"vertical", boxSizing:"border-box" }} />
              <button style={{ marginTop:8, padding:"8px 18px", background:mv.color, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>Notitie opslaan</button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(d.notes||[]).map((n,i)=>(
                <div key={i} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:16 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <div style={{ width:26, height:26, borderRadius:"50%", background:`linear-gradient(135deg,${mv.color},${C.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff" }}>
                        {n.user.split(" ").map(x=>x[0]).join("")}
                      </div>
                      <span style={{ fontWeight:600, fontSize:13 }}>{n.user}</span>
                    </div>
                    <span style={{ fontSize:11, color:C.muted }}>{n.date}</span>
                  </div>
                  <div style={{ fontSize:13, color:C.muted, paddingLeft:34 }}>{n.text}</div>
                </div>
              ))}
              {!(d.notes||[]).length && <div style={{ textAlign:"center", padding:40, color:C.muted }}>Nog geen notities voor dit dossier.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── TARIEVEN MODULE ──────────────────────────────────────────────────────────
const RATE_DATA = {
  sea: [
    { carrier:"Maersk",      pol:"Rotterdam",  pod:"Shanghai",    transit:"28 dgn", containerType:"40HC", buy:2200, sell:2950, valid:"31 Mrt", service:"AE-1", remarks:"Direct" },
    { carrier:"MSC",         pol:"Rotterdam",  pod:"Shanghai",    transit:"30 dgn", containerType:"40HC", buy:2050, sell:2750, valid:"31 Mrt", service:"Griffin", remarks:"Via Singapore" },
    { carrier:"Hapag-Lloyd", pol:"Rotterdam",  pod:"Shanghai",    transit:"27 dgn", containerType:"40HC", buy:2400, sell:3100, valid:"31 Mrt", service:"FAL1",  remarks:"Direct, premium" },
    { carrier:"CMA CGM",     pol:"Rotterdam",  pod:"Shanghai",    transit:"31 dgn", containerType:"40HC", buy:1980, sell:2600, valid:"15 Apr", service:"FAL3",  remarks:"Via Algeciras" },
    { carrier:"Maersk",      pol:"Antwerpen",  pod:"New York",    transit:"14 dgn", containerType:"20DC", buy:1100, sell:1550, valid:"30 Mrt", service:"TP1",   remarks:"Direct" },
    { carrier:"Hapag-Lloyd", pol:"Antwerpen",  pod:"New York",    transit:"13 dgn", containerType:"20DC", buy:1200, sell:1680, valid:"30 Mrt", service:"AL5",   remarks:"Direct, fast" },
    { carrier:"MSC",         pol:"Rotterdam",  pod:"Singapore",   transit:"22 dgn", containerType:"40DC", buy:1450, sell:1950, valid:"31 Mrt", service:"Shogun", remarks:"Via Port Klang" },
    { carrier:"Evergreen",   pol:"Rotterdam",  pod:"Los Angeles", transit:"26 dgn", containerType:"40HC", buy:2100, sell:2800, valid:"15 Apr", service:"AEX",   remarks:"Via Panama" },
    { carrier:"MSC",         pol:"Rotterdam",  pod:"Dubai",       transit:"18 dgn", containerType:"20DC", buy:850,  sell:1200, valid:"31 Mrt", service:"Silk",  remarks:"Via Malta" },
  ],
  air: [
    { carrier:"KLM Cargo",          pol:"AMS",  pod:"Dubai (DXB)",    transit:"Dezelfde dag", containerType:"General", buy:1.80, sell:2.80, valid:"31 Mrt", service:"KL0571", remarks:"Dagelijkse vlucht" },
    { carrier:"Emirates SkyCargo",  pol:"AMS",  pod:"Dubai (DXB)",    transit:"Dezelfde dag", containerType:"General", buy:1.65, sell:2.55, valid:"31 Mrt", service:"EK0148", remarks:"Via Amsterdam hub" },
    { carrier:"KLM Cargo",          pol:"AMS",  pod:"Hong Kong (HKG)",transit:"1 dag",        containerType:"General", buy:2.40, sell:3.60, valid:"31 Mrt", service:"KL0887", remarks:"Direct" },
    { carrier:"Cargolux",           pol:"AMS",  pod:"Hong Kong (HKG)",transit:"1 dag",        containerType:"DG",      buy:2.20, sell:3.40, valid:"31 Mrt", service:"CV9432", remarks:"DG specialist" },
    { carrier:"DHL Aviation",       pol:"AMS",  pod:"Chicago (ORD)",  transit:"1 dag",        containerType:"Express", buy:4.80, sell:6.20, valid:"31 Mrt", service:"D-EXP",  remarks:"Overnight express" },
    { carrier:"Air France Cargo",   pol:"AMS",  pod:"Tokyo (NRT)",    transit:"1 dag",        containerType:"General", buy:2.90, sell:4.10, valid:"15 Apr", service:"AF0274", remarks:"Via Paris CDG" },
    { carrier:"Korean Air Cargo",   pol:"AMS",  pod:"Seoul (ICN)",    transit:"1 dag",        containerType:"General", buy:2.70, sell:3.90, valid:"31 Mrt", service:"KE0951", remarks:"Direct" },
  ],
};

// ─── LEVERANCIERSOFFERTES INBOX DATA ─────────────────────────────────────────
const SUPPLIER_QUOTES_INBOX = [
  {
    id:"SQ-001", carrier:"Maersk Line", source:"email", from:"rates.nl@maersk.com",
    subject:"Rate Offer – RTM/SHA – April 2024", received:"05 Mrt 07:44", mode:"sea",
    status:"Nieuw", priority:"Hoog",
    extracted:{
      pol:"Rotterdam", pod:"Shanghai", containerType:"40HC", transit:"27 dgn",
      service:"AE-1/Shogun", validFrom:"01 Apr", validTo:"30 Apr",
      charges:[
        { name:"Ocean Freight",    amount:2650, cur:"USD", per:"container" },
        { name:"BAF (Bunker)",     amount:380,  cur:"USD", per:"container" },
        { name:"CAF",              amount:95,   cur:"USD", per:"container" },
        { name:"THC Rotterdam",    amount:295,  cur:"EUR", per:"container" },
        { name:"THC Shanghai",     amount:245,  cur:"USD", per:"container" },
        { name:"B/L Fee",          amount:55,   cur:"EUR", per:"document"  },
      ],
      confidence:{ pol:99, pod:99, carrier:99, charges:94, validity:97, transit:92 },
      raw:"MAERSK RATE OFFER\n\nFrom: Rotterdam (RTM)\nTo: Shanghai (CNSHA)\n40HC - USD 2,650/container\nBAF: USD 380 | CAF: USD 95\nTHC RTM: EUR 295 | THC SHA: USD 245\nB/L Fee: EUR 55\nService: AE-1 connecting Shogun\nValidity: 01 April – 30 April 2024\nTransit: 27 days (direct)\n\nPlease confirm booking within 5 working days.",
    },
    existingRate:{ buy:2200, service:"AE-1", valid:"31 Mrt" },
    notes:"",
  },
  {
    id:"SQ-002", carrier:"KLM Cargo", source:"email", from:"cargo.rates@klm.com",
    subject:"Air Rate Update AMS-DXB-HKG Q2", received:"04 Mrt 15:22", mode:"air",
    status:"Nieuw", priority:"Normaal",
    extracted:{
      pol:"Amsterdam (AMS)", pod:"Dubai (DXB)", containerType:"General", transit:"Dezelfde dag",
      service:"KL0571", validFrom:"01 Apr", validTo:"30 Jun",
      charges:[
        { name:"Air Freight",      amount:1.72, cur:"EUR", per:"kg" },
        { name:"Fuel Surcharge",   amount:0.38, cur:"EUR", per:"kg" },
        { name:"Security Surcharge",amount:0.12,cur:"EUR", per:"kg" },
        { name:"AWB Fee",          amount:25,   cur:"EUR", per:"document" },
      ],
      confidence:{ pol:98, pod:98, carrier:99, charges:91, validity:99, transit:95 },
      raw:"KLM CARGO RATE OFFER\n\nOrigin: Amsterdam Schiphol (AMS)\nDest: Dubai (DXB)\nRate: EUR 1.72/kg + EUR 0.38 FSC + EUR 0.12 SSC\nAWB: EUR 25/document\nFlight: KL0571 – Daily\nValidity: Q2 2024 (01 Apr – 30 Jun)\n\nMinimum chargeable weight: 45 kg\nDimensional factor: 1:6000",
    },
    existingRate:{ buy:1.80, service:"KL0571", valid:"31 Mrt" },
    notes:"",
  },
  {
    id:"SQ-003", carrier:"MSC", source:"pdf", from:"Bijlage: MSC_RateSheet_Q2_2024.pdf",
    subject:"MSC Rate Sheet Q2 2024 – RTM/ANT routes", received:"03 Mrt 11:05", mode:"sea",
    status:"Beoordeeld", priority:"Normaal",
    extracted:{
      pol:"Rotterdam", pod:"New York", containerType:"20DC", transit:"14 dgn",
      service:"TP3", validFrom:"01 Apr", validTo:"30 Jun",
      charges:[
        { name:"Ocean Freight",    amount:980,  cur:"USD", per:"container" },
        { name:"BAF",              amount:210,  cur:"USD", per:"container" },
        { name:"THC Rotterdam",    amount:285,  cur:"EUR", per:"container" },
        { name:"THC New York",     amount:315,  cur:"USD", per:"container" },
        { name:"B/L Fee",          amount:50,   cur:"EUR", per:"document"  },
        { name:"ISF Filing",       amount:35,   cur:"USD", per:"document"  },
      ],
      confidence:{ pol:97, pod:99, carrier:98, charges:88, validity:95, transit:90 },
      raw:"MSC RATE SHEET Q2 2024\n\nMultiple routes – see below.\n\nRTM → USNWK (New York)\n20DC: USD 980 + BAF USD 210\nTHC RTM EUR 285 | THC NYK USD 315\nService: TP3 | Transit: 14 days\nB/L EUR 50 | ISF USD 35\nValidity: Q2 2024",
    },
    existingRate:{ buy:1100, service:"TP1", valid:"30 Mrt" },
    notes:"Betere prijs dan huidig contract. Goedkeuring vereist.",
  },
  {
    id:"SQ-004", carrier:"Hapag-Lloyd", source:"email", from:"pricing-benelux@hapag-lloyd.com",
    subject:"Spot rate offer – RTM/SHA 40HC – geldig 1 week",
    received:"05 Mrt 09:01", mode:"sea",
    status:"Nieuw", priority:"Hoog",
    extracted:{
      pol:"Rotterdam", pod:"Shanghai", containerType:"40HC", transit:"28 dgn",
      service:"FAL1", validFrom:"10 Mrt", validTo:"17 Mrt",
      charges:[
        { name:"Ocean Freight (SPOT)", amount:2480, cur:"USD", per:"container" },
        { name:"BAF",                  amount:360,  cur:"USD", per:"container" },
        { name:"THC Rotterdam",        amount:295,  cur:"EUR", per:"container" },
        { name:"B/L Fee",              amount:60,   cur:"EUR", per:"document"  },
      ],
      confidence:{ pol:99, pod:99, carrier:99, charges:96, validity:98, transit:94 },
      raw:"HAPAG-LLOYD SPOT OFFER\n\nRoute: RTM → SHA\n40HC SPOT: USD 2,480/box\nBAF USD 360 | THC EUR 295 | B/L EUR 60\nService FAL1 – Direct, 28 days\nVALID ONLY 10-17 March 2024\nPLEASE RESPOND URGENTLY",
    },
    existingRate:{ buy:2400, service:"FAL1", valid:"31 Mrt" },
    notes:"",
  },
];

const TarievenTab = () => {
  const [sub,     setSub]     = useState("zoeken");
  const [mode,    setMode]    = useState("sea");
  const [pol,     setPol]     = useState("");
  const [pod,     setPod]     = useState("");
  const [contType,setContType]= useState("");
  const [sortBy,  setSortBy]  = useState("sell");
  const [compare, setCompare] = useState([]);

  // Offertes inlezen state
  const [inboxFilter,    setInboxFilter]    = useState("Alle");
  const [reviewItem,     setReviewItem]     = useState(null);
  const [scanStep,       setScanStep]       = useState(0); // 0=idle 1=scanning 2=done
  const [scanProgress,   setScanProgress]   = useState(0);
  const [editCharges,    setEditCharges]    = useState(null);
  const [approvedItems,  setApprovedItems]  = useState([]);
  const [savedToRates,   setSavedToRates]   = useState([]);

  const mv = MODES[mode==="sea"?"sea":"air"];
  const rates = (RATE_DATA[mode]||[]).filter(r=>
    (!pol || r.pol.toLowerCase().includes(pol.toLowerCase())) &&
    (!pod || r.pod.toLowerCase().includes(pod.toLowerCase())) &&
    (!contType || r.containerType===contType)
  ).sort((a,b)=> sortBy==="sell" ? a.sell-b.sell : 0);

  const unitLabel = mode==="sea" ? "/TEU (USD)" : "/kg (EUR)";
  const toggleCompare = r => setCompare(prev => prev.includes(r.carrier+r.pol+r.pod) ? prev.filter(x=>x!==r.carrier+r.pol+r.pod) : prev.length<3?[...prev,r.carrier+r.pol+r.pod]:prev);

  const newCount = SUPPLIER_QUOTES_INBOX.filter(q=>q.status==="Nieuw").length;

  const startScan = () => {
    setScanStep(1); setScanProgress(0);
    let p=0; const iv=setInterval(()=>{ p+=Math.random()*18+5; if(p>=100){p=100;clearInterval(iv);setScanStep(2);} setScanProgress(Math.min(p,100)); },200);
  };

  const handleApprove = (item) => {
    setApprovedItems(prev=>[...prev, item.id]);
    setSavedToRates(prev=>[...prev, item.id]);
    setReviewItem(null);
  };

  const ScanSteps = [
    "Document verwerken…",
    "Tekst extraheren (OCR)…",
    "Carrier & route detecteren…",
    "Vrachttarieven identificeren…",
    "Toeslagen & surcharges…",
    "Geldigheidsperiode lezen…",
    "Kwaliteitscontrole…",
    "Klaar ✓",
  ];

  const inboxData = SUPPLIER_QUOTES_INBOX.filter(q=>inboxFilter==="Alle"||q.status===inboxFilter);

  const subTabs = [
    { id:"zoeken",  label:"Zoeken & Vergelijken", icon:"🔍" },
    { id:"inlezen", label:"Offertes Inlezen",     icon:"📥", badge: newCount },
    { id:"contracten", label:"Contracten",        icon:"📑" },
  ];

  return (
    <div>
      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:24, borderBottom:`1px solid ${C.border}` }}>
        {subTabs.map(t=>(
          <button key={t.id} onClick={()=>setSub(t.id)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 18px", cursor:"pointer", background:"none", border:"none", fontSize:13, fontWeight:600,
              color: sub===t.id ? C.blue : C.muted,
              borderBottom: sub===t.id ? `2px solid ${C.blue}` : "2px solid transparent", marginBottom:-1 }}>
            {t.icon} {t.label}
            {t.badge>0 && <span style={{ background:C.accent, color:"#fff", padding:"1px 6px", borderRadius:10, fontSize:10, fontWeight:700 }}>{t.badge}</span>}
          </button>
        ))}
      </div>

      {/* ── ZOEKEN & VERGELIJKEN ── */}
      {sub==="zoeken" && (
        <div>
          <div style={{ display:"flex", gap:10, marginBottom:24, alignItems:"center" }}>
            {[["sea","🚢 Zeevracht"],["air","✈️ Luchtvracht"]].map(([k,l])=>(
              <button key={k} onClick={()=>{setMode(k);setCompare([]);}}
                style={{ padding:"9px 20px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
                  background:mode===k?(k==="sea"?C.blue:C.cyan):C.card,
                  border:`1px solid ${mode===k?(k==="sea"?C.blue:C.cyan):C.border}`,
                  color:mode===k?(k==="air"?"#000":"#fff"):C.muted }}>{l}</button>
            ))}
            <div style={{ flex:1 }} />
            <div style={{ display:"flex", alignItems:"center", gap:6, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"6px 12px" }}>
              <span style={{ fontSize:12, color:C.muted }}>Sorteren:</span>
              {[["sell","Laagste prijs"],["transit","Snelste"]].map(([v,l])=>(
                <button key={v} onClick={()=>setSortBy(v)}
                  style={{ padding:"4px 10px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12,
                    background:sortBy===v?mv.color:"transparent", color:sortBy===v?(mode==="air"?"#000":"#fff"):C.muted, fontWeight:sortBy===v?700:400 }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ background:C.card, border:`1px solid ${mv.color}44`, borderRadius:12, padding:20, marginBottom:20, display:"flex", gap:12, alignItems:"flex-end" }}>
            {[["Laadplaats (POL)","Bv. Rotterdam",pol,setPol],["Losplaats (POD)","Bv. Shanghai",pod,setPod]].map(([lbl,ph,val,set])=>(
              <div key={lbl} style={{ flex:1 }}>
                <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{lbl}</div>
                <input value={val} onChange={e=>set(e.target.value)} placeholder={ph}
                  style={{ width:"100%", padding:"9px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, outline:"none", boxSizing:"border-box" }} />
              </div>
            ))}
            {mode==="sea" && (
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Container</div>
                <select value={contType} onChange={e=>setContType(e.target.value)}
                  style={{ width:"100%", padding:"9px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13 }}>
                  <option value="">Alle types</option>
                  {["20DC","40DC","40HC","LCL"].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
            )}
            <button style={{ padding:"10px 24px", background:mv.color, border:"none", borderRadius:8, color:mode==="air"?"#000":"#fff", fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap" }}>🔍 Zoek</button>
          </div>
          {compare.length>0 && (
            <div style={{ background:`${mv.color}12`, border:`1px solid ${mv.color}44`, borderRadius:10, padding:"10px 16px", marginBottom:14, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:12, color:mv.color, fontWeight:700 }}>Vergelijking: {compare.length}/3</span>
              {compare.map(k=><Badge key={k} label={k.substring(0,20)} color={mv.color} />)}
              <button onClick={()=>setCompare([])} style={{ marginLeft:"auto", padding:"3px 10px", background:"none", border:`1px solid ${mv.color}44`, borderRadius:6, color:mv.color, fontSize:11, cursor:"pointer" }}>Wis</button>
              <button style={{ padding:"5px 14px", background:mv.color, border:"none", borderRadius:7, color:mode==="air"?"#000":"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>Vergelijk →</button>
            </div>
          )}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:C.surface }}>
                {["","Carrier","POL → POD","Service",mode==="sea"?"Type":"Type","Transit",`Inkoop ${unitLabel}`,`Verkoop ${unitLabel}`,"Marge","Geldig tot",""].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"12px 12px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {rates.map((r,i)=>{
                  const m=r.sell-r.buy; const mPct=Math.round((m/r.sell)*100);
                  const key=r.carrier+r.pol+r.pod; const isCmp=compare.includes(key);
                  const isSaved = savedToRates.includes(r.carrier+r.service);
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${C.border}22`, cursor:"pointer", transition:"background .1s", background:isCmp?`${mv.color}08`:"transparent" }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.surface}
                      onMouseLeave={e=>e.currentTarget.style.background=isCmp?`${mv.color}08`:"transparent"}>
                      <td style={{ padding:"12px 12px" }}><input type="checkbox" checked={isCmp} onChange={()=>toggleCompare(r)} style={{ cursor:"pointer", accentColor:mv.color }} /></td>
                      <td style={{ padding:"12px 12px" }}>
                        <div style={{ fontSize:13, fontWeight:700, color:mv.color }}>{r.carrier}</div>
                        {isSaved && <div style={{ fontSize:10, color:C.green, marginTop:1 }}>✓ Bijgewerkt</div>}
                      </td>
                      <td style={{ padding:"12px 12px", fontSize:13 }}>{r.pol} → {r.pod}</td>
                      <td style={{ padding:"12px 12px", fontSize:12, color:C.muted }}>{r.service}</td>
                      <td style={{ padding:"12px 12px" }}><Badge label={r.containerType} color={mv.color} /></td>
                      <td style={{ padding:"12px 12px", fontSize:12 }}>{r.transit}</td>
                      <td style={{ padding:"12px 12px", fontSize:13, color:C.red, fontWeight:600 }}>{mode==="sea"?`$${r.buy}`:`€${r.buy.toFixed(2)}`}</td>
                      <td style={{ padding:"12px 12px", fontSize:14, fontWeight:800, color:C.green }}>{mode==="sea"?`$${r.sell}`:`€${r.sell.toFixed(2)}`}</td>
                      <td style={{ padding:"12px 12px", fontSize:12, color:mPct>20?C.green:mPct>12?C.yellow:C.red, fontWeight:700 }}>{mPct}%</td>
                      <td style={{ padding:"12px 12px", fontSize:12, color:C.muted }}>{r.valid}</td>
                      <td style={{ padding:"12px 12px" }}>
                        <div style={{ display:"flex", gap:5 }}>
                          <button style={{ padding:"3px 10px", background:mv.color, border:"none", borderRadius:5, fontSize:11, color:mode==="air"?"#000":"#fff", fontWeight:600, cursor:"pointer" }}>Offerte</button>
                          <button style={{ padding:"3px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:5, fontSize:11, color:C.muted, cursor:"pointer" }}>Boek</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop:10, fontSize:12, color:C.muted }}>{rates.length} tarieven • Excl. surcharges en lokale kosten</div>
        </div>
      )}

      {/* ── OFFERTES INLEZEN ── */}
      {sub==="inlezen" && !reviewItem && (
        <div>
          {/* AI scan banner */}
          <div style={{ background:`linear-gradient(135deg,${C.blue}14,${C.purple}14)`, border:`1px solid ${C.blue}44`, borderRadius:14, padding:"18px 24px", marginBottom:22, display:"flex", alignItems:"center", gap:18 }}>
            <div style={{ width:48, height:48, borderRadius:14, background:`linear-gradient(135deg,${C.blue},${C.purple})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>🤖</div>
            <div style={{ flex:1 }}>
              <div style={{ fontWeight:700, fontSize:15, color:C.text }}>InstaRate AI — Tarief Extractie</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:3 }}>Upload een PDF-tariefsheet, e-mail bijlage of plak de tekst van een leveranciersofferte. AI extraheert automatisch carrier, route, tarieven, toeslagen en geldigheid.</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
              <button onClick={startScan}
                style={{ padding:"10px 22px", background:`linear-gradient(135deg,${C.blue},${C.purple})`, border:"none", borderRadius:10, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap" }}>
                📎 PDF uploaden
              </button>
              <button style={{ padding:"8px 22px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, color:C.muted, fontWeight:600, fontSize:12, cursor:"pointer" }}>
                ✉️ E-mail plakken
              </button>
            </div>
          </div>

          {/* Scan animation */}
          {scanStep===1 && (
            <div style={{ background:C.card, border:`1px solid ${C.blue}44`, borderRadius:12, padding:28, marginBottom:20, textAlign:"center" }}>
              <div style={{ fontSize:28, marginBottom:12 }}>⚙️</div>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Document wordt verwerkt…</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:16 }}>{ScanSteps[Math.min(Math.floor(scanProgress/14), ScanSteps.length-1)]}</div>
              <div style={{ height:8, background:C.border, borderRadius:4, overflow:"hidden", maxWidth:400, margin:"0 auto" }}>
                <div style={{ height:"100%", width:`${scanProgress}%`, background:`linear-gradient(90deg,${C.blue},${C.purple})`, borderRadius:4, transition:"width .3s" }} />
              </div>
              <div style={{ fontSize:12, color:C.muted, marginTop:8 }}>{Math.round(scanProgress)}%</div>
            </div>
          )}
          {scanStep===2 && (
            <div style={{ background:`${C.green}0A`, border:`1px solid ${C.green}44`, borderRadius:12, padding:"14px 22px", marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>✅</span>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C.green }}>Extractie geslaagd!</div>
                <div style={{ fontSize:12, color:C.muted }}>Carrier, route, 5 kostenregels en geldigheidsperiode herkend. Bekijk het resultaat hieronder.</div>
              </div>
              <button onClick={()=>{setScanStep(0);setReviewItem(SUPPLIER_QUOTES_INBOX[0]);}}
                style={{ marginLeft:"auto", padding:"8px 20px", background:C.green, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>
                Beoordelen →
              </button>
            </div>
          )}

          {/* KPIs */}
          <div style={{ display:"flex", gap:12, marginBottom:20 }}>
            {[
              ["Nieuw",      SUPPLIER_QUOTES_INBOX.filter(q=>q.status==="Nieuw").length,     C.yellow,"Wacht op beoordeling"],
              ["Beoordeeld", SUPPLIER_QUOTES_INBOX.filter(q=>q.status==="Beoordeeld").length,C.blue,  ""],
              ["Goedgekeurd",approvedItems.length,                                           C.green,  "Opgeslagen in tarieven"],
              ["Hoge prioriteit",SUPPLIER_QUOTES_INBOX.filter(q=>q.priority==="Hoog").length,C.red,  "Snel verwerken"],
            ].map(([lbl,val,col,sub])=>(
              <div key={lbl} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 18px", flex:1, cursor:"pointer" }}
                onClick={()=>setInboxFilter(lbl==="Hoge prioriteit"?"Alle":lbl)}>
                <div style={{ fontSize:22, fontWeight:800, color:col }}>{val}</div>
                <div style={{ fontSize:12, fontWeight:600, color:C.text, marginTop:2 }}>{lbl}</div>
                {sub && <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{sub}</div>}
              </div>
            ))}
          </div>

          {/* Filter bar */}
          <div style={{ display:"flex", gap:8, marginBottom:16, alignItems:"center" }}>
            <div style={{ flex:1, fontSize:14, fontWeight:700, color:C.text }}>Inkomende leveranciersoffertes</div>
            {["Alle","Nieuw","Beoordeeld"].map(f=>(
              <button key={f} onClick={()=>setInboxFilter(f)}
                style={{ padding:"7px 13px", borderRadius:7, fontSize:11, cursor:"pointer", fontWeight:600,
                  background:inboxFilter===f?C.blue:C.card, border:`1px solid ${inboxFilter===f?C.blue:C.border}`,
                  color:inboxFilter===f?"#fff":C.muted }}>{f}</button>
            ))}
          </div>

          {/* Inbox list */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {inboxData.map(sq=>{
              const mv2=MODES[sq.mode];
              const isApproved = approvedItems.includes(sq.id);
              const totalBuy = sq.extracted.charges.reduce((a,c)=>a+c.amount,0);
              const existing = sq.existingRate;
              const diff = sq.mode==="sea"
                ? sq.extracted.charges[0]?.amount - existing.buy
                : (sq.extracted.charges[0]?.amount + sq.extracted.charges[1]?.amount) - existing.buy;
              const cheaper = diff < 0;

              return (
                <div key={sq.id} style={{ background:C.card, border:`1px solid ${sq.status==="Nieuw"&&!isApproved?C.yellow+"55":C.border}`, borderRadius:14, padding:"16px 20px",
                  transition:"border-color .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=mv2.color}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=sq.status==="Nieuw"&&!isApproved?C.yellow+"55":C.border}>
                  <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                    {/* Icon */}
                    <div style={{ width:44, height:44, borderRadius:12, background:`${mv2.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
                      {sq.source==="pdf" ? "📄" : "✉️"}
                    </div>

                    {/* Content */}
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
                        <span style={{ fontWeight:700, fontSize:14, color:C.text }}>{sq.carrier}</span>
                        <Badge label={sq.mode==="sea"?"🚢 Zeevracht":"✈️ Luchtvracht"} color={mv2.color} />
                        {sq.priority==="Hoog" && <Badge label="⚡ Hoge prioriteit" color={C.red} bg="rgba(239,68,68,.12)" />}
                        {isApproved && <Badge label="✓ Opgeslagen in tarieven" color={C.green} bg="rgba(34,197,94,.12)" />}
                      </div>
                      <div style={{ fontSize:13, color:C.text, marginBottom:4 }}>{sq.subject}</div>
                      <div style={{ fontSize:11, color:C.muted }}>
                        {sq.from} • {sq.received}
                      </div>

                      {/* Quick extract preview */}
                      <div style={{ marginTop:12, display:"flex", gap:10, flexWrap:"wrap" }}>
                        {[
                          ["Route", `${sq.extracted.pol} → ${sq.extracted.pod}`],
                          ["Type",  sq.extracted.containerType],
                          ["Service", sq.extracted.service],
                          ["Transit", sq.extracted.transit],
                          ["Geldig", `${sq.extracted.validFrom} – ${sq.extracted.validTo}`],
                        ].map(([lbl,val])=>(
                          <div key={lbl} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:7, padding:"5px 10px" }}>
                            <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:1 }}>{lbl}</div>
                            <div style={{ fontSize:12, fontWeight:600, color:C.text, marginTop:1 }}>{val}</div>
                          </div>
                        ))}

                        {/* Price delta */}
                        <div style={{ background:cheaper?`${C.green}12`:`${C.red}10`, border:`1px solid ${cheaper?C.green:C.red}44`, borderRadius:7, padding:"5px 10px" }}>
                          <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:1 }}>vs. huidige prijs</div>
                          <div style={{ fontSize:13, fontWeight:800, color:cheaper?C.green:C.red, marginTop:1 }}>
                            {cheaper?"▼":"▲"} {sq.mode==="sea"?`$${Math.abs(Math.round(diff))}`:`€${Math.abs(diff).toFixed(2)}`}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                      {!isApproved ? (
                        <>
                          <button onClick={()=>{ setReviewItem(sq); setEditCharges(sq.extracted.charges.map(c=>({...c}))); }}
                            style={{ padding:"8px 20px", background:C.blue, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>
                            🔍 Beoordelen
                          </button>
                          <button onClick={()=>handleApprove(sq)}
                            style={{ padding:"7px 20px", background:C.green, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>
                            ✓ Direct goedkeuren
                          </button>
                          <button style={{ padding:"6px 20px", background:"none", border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, fontSize:12, cursor:"pointer" }}>
                            Afwijzen
                          </button>
                        </>
                      ) : (
                        <div style={{ padding:"8px 16px", background:`${C.green}12`, border:`1px solid ${C.green}44`, borderRadius:8, textAlign:"center" }}>
                          <div style={{ fontSize:18 }}>✅</div>
                          <div style={{ fontSize:11, color:C.green, fontWeight:700, marginTop:2 }}>Opgeslagen</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── BEOORDELEN PANEL (detail review) ── */}
      {sub==="inlezen" && reviewItem && (
        <div>
          {/* Back */}
          <button onClick={()=>setReviewItem(null)}
            style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:13, marginBottom:20, padding:0 }}>
            ← Terug naar inbox
          </button>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>

            {/* LEFT: Extracted data */}
            <div style={{ background:C.card, border:`1px solid ${C.blue}44`, borderRadius:14, padding:22 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
                <span style={{ fontSize:20 }}>🤖</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:15 }}>Geëxtraheerde gegevens</div>
                  <div style={{ fontSize:11, color:C.muted }}>Automatisch herkend uit {reviewItem.source==="pdf"?"PDF":"e-mail"}</div>
                </div>
              </div>

              {/* Confidence scores */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16 }}>
                {Object.entries(reviewItem.extracted.confidence).map(([field,pct])=>(
                  <div key={field} style={{ background:C.surface, borderRadius:8, padding:"8px 12px" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:11, color:C.muted, textTransform:"capitalize" }}>{field}</span>
                      <span style={{ fontSize:11, fontWeight:700, color:pct>=95?C.green:pct>=85?C.yellow:C.red }}>{pct}%</span>
                    </div>
                    <Bar val={pct} color={pct>=95?C.green:pct>=85?C.yellow:C.red} h={3} />
                  </div>
                ))}
              </div>

              {/* Route & details */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                {[
                  ["Carrier",   reviewItem.carrier],
                  ["POL",       reviewItem.extracted.pol],
                  ["POD",       reviewItem.extracted.pod],
                  ["Type",      reviewItem.extracted.containerType],
                  ["Service",   reviewItem.extracted.service],
                  ["Transit",   reviewItem.extracted.transit],
                  ["Geldig van",reviewItem.extracted.validFrom],
                  ["Geldig tot",reviewItem.extracted.validTo],
                ].map(([l,v])=>(
                  <div key={l}>
                    <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>{l}</div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* Raw text */}
              <details>
                <summary style={{ fontSize:12, color:C.muted, cursor:"pointer", marginBottom:6 }}>Originele tekst tonen</summary>
                <pre style={{ fontFamily:"'Courier New',monospace", fontSize:11, color:C.muted, background:C.surface, padding:"12px 14px", borderRadius:8, whiteSpace:"pre-wrap", margin:0, lineHeight:1.7 }}>
                  {reviewItem.extracted.raw}
                </pre>
              </details>
            </div>

            {/* RIGHT: Editable charges + comparison */}
            <div>
              {/* Charges editor */}
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:22, marginBottom:14 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                  <div style={{ fontWeight:700, fontSize:15 }}>Kostenregels</div>
                  <div style={{ fontSize:11, color:C.muted }}>Pas aan indien nodig</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(editCharges||reviewItem.extracted.charges).map((c,i)=>(
                    <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr auto auto auto", gap:8, alignItems:"center", background:C.surface, borderRadius:8, padding:"8px 12px" }}>
                      <div style={{ fontSize:12, fontWeight:600, color:C.text }}>{c.name}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <span style={{ fontSize:12, color:C.muted }}>{c.cur}</span>
                        <input defaultValue={c.amount} style={{ width:70, padding:"4px 8px", background:C.card, border:`1px solid ${C.border}`, borderRadius:6, color:C.text, fontSize:12, textAlign:"right" }} />
                      </div>
                      <span style={{ fontSize:10, color:C.muted, whiteSpace:"nowrap" }}>/{c.per}</span>
                      <button style={{ padding:"2px 7px", background:"none", border:`1px solid ${C.border}`, borderRadius:5, fontSize:10, color:C.muted, cursor:"pointer" }}>✕</button>
                    </div>
                  ))}
                  <button style={{ padding:"7px 0", background:"none", border:`1px dashed ${C.border}`, borderRadius:8, color:C.muted, fontSize:12, cursor:"pointer", textAlign:"center" }}>
                    + Kostenregel toevoegen
                  </button>
                </div>
              </div>

              {/* Comparison with existing */}
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:22, marginBottom:14 }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Vergelijking met huidig tarief</div>
                {[
                  ["Huidig tarief (inkoop)", reviewItem.mode==="sea"?`$${reviewItem.existingRate.buy}`:`€${reviewItem.existingRate.buy}`, C.muted, reviewItem.existingRate.service, `Geldig t/m ${reviewItem.existingRate.valid}`],
                  ["Nieuw tarief (inkoop)",  reviewItem.mode==="sea"?`$${reviewItem.extracted.charges[0].amount}`:`€${reviewItem.extracted.charges[0].amount.toFixed(2)}`, C.blue, reviewItem.extracted.service, `Geldig t/m ${reviewItem.extracted.validTo}`],
                ].map(([lbl,val,col,service,valid])=>(
                  <div key={lbl} style={{ background:C.surface, borderRadius:10, padding:"12px 16px", marginBottom:8 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                      <div>
                        <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:3 }}>{lbl}</div>
                        <div style={{ fontSize:11, color:C.muted }}>{service} • {valid}</div>
                      </div>
                      <div style={{ fontSize:22, fontWeight:900, color:col }}>{val}</div>
                    </div>
                  </div>
                ))}
                {(() => {
                  const diff = reviewItem.extracted.charges[0].amount - reviewItem.existingRate.buy;
                  const cheaper = diff < 0;
                  return (
                    <div style={{ background:cheaper?`${C.green}0E`:`${C.red}0E`, border:`1px solid ${cheaper?C.green:C.red}44`, borderRadius:10, padding:"12px 16px", marginTop:4 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:cheaper?C.green:C.red }}>
                        {cheaper ? `▼ €${Math.abs(Math.round(diff))} goedkoper — aanbevolen` : `▲ €${Math.round(diff)} duurder — vergelijk zorgvuldig`}
                      </div>
                      <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>
                        {cheaper ? "Dit tarief vervangt het huidige voordelig." : "Controleer of service of transit-tijd verschilt."}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Markup & sell calculation */}
              <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:22 }}>
                <div style={{ fontWeight:700, fontSize:15, marginBottom:14 }}>Verkooptarief instellen</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {[["Inkooptarief", reviewItem.mode==="sea"?`$${reviewItem.extracted.charges[0].amount}`:`€${reviewItem.extracted.charges[0].amount.toFixed(2)}`,""],
                    ["Opslag %","25","%"],
                    ["Verkooptarief",reviewItem.mode==="sea"?`$${Math.round(reviewItem.extracted.charges[0].amount*1.25)}`:`€${(reviewItem.extracted.charges[0].amount*1.25).toFixed(2)}`,"berekend"]].map(([lbl,val,suf])=>(
                    <div key={lbl}>
                      <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>{lbl}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <input defaultValue={val} style={{ flex:1, padding:"8px 10px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:7, color:suf==="berekend"?C.green:C.text, fontSize:13, fontWeight:suf==="berekend"?700:400 }} />
                        {suf && <span style={{ fontSize:12, color:C.muted }}>{suf}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action bar */}
          <div style={{ display:"flex", gap:12, justifyContent:"flex-end", padding:"16px 0" }}>
            <button onClick={()=>setReviewItem(null)} style={{ padding:"10px 24px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, color:C.muted, fontWeight:600, fontSize:13, cursor:"pointer" }}>Annuleren</button>
            <button style={{ padding:"10px 24px", background:C.yellow, border:"none", borderRadius:10, color:"#000", fontWeight:700, fontSize:13, cursor:"pointer" }}>📋 Opslaan als concept</button>
            <button onClick={()=>handleApprove(reviewItem)} style={{ padding:"10px 28px", background:C.green, border:"none", borderRadius:10, color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", boxShadow:`0 4px 14px ${C.green}30` }}>
              ✓ Goedkeuren & Opslaan in tarieven
            </button>
          </div>
        </div>
      )}

      {/* ── CONTRACTEN ── */}
      {sub==="contracten" && (
        <div>
          <div style={{ display:"flex", gap:14, marginBottom:20 }}>
            <KPI label="Actieve contracten" value="14"             icon="📑" color={C.blue}   sub="zeevracht + lucht" />
            <KPI label="Vervalt binnen 30d" value="3"              icon="⏰" color={C.yellow}  sub="actie vereist" />
            <KPI label="Gem. geldigheid"    value="68 dagen"       icon="📅" color={C.cyan}   />
            <KPI label="Carriers"           value="9"              icon="🚢" color={C.accent}  sub="under contract" />
          </div>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:C.surface }}>
                {["Carrier","Modus","Route","Dienst","Inkoop","Geldig van","Geldig tot","Status","Acties"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"12px 14px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[
                  ...RATE_DATA.sea.slice(0,4).map(r=>({...r, mode:"sea",  validFrom:"01 Jan", daysLeft:26})),
                  ...RATE_DATA.air.slice(0,3).map(r=>({...r, mode:"air",  validFrom:"01 Jan", daysLeft:57})),
                ].map((r,i)=>{
                  const mv2=MODES[r.mode]; const urgent=r.daysLeft<30;
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${C.border}22` }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.surface}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700, color:mv2.color }}>{r.carrier}</td>
                      <td style={{ padding:"12px 14px" }}><span style={{ fontSize:11, padding:"2px 7px", borderRadius:20, background:`${mv2.color}18`, color:mv2.color, fontWeight:600 }}>{mv2.icon}</span></td>
                      <td style={{ padding:"12px 14px", fontSize:13 }}>{r.pol} → {r.pod}</td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:C.muted }}>{r.service}</td>
                      <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700, color:C.red }}>{r.mode==="sea"?`$${r.buy}`:`€${r.buy.toFixed(2)}`}</td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:C.muted }}>{r.validFrom}</td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:urgent?C.red:C.muted, fontWeight:urgent?700:400 }}>{r.valid} {urgent&&"⚠️"}</td>
                      <td style={{ padding:"12px 14px" }}>
                        <Badge label={urgent?"Vervalt binnenkort":"Actief"} color={urgent?C.yellow:C.green} bg={urgent?"rgba(234,179,8,.12)":"rgba(34,197,94,.12)"} />
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", gap:5 }}>
                          <button style={{ padding:"3px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:5, fontSize:11, color:C.muted, cursor:"pointer" }}>Bekijken</button>
                          {urgent && <button style={{ padding:"3px 10px", background:C.yellow, border:"none", borderRadius:5, fontSize:11, color:"#000", fontWeight:600, cursor:"pointer" }}>Verlengen</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── DOCUMENTEN CENTRUM ───────────────────────────────────────────────────────
const ALL_DOCUMENTS = ALL_SHIPMENTS.flatMap(s => {
  const d = DOSSIER_DETAILS[s.id]||{};
  return (d.documents||[]).map(doc=>({ ...doc, dossier:s.id, mode:s.mode, carrier:s.carrier, client:s.dest }));
});

const DOC_TEMPLATES = [
  { name:"House Bill of Lading (HBL)", modes:["sea","breakbulk","roro"], icon:"📃" },
  { name:"Air Waybill (AWB)",           modes:["air"],                    icon:"✈️" },
  { name:"CMR Vrachtbrief",             modes:["road"],                   icon:"🚛" },
  { name:"Packing List",                modes:["sea","air","road","breakbulk","roro"], icon:"📋" },
  { name:"Commercial Invoice",          modes:["sea","air","road","breakbulk","roro"], icon:"🧾" },
  { name:"Certificate of Origin",       modes:["sea","air","road","breakbulk","roro"], icon:"📜" },
  { name:"Douaneaangifte Export (EX-A)",modes:["sea","air","road","breakbulk","roro"], icon:"🏛" },
  { name:"VGM Certificaat",             modes:["sea"],                    icon:"⚖️" },
  { name:"DG Declaration",             modes:["sea","air","road"],       icon:"⚠️" },
  { name:"Insurance Certificate",       modes:["sea","air","road","breakbulk","roro"], icon:"🛡" },
];

const DocumentenTab = () => {
  const [typeF,   setTypeF]   = useState("Alle");
  const [statusF, setStatusF] = useState("Alle");
  const [search,  setSearch]  = useState("");
  const [subTab,  setSubTab]  = useState("overzicht");

  const filtered = ALL_DOCUMENTS.filter(d=>
    (typeF==="Alle"||d.type===typeF) &&
    (statusF==="Alle"||d.status===statusF) &&
    (d.name+d.dossier+d.client).toLowerCase().includes(search.toLowerCase())
  );

  const docTypes = [...new Set(ALL_DOCUMENTS.map(d=>d.type))];
  const statusCounts = { Ontvangen:0, Concept:0, Aangevraagd:0, Ontbreekt:0, Goedgekeurd:0, Afgegeven:0 };
  ALL_DOCUMENTS.forEach(d=>{ if(statusCounts[d.status]!==undefined) statusCounts[d.status]++; });

  return (
    <div>
      {/* Sub-tabs */}
      <div style={{ display:"flex", gap:8, marginBottom:22, borderBottom:`1px solid ${C.border}`, paddingBottom:0 }}>
        {[["overzicht","📂 Overzicht"],["templates","📝 Templates & Genereren"],["compliance","✅ Compliance Checklist"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>setSubTab(id)}
            style={{ padding:"10px 16px", cursor:"pointer", background:"none", border:"none", fontSize:13, fontWeight:600,
              color: subTab===id ? C.accent : C.muted,
              borderBottom: subTab===id ? `2px solid ${C.accent}` : "2px solid transparent", marginBottom:-1 }}>
            {lbl}
          </button>
        ))}
      </div>

      {subTab==="overzicht" && (
        <div>
          {/* Status KPIs */}
          <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
            {Object.entries(statusCounts).filter(([,v])=>v>0).map(([s,v])=>(
              <div key={s} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 18px", cursor:"pointer" }}
                onClick={()=>setStatusF(statusF===s?"Alle":s)}>
                <div style={{ fontSize:20, fontWeight:800, color:docStatusColor(s) }}>{v}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s}</div>
              </div>
            ))}
          </div>
          {/* Filters */}
          <div style={{ display:"flex", gap:10, marginBottom:14, alignItems:"center" }}>
            <input placeholder="🔍  Zoek op naam, dossier, klant..."
              value={search} onChange={e=>setSearch(e.target.value)}
              style={{ flex:1, padding:"9px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, outline:"none" }} />
            <select value={typeF} onChange={e=>setTypeF(e.target.value)}
              style={{ padding:"9px 14px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13 }}>
              <option value="Alle">Alle types</option>
              {docTypes.map(t=><option key={t}>{t}</option>)}
            </select>
            <div style={{ display:"flex", gap:5 }}>
              {["Alle","Concept","Aangevraagd","Ontbreekt"].map(f=>(
                <button key={f} onClick={()=>setStatusF(f)}
                  style={{ padding:"7px 12px", borderRadius:7, fontSize:11, cursor:"pointer", fontWeight:600,
                    background:statusF===f?C.accent:C.card, border:`1px solid ${statusF===f?C.accent:C.border}`,
                    color:statusF===f?"#fff":C.muted }}>{f}</button>
              ))}
            </div>
          </div>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:C.surface }}>
                {["Document","Type","Dossier","Modus","Status","Datum","Acties"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"12px 14px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filtered.slice(0,30).map((doc,i)=>{
                  const mv2=MODES[doc.mode];
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${C.border}22`, cursor:"pointer" }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.surface}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <span style={{ fontSize:16 }}>📄</span>
                          <span style={{ fontSize:13, fontWeight:600 }}>{doc.name}</span>
                        </div>
                      </td>
                      <td style={{ padding:"11px 14px" }}><Badge label={doc.type} color={C.muted} /></td>
                      <td style={{ padding:"11px 14px" }}>
                        <span style={{ fontSize:12, fontWeight:600, color:C.accent, background:`${C.accent}18`, padding:"2px 8px", borderRadius:20 }}>{doc.dossier}</span>
                      </td>
                      <td style={{ padding:"11px 14px" }}>
                        <span style={{ fontSize:11, padding:"2px 7px", borderRadius:20, background:`${mv2.color}18`, color:mv2.color, fontWeight:600 }}>{mv2.icon}</span>
                      </td>
                      <td style={{ padding:"11px 14px" }}><Badge label={doc.status} color={docStatusColor(doc.status)} bg={docStatusBg(doc.status)} /></td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.muted }}>{doc.date||"—"}</td>
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ display:"flex", gap:5 }}>
                          {(doc.status==="Ontvangen"||doc.status==="Goedgekeurd"||doc.status==="Afgegeven") && <button style={{ padding:"3px 9px", background:"none", border:`1px solid ${C.border}`, borderRadius:5, fontSize:11, color:C.muted, cursor:"pointer" }}>PDF</button>}
                          {doc.status==="Concept" && <button style={{ padding:"3px 9px", background:C.accent, border:"none", borderRadius:5, fontSize:11, color:"#fff", fontWeight:600, cursor:"pointer" }}>Genereren</button>}
                          {doc.status==="Aangevraagd" && <button style={{ padding:"3px 9px", background:C.cyan, border:"none", borderRadius:5, fontSize:11, color:"#000", fontWeight:600, cursor:"pointer" }}>Upload</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop:10, fontSize:12, color:C.muted }}>{filtered.length} documenten</div>
        </div>
      )}

      {subTab==="templates" && (
        <div>
          <div style={{ background:`${C.accent}0A`, border:`1px solid ${C.accent}33`, borderRadius:12, padding:18, marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ fontSize:24 }}>🤖</span>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:C.accent }}>InstaDoc – AI Document Generatie</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Scan een AWB, B/L of factuur — AI extraheert automatisch de lading­gegevens en maakt het document aan.</div>
            </div>
            <button style={{ marginLeft:"auto", padding:"8px 18px", background:C.accent, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", whiteSpace:"nowrap" }}>📎 Document scannen</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:14 }}>
            {DOC_TEMPLATES.map(t=>(
              <div key={t.name} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:20, cursor:"pointer", transition:"border-color .2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
              >
                <div style={{ fontSize:28, marginBottom:12 }}>{t.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:8 }}>{t.name}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:14 }}>
                  {t.modes.map(m=><span key={m} style={{ fontSize:10, padding:"2px 6px", borderRadius:20, background:`${MODES[m].color}18`, color:MODES[m].color }}>{MODES[m].icon}</span>)}
                </div>
                <button style={{ width:"100%", padding:"7px 0", background:C.accent, border:"none", borderRadius:7, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>Genereren</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {subTab==="compliance" && (
        <div>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Compliance Checklist per Vervoerswijze</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:20 }}>Verplichte documenten en certificaten per transportmodus</div>
            {Object.entries(MODES).map(([k,mv2])=>{
              const requiredDocs = { road:["CMR Vrachtbrief","Packing List","Commercial Invoice"], air:["AWB","Packing List","Commercial Invoice","DG Declaration*"], sea:["HBL/MBL","Packing List","Commercial Invoice","VGM Certificaat","EX-A"], breakbulk:["HBL","Heavy Lift Plan","Lashing Plan","Packing List","Commercial Invoice"], roro:["CMR/CIM","VIN-lijst","Deactivation Certificate","HBL"] }[k]||[];
              return (
                <div key={k} style={{ marginBottom:20, paddingBottom:20, borderBottom:`1px solid ${C.border}22` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <span style={{ fontSize:16 }}>{mv2.icon}</span>
                    <span style={{ fontWeight:700, fontSize:14, color:mv2.color }}>{mv2.label}</span>
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {requiredDocs.map(doc=>(
                      <div key={doc} style={{ display:"flex", alignItems:"center", gap:6, padding:"6px 12px", background:C.surface, border:`1px solid ${mv2.color}33`, borderRadius:8 }}>
                        <span style={{ color:C.green, fontWeight:700 }}>✓</span>
                        <span style={{ fontSize:12, color:C.text }}>{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SHIPMENTS ────────────────────────────────────────────────────────────────
const ShipmentsTab = ({ onNew }) => {
  const [activeMode,   setActiveMode]   = useState("all");
  const [search,       setSearch]       = useState("");
  const [statusF,      setStatusF]      = useState("Alle");
  const [openDossier,  setOpenDossier]  = useState(null);

  const data = ALL_SHIPMENTS.filter(s=>
    (activeMode==="all"||s.mode===activeMode) &&
    (statusF==="Alle"||s.status===statusF) &&
    (s.id+s.origin+s.dest+s.carrier+s.type).toLowerCase().includes(search.toLowerCase())
  );
  const mv = activeMode!=="all"?MODES[activeMode]:null;

  return (
    <div style={{ position:"relative" }}>
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        <button onClick={()=>setActiveMode("all")}
          style={{ padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600,
            background:activeMode==="all"?C.accent:C.card, border:`1px solid ${activeMode==="all"?C.accent:C.border}`,
            color:activeMode==="all"?"#fff":C.muted }}>
          🗂 Alle ({ALL_SHIPMENTS.length})
        </button>
        {Object.entries(MODES).map(([k,v])=>{
          const cnt=ALL_SHIPMENTS.filter(s=>s.mode===k).length;
          return (
            <button key={k} onClick={()=>setActiveMode(k)}
              style={{ padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600,
                background:activeMode===k?v.color:C.card, border:`1px solid ${activeMode===k?v.color:C.border}`,
                color:activeMode===k?"#fff":C.muted, display:"flex", alignItems:"center", gap:6 }}>
              {v.icon} {v.label} <span style={{ fontSize:11, opacity:.7 }}>({cnt})</span>
            </button>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
        <input placeholder="🔍  Zoek op ID, route, carrier..."
          value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, padding:"9px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, outline:"none" }} />
        <div style={{ display:"flex", gap:6 }}>
          {["Alle","In Transit","Delivered","Pending","Delayed"].map(f=>(
            <button key={f} onClick={()=>setStatusF(f)}
              style={{ padding:"7px 13px", borderRadius:7, fontSize:12, cursor:"pointer", fontWeight:600,
                background:statusF===f?(mv?mv.color:C.accent):C.card,
                border:`1px solid ${statusF===f?(mv?mv.color:C.accent):C.border}`,
                color:statusF===f?"#fff":C.muted }}>{f}</button>
          ))}
        </div>
        <button onClick={onNew} style={{ background:mv?mv.color:C.accent, border:"none", color:"#fff", padding:"9px 20px", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer" }}>+ Nieuw</button>
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:C.surface }}>
              {["ID","Modus","Van → Naar","Type","Carrier","Gewicht","Bijzonderheden","Status","Voortgang","ETA"].map(h=>(
                <th key={h} style={{ textAlign:"left", padding:"13px 12px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(s=>{
              const mv2=MODES[s.mode];
              return (
                <tr key={s.id}
                  style={{ borderBottom:`1px solid ${C.border}22`, cursor:"pointer", transition:"background .1s" }}
                  onClick={()=>setOpenDossier(s)}
                  onMouseEnter={e=>e.currentTarget.style.background=C.surface}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                >
                  <td style={{ padding:"12px" }}>
                    <div style={{ display:"flex", flexDirection:"column" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:mv2.color }}>{s.id}</span>
                      <span style={{ fontSize:10, color:C.muted, marginTop:1 }}>📂 Dossier openen</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px" }}>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:4, padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, background:`${mv2.color}18`, color:mv2.color }}>
                      {mv2.icon} {mv2.label}
                    </span>
                  </td>
                  <td style={{ padding:"12px", fontSize:13 }}>{s.origin} <span style={{ color:C.muted }}>→</span> {s.dest}</td>
                  <td style={{ padding:"12px" }}>
                    <span style={{ padding:"2px 8px", borderRadius:4, fontSize:11, fontWeight:600, background:C.surface, color:C.muted, border:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{s.type}</span>
                  </td>
                  <td style={{ padding:"12px", fontSize:12, color:C.muted, whiteSpace:"nowrap" }}>{s.carrier}</td>
                  <td style={{ padding:"12px", fontSize:12, color:C.muted, whiteSpace:"nowrap" }}>{s.weight}</td>
                  <td style={{ padding:"12px", fontSize:11, color:C.muted }}>{s.extra||"—"}</td>
                  <td style={{ padding:"12px" }}><Badge label={s.status} color={statusColor(s.status)} bg={statusBg(s.status)} /></td>
                  <td style={{ padding:"12px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                      <div style={{ width:64 }}><Bar val={s.progress} color={statusColor(s.status)} h={5} /></div>
                      <span style={{ fontSize:11, color:C.muted }}>{s.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px", fontSize:12, color:C.muted, whiteSpace:"nowrap" }}>{s.eta}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {data.length===0&&<div style={{ textAlign:"center", padding:40, color:C.muted }}>Geen zendingen gevonden</div>}
      </div>
      <div style={{ marginTop:10, fontSize:12, color:C.muted }}>{data.length} van {ALL_SHIPMENTS.length} zendingen • Klik op een rij om het dossier te openen</div>
      {openDossier && <DossierPanel shipment={openDossier} onClose={()=>setOpenDossier(null)} />}
    </div>
  );
};

// ─── FREIGHT MODES ───────────────────────────────────────────────────────────
const FreightModesTab = () => {
  const [active, setActive] = useState("air");
  const mv = MODES[active];

  const details = {
    air: {
      desc:"Luchtvracht voor tijdkritische en hoogwaardige zendingen wereldwijd via Schiphol en Zaventem.",
      kpis:[["Actieve vluchten","14",C.cyan],["Gem. transit","1.8 dagen",C.cyan],["On-time","96%",C.green],["Maandomzet","€ 218K",C.cyan]],
      items:ALL_SHIPMENTS.filter(s=>s.mode==="air").slice(0,4),
      info:[
        {icon:"❄️",title:"Koelketen",body:"IATA CEIV Pharma gecertificeerd. +2°C tot +25°C zones via KLM Cargo en Cargolux."},
        {icon:"⚠️",title:"Gevaarlijke stoffen",body:"ADR/IATA klassen 1–9. Volledige DG-documentatie en verpakkingseisen."},
        {icon:"📐",title:"Afmetingen",body:"Max. 300×220×160 cm (B747F). Oversized op aanvraag via chartervluchten."},
        {icon:"📋",title:"Documenten",body:"AWB, packing list, commercial invoice, certificate of origin, DG declaration."},
      ],
    },
    sea: {
      desc:"Containertransport en zeevracht voor bulk- en projectlading via Rotterdam en Antwerpen.",
      kpis:[["Actieve TEU's","284",C.blue],["Gem. transit","18 dagen",C.blue],["On-time","93%",C.green],["Maandomzet","€ 380K",C.blue]],
      items:ALL_SHIPMENTS.filter(s=>s.mode==="sea").slice(0,4),
      info:[
        {icon:"📦",title:"FCL – Full Container Load",body:"20', 40', 40HC en 45' containers. Reefer containers voor koelketen beschikbaar."},
        {icon:"🔀",title:"LCL – Less than Container Load",body:"Gedeelde containers voor kleinere volumes. Consolidatie via Rotterdam en Antwerpen."},
        {icon:"⚓",title:"Havens",body:"Rotterdam (Maasvlakte I & II), Antwerpen-Bruges Port, Gent. Inland via binnenvaart."},
        {icon:"📋",title:"Documenten",body:"B/L, packing list, commercial invoice, certificate of origin, VGM certificate."},
      ],
    },
    breakbulk: {
      desc:"Stukgoed en projectvracht voor niet-gecontaineriseerde lading: machines, staal, constructiedelen.",
      kpis:[["Actieve zendingen","4",C.purple],["Gem. gewicht","73T",C.purple],["On-time","94%",C.green],["Maandomzet","€ 218K",C.purple]],
      items:ALL_SHIPMENTS.filter(s=>s.mode==="breakbulk"),
      info:[
        {icon:"🏗️",title:"Heavy Lift",body:"Kraan- en liftcapaciteit tot 3.000 ton. Semi-submersible vessels voor extreme afmetingen."},
        {icon:"📐",title:"Maten & gewichten",body:"Geen formele max. afmeting. Routing study en feasibility check standaard inbegrepen."},
        {icon:"🔧",title:"Project Cargo",body:"EPC-ondersteuning, marine surveys, lashing & securing, superintendence."},
        {icon:"📋",title:"Documenten",body:"Heavy lift plan, lashing plan, mate's receipt, B/L, hazmat declaration indien van toepassing."},
      ],
    },
    roro: {
      desc:"Roll-on/Roll-off transport voor rijdend en rollend materieel: voertuigen, trailers, bouwmachines.",
      kpis:[["Actieve ladingen","24",C.teal],["Actieve routes","8",C.teal],["On-time","92%",C.green],["Maandomzet","€ 156K",C.teal]],
      items:ALL_SHIPMENTS.filter(s=>s.mode==="roro").slice(0,4),
      info:[
        {icon:"🚗",title:"PCTC – Pure Car & Truck Carrier",body:"Gespecialiseerde voertuigdragers. Capaciteit 2.000–8.000 CEU (car equivalent units)."},
        {icon:"🚜",title:"Con-Ro",body:"Combinatie container + RoRo. Ideaal voor bouwmachines, landbouwvoertuigen en heavy equipment."},
        {icon:"⛴️",title:"Short Sea / Ferry",body:"Frequente diensten binnen Europa. DFDS en Grimaldi voor Benelux ↔ Iberisch schiereiland."},
        {icon:"📋",title:"Documenten",body:"CMR/CIM, VIN-lijst, certificate of origin, bill of lading, deactivation certificate."},
      ],
    },
  };

  const d = details[active];

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:24, flexWrap:"wrap" }}>
        {["air","sea","breakbulk","roro"].map(k=>{
          const v=MODES[k];
          return (
            <button key={k} onClick={()=>setActive(k)}
              style={{ padding:"10px 20px", borderRadius:10, cursor:"pointer", fontSize:13, fontWeight:700,
                display:"flex", alignItems:"center", gap:7,
                background:active===k?v.color:C.card,
                border:`1px solid ${active===k?v.color:C.border}`,
                color:active===k?"#fff":C.muted,
                boxShadow:active===k?`0 4px 14px ${v.glow}`:"none" }}>{v.icon} {v.label}</button>
          );
        })}
      </div>
      <div style={{ background:C.card, border:`2px solid ${mv.color}44`, borderRadius:14, padding:24, marginBottom:20, borderLeft:`4px solid ${mv.color}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
          <span style={{ fontSize:32 }}>{mv.icon}</span>
          <div>
            <div style={{ fontWeight:700, fontSize:18, color:C.text }}>{mv.label}</div>
            <div style={{ fontSize:13, color:C.muted, marginTop:3 }}>{d.desc}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:12 }}>
          {d.kpis.map(([l,v,col])=>(
            <div key={l} style={{ flex:1, background:C.surface, borderRadius:8, padding:"12px 14px" }}>
              <div style={{ fontSize:22, fontWeight:800, color:col }}>{v}</div>
              <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:.9, marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Actieve Zendingen</div>
          {d.items.map((s,i)=>(
            <div key={s.id} style={{ padding:"13px 0", borderBottom:i<d.items.length-1?`1px solid ${C.border}22`:"none" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:mv.color }}>{s.id}</div>
                  <div style={{ fontSize:13, color:C.text, marginTop:2 }}>{s.origin} → {s.dest}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{s.carrier} • {s.extra}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <Badge label={s.type} color={mv.color} />
                  <div style={{ marginTop:5 }}><Badge label={s.status} color={statusColor(s.status)} bg={statusBg(s.status)} /></div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>ETA: {s.eta}</div>
                </div>
              </div>
              <div style={{ marginTop:8 }}>
                <Bar val={s.progress} color={mv.color} h={4} />
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {d.info.map((inf,i)=>(
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:18 }}>
              <div style={{ fontSize:24, marginBottom:10 }}>{inf.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:6 }}>{inf.title}</div>
              <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{inf.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── CARRIERS ────────────────────────────────────────────────────────────────
const CarriersTab = () => {
  const [activeMode, setActiveMode] = useState("road");
  const mv = MODES[activeMode];
  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {Object.entries(MODES).map(([k,v])=>(
          <button key={k} onClick={()=>setActiveMode(k)}
            style={{ padding:"8px 16px", borderRadius:8, cursor:"pointer", fontSize:13, fontWeight:600,
              display:"flex", alignItems:"center", gap:6,
              background:activeMode===k?v.color:C.card, border:`1px solid ${activeMode===k?v.color:C.border}`,
              color:activeMode===k?"#fff":C.muted }}>{v.icon} {v.label}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
        {(CARRIERS[activeMode]||[]).map(c=>(
          <div key={c.name} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22, cursor:"pointer", transition:"border-color .2s" }}
            onMouseEnter={e=>e.currentTarget.style.borderColor=mv.color}
            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
          >
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
              <div style={{ width:42, height:42, borderRadius:10, background:`${mv.color}1A`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, border:`1px solid ${mv.color}33` }}>{mv.icon}</div>
              <div>
                <div style={{ fontWeight:700, fontSize:14 }}>{c.name}</div>
                <div style={{ fontSize:11, color:mv.color, marginTop:2 }}>{c.specialty}</div>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, marginBottom:14 }}>
              {[["Actief",c.active],["On-time",`${c.onTime}%`],["Tarief",c.unit==="euro"?`€${c.cost}`:c.unit==="dollar"?`$${c.cost}`:c.cost]].map(([l,v])=>(
                <div key={l} style={{ background:C.surface, borderRadius:7, padding:"9px 6px", textAlign:"center" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{v}</div>
                  <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:.8, marginTop:2 }}>{l}</div>
                </div>
              ))}
            </div>
            <Bar val={c.onTime} color={c.onTime>=95?C.green:c.onTime>=90?C.yellow:C.red} h={5} />
            <div style={{ marginTop:10, display:"flex", gap:3, alignItems:"center" }}>
              {[...Array(5)].map((_,i)=>(
                <span key={i} style={{ color:i<Math.round(c.rating)?mv.color:C.border, fontSize:14 }}>★</span>
              ))}
              <span style={{ fontSize:12, color:C.muted, marginLeft:4 }}>{c.rating}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ANALYTICS ───────────────────────────────────────────────────────────────
const AnalyticsTab = () => {
  const modeStats = Object.entries(MODES).map(([k,v])=>{
    const items=ALL_SHIPMENTS.filter(s=>s.mode===k);
    const onTime=items.filter(s=>s.status!=="Delayed").length;
    const delivered=items.filter(s=>s.status==="Delivered").length;
    return { ...v, key:k, count:items.length, onTimePct:items.length?Math.round((onTime/items.length)*100):0, deliveredPct:items.length?Math.round((delivered/items.length)*100):0 };
  });
  const omzetMap = {road:"€ 124K",air:"€ 218K",sea:"€ 380K",breakbulk:"€ 218K",roro:"€ 156K"};
  const trendMap = {road:8,air:14,sea:22,breakbulk:6,roro:11};

  return (
    <div>
      <div style={{ display:"flex", gap:14, marginBottom:20 }}>
        {[["Totaal zendingen (YTD)","1.284",14,C.accent],["Gem. doorlooptijd","4.2 dagen",-8,C.cyan],
          ["Klanttevredenheid","94.2%",2,C.green],["Omzet YTD","€ 8.7M",18,C.accent]].map(([l,v,t,col])=>(
          <div key={l} style={{ flex:1, background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"18px 20px" }}>
            <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800, color:C.text }}>{v}</div>
            <div style={{ fontSize:11, marginTop:4, color:t>0?C.green:C.red }}>{t>0?"▲":"▼"} {Math.abs(t)}% YoY</div>
          </div>
        ))}
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:24, marginBottom:16 }}>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Modal Performance Matrix</div>
        <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Vergelijking per vervoerswijze</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:C.surface }}>
            {["Vervoerswijze","Zendingen","On-time %","Geleverd %","Omzet","Trend"].map(h=>(
              <th key={h} style={{ textAlign:"left", padding:"12px 16px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, borderBottom:`1px solid ${C.border}` }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {modeStats.map(m=>(
              <tr key={m.key} style={{ borderBottom:`1px solid ${C.border}22` }}>
                <td style={{ padding:"14px 16px" }}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:7, fontWeight:600, fontSize:14, color:m.color }}>{m.icon} {m.label}</span>
                </td>
                <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700 }}>{m.count}</td>
                <td style={{ padding:"14px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:80 }}><Bar val={m.onTimePct} color={m.onTimePct>=95?C.green:m.onTimePct>=90?C.yellow:C.red} h={5} /></div>
                    <span style={{ fontSize:13, fontWeight:700, color:m.onTimePct>=95?C.green:m.onTimePct>=90?C.yellow:C.red }}>{m.onTimePct}%</span>
                  </div>
                </td>
                <td style={{ padding:"14px 16px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:80 }}><Bar val={m.deliveredPct} color={m.color} h={5} /></div>
                    <span style={{ fontSize:13 }}>{m.deliveredPct}%</span>
                  </div>
                </td>
                <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:m.color }}>{omzetMap[m.key]}</td>
                <td style={{ padding:"14px 16px", fontSize:13, color:C.green }}>▲ {trendMap[m.key]}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Omzetverdeling per Modus</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Aandeel per vervoerswijze</div>
          {[{label:"Zeevaart",val:43,color:C.blue},{label:"Luchtvracht",val:25,color:C.cyan},
            {label:"Breakbulk",val:15,color:C.purple},{label:"RoRo",val:11,color:C.teal},{label:"Wegvervoer",val:6,color:C.accent}
          ].map(t=>(
            <div key={t.label} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:13, color:C.muted }}>{t.label}</span>
                <span style={{ fontSize:13, fontWeight:700, color:t.color }}>{t.val}%</span>
              </div>
              <Bar val={t.val} color={t.color} h={7} />
            </div>
          ))}
        </div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Top Routes Wereldwijd</div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Frequentie per maand</div>
          {[
            {r:"Rotterdam → Shanghai",cnt:24,mode:"sea"},
            {r:"Rotterdam → Antwerpen",cnt:24,mode:"road"},
            {r:"AMS → Dubai",cnt:18,mode:"air"},
            {r:"Antwerpen → Santos",cnt:15,mode:"sea"},
            {r:"Rotterdam → Houston",cnt:9,mode:"breakbulk"},
            {r:"Zeebrugge → Baltimore",cnt:8,mode:"roro"},
          ].map((r,i)=>{
            const mv2=MODES[r.mode];
            return (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<5?`1px solid ${C.border}22`:"none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:14 }}>{mv2.icon}</span>
                  <span style={{ fontSize:13 }}>{r.r}</span>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:mv2.color }}>{r.cnt}×/mnd</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── FINANCIËN DATA ───────────────────────────────────────────────────────────
const INCOMING_INVOICES = [
  { id:"INK-2024-001", supplier:"DHL Freight",           dossier:"BNL-R-001", amount:1840.00, due:"15 Mrt", received:"01 Mrt", status:"Gematcht",    type:"Vrachtkosten",   matched:true  },
  { id:"INK-2024-002", supplier:"MSC Mediterranean",     dossier:"BNL-S-001", amount:4200.00, due:"20 Mrt", received:"02 Mrt", status:"Goedgekeurd", type:"Zeevracht",      matched:true  },
  { id:"INK-2024-003", supplier:"KLM Cargo",             dossier:"BNL-A-001", amount:2650.00, due:"10 Mrt", received:"28 Feb", status:"Betaald",      type:"Luchtvracht",    matched:true  },
  { id:"INK-2024-004", supplier:"Havenbedrijf Rotterdam",dossier:"BNL-S-002", amount:385.00,  due:"12 Mrt", received:"03 Mrt", status:"Nieuw",        type:"Havengeld",      matched:false },
  { id:"INK-2024-005", supplier:"Spliethoff",            dossier:"BNL-B-001", amount:18500.00,due:"01 Apr", received:"04 Mrt", status:"Gematcht",    type:"Zeevracht",      matched:true  },
  { id:"INK-2024-006", supplier:"Wallenius Wilhelmsen",  dossier:"BNL-RR-001",amount:9200.00, due:"25 Mrt", received:"05 Mrt", status:"Nieuw",        type:"RoRo vracht",    matched:false },
  { id:"INK-2024-007", supplier:"Ceva Logistics",        dossier:"BNL-R-003", amount:920.00,  due:"18 Mrt", received:"03 Mrt", status:"Betwist",      type:"Vrachtkosten",   matched:true  },
  { id:"INK-2024-008", supplier:"DB Schenker",           dossier:"BNL-R-002", amount:640.00,  due:"08 Mrt", received:"01 Mrt", status:"Betaald",      type:"Vrachtkosten",   matched:true  },
  { id:"INK-2024-009", supplier:"Hapag-Lloyd",           dossier:"BNL-S-002", amount:3750.00, due:"22 Mrt", received:"05 Mrt", status:"Goedgekeurd", type:"Zeevracht",      matched:true  },
  { id:"INK-2024-010", supplier:"Douane & Belasting",    dossier:null,         amount:1120.00, due:"09 Mrt", received:"04 Mrt", status:"Nieuw",        type:"Douanekosten",   matched:false },
];

const SALES_QUOTES = [
  { id:"OFF-2024-001", client:"Heineken N.V.",         contact:"P. van der Berg", mode:"sea",       route:"RTM → Shanghai",     amount:12400, status:"Gewonnen",  created:"15 Feb", validUntil:"15 Mrt", probability:100, type:"FCL 40HC" },
  { id:"OFF-2024-002", client:"ASML Holding",          contact:"M. Jansen",       mode:"air",       route:"AMS → Taipei",       amount:8750,  status:"Verstuurd", created:"20 Feb", validUntil:"20 Mrt", probability:70,  type:"Express Air" },
  { id:"OFF-2024-003", client:"Shell Netherlands",     contact:"K. Smits",        mode:"breakbulk", route:"RTM → Houston",      amount:42000, status:"Concept",   created:"28 Feb", validUntil:"28 Mrt", probability:40,  type:"Heavy Lift" },
  { id:"OFF-2024-004", client:"Philips Medical",       contact:"R. de Vries",     mode:"air",       route:"AMS → Chicago",      amount:5200,  status:"Gewonnen",  created:"10 Feb", validUntil:"10 Mrt", probability:100, type:"Charter" },
  { id:"OFF-2024-005", client:"Volvo Group Gent",      contact:"L. Claes",        mode:"roro",      route:"ZEE → Baltimore",    amount:22800, status:"Verstuurd", created:"01 Mrt", validUntil:"31 Mrt", probability:60,  type:"PCTC" },
  { id:"OFF-2024-006", client:"Borealis AG",           contact:"T. Müller",       mode:"sea",       route:"ANT → Singapore",    amount:7800,  status:"Verloren",  created:"05 Feb", validUntil:"05 Mrt", probability:0,   type:"FCL 20'" },
  { id:"OFF-2024-007", client:"Umicore NV",            contact:"S. Peeters",      mode:"sea",       route:"ANT → Durban",       amount:6400,  status:"Concept",   created:"03 Mrt", validUntil:"03 Apr", probability:30,  type:"LCL" },
  { id:"OFF-2024-008", client:"ArcelorMittal",         contact:"F. Dubois",       mode:"breakbulk", route:"GNT → New Orleans",  amount:58000, status:"Verstuurd", created:"02 Mrt", validUntil:"02 Apr", probability:55,  type:"Project Cargo" },
];

const OUTGOING_INVOICES = [
  { id:"UIT-2024-001", client:"Heineken N.V.",     dossier:"BNL-S-001", amount:13980, costs:4200,  margin:9780,  issued:"01 Mrt", due:"31 Mrt", status:"Verstuurd", mode:"sea"       },
  { id:"UIT-2024-002", client:"KLM Ground",        dossier:"BNL-A-002", amount:4850,  costs:2650,  margin:2200,  issued:"04 Mrt", due:"04 Apr", status:"Betaald",   mode:"air"       },
  { id:"UIT-2024-003", client:"Philips Medical",   dossier:"BNL-A-004", amount:5980,  costs:3200,  margin:2780,  issued:"06 Mrt", due:"05 Apr", status:"Verstuurd", mode:"air"       },
  { id:"UIT-2024-004", client:"Shell Netherlands", dossier:"BNL-R-001", amount:2240,  costs:1840,  margin:400,   issued:"05 Mrt", due:"04 Apr", status:"Concept",   mode:"road"      },
  { id:"UIT-2024-005", client:"Volvo Gent",        dossier:"BNL-RR-004",amount:24500, costs:9200,  margin:15300, issued:"02 Mrt", due:"01 Apr", status:"Betaald",   mode:"roro"      },
  { id:"UIT-2024-006", client:"Siemens Gamesa",    dossier:"BNL-B-003", amount:42000, costs:18500, margin:23500, issued:"28 Feb", due:"29 Mrt", status:"Achterstallig", mode:"breakbulk" },
  { id:"UIT-2024-007", client:"ASML Holding",      dossier:"BNL-A-001", amount:3100,  costs:1840,  margin:1260,  issued:"05 Mrt", due:"04 Apr", status:"Verstuurd", mode:"air"       },
  { id:"UIT-2024-008", client:"Borealis AG",        dossier:"BNL-S-003", amount:9200,  costs:3750,  margin:5450,  issued:"03 Mrt", due:"02 Apr", status:"Concept",   mode:"sea"       },
];

const inkStatusColor = s => ({ "Nieuw":C.yellow,"Gematcht":C.cyan,"Goedgekeurd":C.blue,"Betaald":C.green,"Betwist":C.red }[s]||C.muted);
const inkStatusBg    = s => ({ "Nieuw":"rgba(234,179,8,.12)","Gematcht":"rgba(0,194,224,.12)","Goedgekeurd":"rgba(58,123,245,.12)","Betaald":"rgba(34,197,94,.12)","Betwist":"rgba(239,68,68,.12)" }[s]||"rgba(90,106,136,.12)");
const salesStatusColor = s => ({ "Gewonnen":C.green,"Verstuurd":C.blue,"Concept":C.yellow,"Verloren":C.red }[s]||C.muted);
const salesStatusBg    = s => ({ "Gewonnen":"rgba(34,197,94,.12)","Verstuurd":"rgba(58,123,245,.12)","Concept":"rgba(234,179,8,.12)","Verloren":"rgba(239,68,68,.12)" }[s]||"rgba(90,106,136,.12)");
const uitStatusColor = s => ({ "Concept":C.yellow,"Verstuurd":C.blue,"Betaald":C.green,"Achterstallig":C.red }[s]||C.muted);
const uitStatusBg    = s => ({ "Concept":"rgba(234,179,8,.12)","Verstuurd":"rgba(58,123,245,.12)","Betaald":"rgba(34,197,94,.12)","Achterstallig":"rgba(239,68,68,.12)" }[s]||"rgba(90,106,136,.12)");

const fmt = (n) => "€ " + Number(n).toLocaleString("nl-NL", { minimumFractionDigits:2, maximumFractionDigits:2 });

// ─── INKOMENDE FACTUREN ───────────────────────────────────────────────────────
const InkomendeFacturen = () => {
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("Alle");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanDossier, setScanDossier] = useState("");

  const data = INCOMING_INVOICES.filter(i =>
    (filter==="Alle" || i.status===filter) &&
    (i.id+i.supplier+(i.dossier||"")).toLowerCase().includes(search.toLowerCase())
  );

  const totaalOpenstaand = INCOMING_INVOICES.filter(i=>i.status!=="Betaald").reduce((a,b)=>a+b.amount,0);
  const totaalBetaald    = INCOMING_INVOICES.filter(i=>i.status==="Betaald").reduce((a,b)=>a+b.amount,0);
  const nieuw            = INCOMING_INVOICES.filter(i=>i.status==="Nieuw").length;

  const handleScan = () => {
    if (!scanDossier.trim()) return;
    setScanning(true);
    setTimeout(() => {
      const match = ALL_SHIPMENTS.find(s => s.id.toLowerCase() === scanDossier.trim().toLowerCase());
      setScanResult(match ? {
        found: true, shipment: match,
        invoice: { supplier: match.carrier, amount: Math.round(Math.random()*8000+800), type:"Vrachtkosten" }
      } : { found: false });
      setScanning(false);
    }, 1400);
  };

  return (
    <div>
      {/* KPIs */}
      <div style={{ display:"flex", gap:14, marginBottom:20 }}>
        {[
          ["Openstaand", fmt(totaalOpenstaand), "🧾", C.yellow, nieuw+" nieuw"],
          ["Betaald (mnd)", fmt(totaalBetaald), "✅", C.green, null],
          ["Niet gematcht", INCOMING_INVOICES.filter(i=>!i.matched).length, "🔗", C.red, "dossier onbekend"],
          ["Betwist", INCOMING_INVOICES.filter(i=>i.status==="Betwist").length, "⚠️", C.red, null],
        ].map(([l,v,icon,col,sub])=>(
          <KPI key={l} label={l} value={v} icon={icon} color={col} sub={sub} />
        ))}
      </div>

      {/* Auto-inlezen op dossier */}
      <div style={{ background:C.card, border:`1px solid ${C.cyan}44`, borderRadius:12, padding:22, marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:`${C.cyan}18`, border:`1px solid ${C.cyan}44`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>🔍</div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, color:C.text }}>Factuur automatisch inlezen</div>
            <div style={{ fontSize:12, color:C.muted }}>Voer dossiernummer in — systeem koppelt automatisch leverancier, kosten en zending</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
          <div style={{ flex:1 }}>
            <input value={scanDossier} onChange={e=>setScanDossier(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleScan()}
              placeholder="Bv. BNL-S-001 of BNL-RR-001"
              style={{ width:"100%", padding:"10px 14px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:14, outline:"none", boxSizing:"border-box" }} />
          </div>
          <button onClick={handleScan} disabled={scanning}
            style={{ padding:"10px 22px", background:C.cyan, border:"none", borderRadius:8, color:"#000", fontWeight:700, fontSize:13, cursor:"pointer", whiteSpace:"nowrap", opacity:scanning?.7:1 }}>
            {scanning ? "⟳ Scannen..." : "Inlezen"}
          </button>
          <label style={{ padding:"10px 16px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, color:C.muted, fontWeight:600, fontSize:13, cursor:"pointer", whiteSpace:"nowrap" }}>
            📎 PDF uploaden
            <input type="file" accept=".pdf" style={{ display:"none" }} onChange={()=>{}} />
          </label>
        </div>

        {/* Scan result */}
        {scanResult && (
          <div style={{ marginTop:14, padding:16,
            background: scanResult.found ? `${C.green}0A` : `${C.red}0A`,
            border:`1px solid ${scanResult.found ? C.green+"44" : C.red+"44"}`,
            borderRadius:10 }}>
            {scanResult.found ? (
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                  <span style={{ color:C.green, fontSize:18 }}>✓</span>
                  <span style={{ fontWeight:700, color:C.green }}>Dossier gevonden — factuur gekoppeld</span>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
                  {[
                    ["Dossier", scanResult.shipment.id],
                    ["Leverancier", scanResult.shipment.carrier],
                    ["Route", `${scanResult.shipment.origin} → ${scanResult.shipment.dest}`],
                    ["Geschat bedrag", fmt(scanResult.invoice.amount)],
                  ].map(([l,v])=>(
                    <div key={l} style={{ background:C.surface, borderRadius:7, padding:"8px 12px" }}>
                      <div style={{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:.8, marginBottom:3 }}>{l}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:C.text }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:"flex", gap:8, marginTop:12 }}>
                  <button onClick={()=>setScanResult(null)} style={{ padding:"7px 18px", background:C.green, border:"none", borderRadius:7, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>Goedkeuren & Opslaan</button>
                  <button onClick={()=>setScanResult(null)} style={{ padding:"7px 18px", background:"none", border:`1px solid ${C.border}`, borderRadius:7, color:C.muted, fontSize:12, cursor:"pointer" }}>Aanpassen</button>
                </div>
              </div>
            ) : (
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ color:C.red, fontSize:18 }}>✕</span>
                <span style={{ color:C.red, fontWeight:600 }}>Dossier "{scanDossier}" niet gevonden. Controleer het nummer en probeer opnieuw.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter + table */}
      <div style={{ display:"flex", gap:10, marginBottom:14, alignItems:"center" }}>
        <input placeholder="🔍  Zoek op factuurnr, leverancier, dossier..."
          value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, padding:"9px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, outline:"none" }} />
        <div style={{ display:"flex", gap:6 }}>
          {["Alle","Nieuw","Gematcht","Goedgekeurd","Betaald","Betwist"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{ padding:"7px 13px", borderRadius:7, fontSize:11, cursor:"pointer", fontWeight:600,
                background:filter===f?C.cyan:C.card, border:`1px solid ${filter===f?C.cyan:C.border}`,
                color:filter===f?"#000":C.muted }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:C.surface }}>
            {["Factuurnr.","Leverancier","Dossier","Type","Bedrag","Ontvangen","Vervaldatum","Status",""].map(h=>(
              <th key={h} style={{ textAlign:"left", padding:"12px 14px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {data.map(inv=>(
              <tr key={inv.id}
                style={{ borderBottom:`1px solid ${C.border}22`, cursor:"pointer", transition:"background .1s" }}
                onMouseEnter={e=>e.currentTarget.style.background=C.surface}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              >
                <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700, color:C.cyan }}>{inv.id}</td>
                <td style={{ padding:"12px 14px", fontSize:13 }}>{inv.supplier}</td>
                <td style={{ padding:"12px 14px" }}>
                  {inv.dossier
                    ? <span style={{ fontSize:12, fontWeight:600, color:C.accent, background:`${C.accent}18`, padding:"2px 8px", borderRadius:20 }}>{inv.dossier}</span>
                    : <span style={{ fontSize:12, color:C.red }}>⚠ Niet gematcht</span>
                  }
                </td>
                <td style={{ padding:"12px 14px", fontSize:12, color:C.muted }}>{inv.type}</td>
                <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700 }}>{fmt(inv.amount)}</td>
                <td style={{ padding:"12px 14px", fontSize:12, color:C.muted }}>{inv.received}</td>
                <td style={{ padding:"12px 14px", fontSize:12, color:C.muted }}>{inv.due}</td>
                <td style={{ padding:"12px 14px" }}><Badge label={inv.status} color={inkStatusColor(inv.status)} bg={inkStatusBg(inv.status)} /></td>
                <td style={{ padding:"12px 14px" }}>
                  <div style={{ display:"flex", gap:5 }}>
                    <button style={{ padding:"3px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:5, fontSize:11, color:C.muted, cursor:"pointer" }}>Bekijken</button>
                    {inv.status==="Nieuw"&&<button style={{ padding:"3px 10px", background:C.cyan, border:"none", borderRadius:5, fontSize:11, color:"#000", fontWeight:600, cursor:"pointer" }}>Match</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop:10, fontSize:12, color:C.muted }}>{data.length} facturen weergegeven</div>
    </div>
  );
};

// ─── EXTRA SALES DATA ────────────────────────────────────────────────────────
const SALES_ACTIVITIES = [
  { id:1, type:"call",    client:"Heineken N.V.",     user:"J. Vermeer", note:"Follow-up offerte FCL Shanghai",    date:"05 Mrt", done:true  },
  { id:2, type:"email",   client:"ASML Holding",      user:"M. de Boer", note:"Offertebevestiging Air Express",     date:"05 Mrt", done:false },
  { id:3, type:"meeting", client:"Shell Netherlands", user:"J. Vermeer", note:"Kick-off project cargo Houston",     date:"06 Mrt", done:false },
  { id:4, type:"call",    client:"Volvo Group Gent",  user:"L. Peters",  note:"Prijsonderhandeling RoRo Baltimore", date:"07 Mrt", done:false },
  { id:5, type:"email",   client:"ArcelorMittal",     user:"M. de Boer", note:"Technische specs breakbulk aanvraag",date:"04 Mrt", done:true  },
];

const CLIENTS = [
  { name:"Heineken N.V.",      sector:"FMCG",        contact:"P. van der Berg", revenue:124000, quotes:8,  won:6, mode:"sea",       country:"NL" },
  { name:"ASML Holding",       sector:"Tech",        contact:"M. Jansen",       revenue:89500,  quotes:5,  won:3, mode:"air",       country:"NL" },
  { name:"Shell Netherlands",  sector:"Energie",     contact:"K. Smits",        revenue:210000, quotes:12, won:9, mode:"breakbulk", country:"NL" },
  { name:"Philips Medical",    sector:"Medisch",     contact:"R. de Vries",     revenue:67000,  quotes:4,  won:4, mode:"air",       country:"NL" },
  { name:"Volvo Group Gent",   sector:"Automotive",  contact:"L. Claes",        revenue:98000,  quotes:7,  won:4, mode:"roro",      country:"BE" },
  { name:"ArcelorMittal",      sector:"Staal",       contact:"F. Dubois",       revenue:145000, quotes:9,  won:5, mode:"breakbulk", country:"BE" },
  { name:"Umicore NV",         sector:"Chemie",      contact:"S. Peeters",      revenue:52000,  quotes:3,  won:1, mode:"sea",       country:"BE" },
  { name:"Borealis AG",        sector:"Chemie",      contact:"T. Müller",       revenue:38000,  quotes:4,  won:2, mode:"sea",       country:"AT" },
];

const SALES_TARGETS = [
  { rep:"J. Vermeer",  target:280000, achieved:198000, quotes:14, won:9 },
  { rep:"M. de Boer",  target:220000, achieved:167000, quotes:11, won:7 },
  { rep:"L. Peters",   target:190000, achieved:124000, quotes:9,  won:5 },
];

// ─── SALES MODULE ────────────────────────────────────────────────────────────
const SalesTab = () => {
  const [sub,    setSub]    = useState("dashboard");
  const [filter, setFilter] = useState("Alle");
  const [view,   setView]   = useState("list");
  const [search, setSearch] = useState("");
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  const PIPELINE_STAGES = ["Concept","Verstuurd","Gewonnen","Verloren"];

  const filteredQuotes = SALES_QUOTES.filter(q=>
    (filter==="Alle"||q.status===filter) &&
    (q.id+q.client+q.route+q.contact).toLowerCase().includes(search.toLowerCase())
  );

  const pipelineValue = SALES_QUOTES.filter(q=>q.status!=="Verloren").reduce((a,q)=>a+q.amount*(q.probability/100),0);
  const gewonnen      = SALES_QUOTES.filter(q=>q.status==="Gewonnen").reduce((a,q)=>a+q.amount,0);
  const verstuurd     = SALES_QUOTES.filter(q=>q.status==="Verstuurd").reduce((a,q)=>a+q.amount,0);

  const subTabs = [
    { id:"dashboard",  label:"Dashboard",  icon:"⬡" },
    { id:"leads",      label:"Leads",      icon:"📥", badge: LEADS_DATA.filter(l=>l.status==="Nieuw").length },
    { id:"inquiries",  label:"Aanvragen",  icon:"📩", badge: INQUIRIES_DATA.filter(i=>i.status==="Open").length },
    { id:"offertes",   label:"Offertes",   icon:"📋", badge: SALES_QUOTES.filter(q=>q.status==="Verstuurd").length },
    { id:"klanten",    label:"Klanten",    icon:"🏢" },
    { id:"targets",    label:"Targets",    icon:"🎯" },
    { id:"activiteit", label:"Activiteit", icon:"📅", badge: SALES_ACTIVITIES.filter(a=>!a.done).length },
  ];

  const activityIcon = t => ({ call:"📞", email:"📧", meeting:"🤝" }[t]||"📌");

  return (
    <div>
      {/* Sub-navigation */}
      <div style={{ display:"flex", gap:8, marginBottom:24, borderBottom:`1px solid ${C.border}`, paddingBottom:0 }}>
        {subTabs.map(t=>(
          <button key={t.id} onClick={()=>setSub(t.id)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 16px", cursor:"pointer", fontWeight:600, fontSize:13,
              background:"none", border:"none",
              color: sub===t.id ? C.green : C.muted,
              borderBottom: sub===t.id ? `2px solid ${C.green}` : "2px solid transparent",
              marginBottom:-1, transition:"all .15s" }}>
            {t.icon} {t.label}
            {t.badge>0&&<span style={{ background:C.green, color:"#fff", padding:"1px 6px", borderRadius:10, fontSize:10, fontWeight:700 }}>{t.badge}</span>}
          </button>
        ))}
        <div style={{ flex:1 }} />
        <button onClick={()=>setShowQuoteModal(true)}
          style={{ padding:"8px 18px", background:C.green, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", marginBottom:8, alignSelf:"center" }}>
          + Nieuwe Offerte
        </button>
      </div>

      {/* ── SALES DASHBOARD ── */}
      {sub==="leads"     && <LeadsPanel />}
      {sub==="inquiries" && <InquiriesPanel />}
      {sub==="dashboard" && (
        <div>
          <div style={{ display:"flex", gap:14, marginBottom:20 }}>
            <KPI label="Pipeline (gewogen)" value={fmt(pipelineValue)} icon="💰" color={C.green} sub="kansgewogen totaal" />
            <KPI label="Gewonnen (mnd)"     value={fmt(gewonnen)}      icon="🏆" color={C.green} trend={14} />
            <KPI label="Openstaande offertes" value={fmt(verstuurd)}   icon="📤" color={C.blue}  sub={SALES_QUOTES.filter(q=>q.status==="Verstuurd").length+" stuks"} />
            <KPI label="Conversieratio"     value="62%"                icon="📈" color={C.accent} trend={8} />
            <KPI label="Actieve klanten"    value={CLIENTS.length}     icon="🏢" color={C.purple} sub="in portfolio" />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            {/* Pipeline funnel */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Pipeline Funnel</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Huidig kwartaal</div>
              {PIPELINE_STAGES.map((stage,i)=>{
                const items = SALES_QUOTES.filter(q=>q.status===stage);
                const val   = items.reduce((a,q)=>a+q.amount,0);
                const col   = salesStatusColor(stage);
                const widths = [100, 75, 50, 30];
                return (
                  <div key={stage} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontSize:13, display:"flex", alignItems:"center", gap:8 }}>
                        <span style={{ width:10, height:10, borderRadius:2, background:col, display:"inline-block" }} />
                        {stage}
                        <span style={{ fontSize:11, color:C.muted }}>({items.length})</span>
                      </span>
                      <span style={{ fontSize:13, fontWeight:700, color:col }}>{fmt(val)}</span>
                    </div>
                    <div style={{ height:8, background:C.border, borderRadius:4, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${widths[i]}%`, background:col, borderRadius:4 }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Omzet per modus */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Offertes per Vervoerswijze</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Verdeling gewonnen + lopend</div>
              {Object.entries(MODES).map(([k,v])=>{
                const modeQuotes = SALES_QUOTES.filter(q=>q.mode===k);
                const modeVal    = modeQuotes.reduce((a,q)=>a+q.amount,0);
                if (!modeQuotes.length) return null;
                return (
                  <div key={k} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:13 }}>{v.icon} {v.label} <span style={{ fontSize:11, color:C.muted }}>({modeQuotes.length})</span></span>
                      <span style={{ fontSize:13, fontWeight:700, color:v.color }}>{fmt(modeVal)}</span>
                    </div>
                    <Bar val={modeVal} max={SALES_QUOTES.reduce((a,q)=>a+q.amount,0)} color={v.color} h={6} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent activity + open quotes */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Recente Activiteit</div>
              {SALES_ACTIVITIES.map(a=>(
                <div key={a.id} style={{ display:"flex", gap:10, padding:"10px 0", borderBottom:`1px solid ${C.border}22`, opacity:a.done?.6:1 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:C.surface, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{activityIcon(a.type)}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:a.done?C.muted:C.text }}>{a.client}</div>
                    <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{a.note}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:3 }}>{a.user} • {a.date}</div>
                  </div>
                  <div style={{ fontSize:10, padding:"2px 8px", borderRadius:20, height:"fit-content",
                    background:a.done?`${C.green}18`:`${C.yellow}18`, color:a.done?C.green:C.yellow, fontWeight:600 }}>
                    {a.done?"✓ Gedaan":"Open"}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Offertes Verlopen Binnenkort</div>
              {SALES_QUOTES.filter(q=>q.status==="Verstuurd").map(q=>{
                const mv=MODES[q.mode];
                return (
                  <div key={q.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}22` }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600 }}>{q.client}</div>
                      <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{mv.icon} {q.route} • {q.type}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:13, fontWeight:700, color:C.green }}>{fmt(q.amount)}</div>
                      <div style={{ fontSize:10, color:C.yellow, marginTop:2 }}>Vervalt {q.validUntil}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── OFFERTES ── */}
      {sub==="offertes" && (
        <div>
          <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
            <input placeholder="🔍  Zoek op klant, route, offertenr., contact..."
              value={search} onChange={e=>setSearch(e.target.value)}
              style={{ flex:1, padding:"9px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, outline:"none" }} />
            <div style={{ display:"flex", gap:6 }}>
              {["Alle",...PIPELINE_STAGES].map(f=>(
                <button key={f} onClick={()=>setFilter(f)}
                  style={{ padding:"7px 13px", borderRadius:7, fontSize:11, cursor:"pointer", fontWeight:600,
                    background:filter===f?C.green:C.card, border:`1px solid ${filter===f?C.green:C.border}`,
                    color:filter===f?"#fff":C.muted }}>{f}</button>
              ))}
            </div>
            <div style={{ display:"flex", gap:4, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:3 }}>
              {[["list","☰ Lijst"],["pipeline","⬛ Pipeline"]].map(([v,lbl])=>(
                <button key={v} onClick={()=>setView(v)}
                  style={{ padding:"5px 12px", borderRadius:6, border:"none", cursor:"pointer", fontSize:12,
                    background:view===v?C.surface:"transparent", color:view===v?C.text:C.muted, fontWeight:view===v?600:400 }}>{lbl}</button>
              ))}
            </div>
          </div>

          {view==="pipeline" ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
              {PIPELINE_STAGES.map(stage=>{
                const items = SALES_QUOTES.filter(q=>q.status===stage);
                const stageVal = items.reduce((a,q)=>a+q.amount,0);
                const col = salesStatusColor(stage);
                return (
                  <div key={stage} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:16, minHeight:320 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14,
                      paddingBottom:10, borderBottom:`2px solid ${col}44` }}>
                      <span style={{ fontSize:12, fontWeight:700, color:col, textTransform:"uppercase", letterSpacing:.8 }}>{stage}</span>
                      <div style={{ textAlign:"right" }}>
                        <div style={{ fontSize:13, fontWeight:800, color:col }}>{fmt(stageVal)}</div>
                        <div style={{ fontSize:10, color:C.muted }}>{items.length} offertes</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                      {items.map(q=>{
                        const mv=MODES[q.mode];
                        return (
                          <div key={q.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:9, padding:12, cursor:"pointer" }}
                            onMouseEnter={e=>e.currentTarget.style.borderColor=col}
                            onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
                          >
                            <div style={{ fontSize:10, color:C.muted, marginBottom:3 }}>{q.id}</div>
                            <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:2 }}>{q.client}</div>
                            <div style={{ fontSize:11, color:C.muted, marginBottom:2 }}>{q.contact}</div>
                            <div style={{ fontSize:11, color:mv.color, marginBottom:8 }}>{mv.icon} {q.route}</div>
                            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
                              <span style={{ fontSize:14, fontWeight:800, color:col }}>{fmt(q.amount)}</span>
                              <span style={{ fontSize:10, color:C.muted }}>{q.probability}% kans</span>
                            </div>
                            <Bar val={q.probability} color={col} h={3} />
                            <div style={{ fontSize:10, color:C.muted, marginTop:5 }}>Geldig t/m {q.validUntil}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead><tr style={{ background:C.surface }}>
                  {["Offertenr.","Klant","Contact","Modus","Route","Type","Bedrag","Kans","Geldig tot","Status","Acties"].map(h=>(
                    <th key={h} style={{ textAlign:"left", padding:"12px 14px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {filteredQuotes.map(q=>{
                    const mv=MODES[q.mode];
                    return (
                      <tr key={q.id}
                        style={{ borderBottom:`1px solid ${C.border}22`, cursor:"pointer", transition:"background .1s" }}
                        onMouseEnter={e=>e.currentTarget.style.background=C.surface}
                        onMouseLeave={e=>e.currentTarget.style.background="transparent"}
                      >
                        <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700, color:C.green }}>{q.id}</td>
                        <td style={{ padding:"12px 14px", fontSize:13, fontWeight:600 }}>{q.client}</td>
                        <td style={{ padding:"12px 14px", fontSize:12, color:C.muted }}>{q.contact}</td>
                        <td style={{ padding:"12px 14px" }}>
                          <span style={{ fontSize:11, padding:"2px 8px", borderRadius:20, background:`${mv.color}18`, color:mv.color, fontWeight:600 }}>{mv.icon} {mv.label}</span>
                        </td>
                        <td style={{ padding:"12px 14px", fontSize:13 }}>{q.route}</td>
                        <td style={{ padding:"12px 14px", fontSize:12, color:C.muted, whiteSpace:"nowrap" }}>{q.type}</td>
                        <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700 }}>{fmt(q.amount)}</td>
                        <td style={{ padding:"12px 14px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <div style={{ width:48 }}><Bar val={q.probability} color={salesStatusColor(q.status)} h={4} /></div>
                            <span style={{ fontSize:12, color:salesStatusColor(q.status), fontWeight:600 }}>{q.probability}%</span>
                          </div>
                        </td>
                        <td style={{ padding:"12px 14px", fontSize:12, color:C.muted, whiteSpace:"nowrap" }}>{q.validUntil}</td>
                        <td style={{ padding:"12px 14px" }}><Badge label={q.status} color={salesStatusColor(q.status)} bg={salesStatusBg(q.status)} /></td>
                        <td style={{ padding:"12px 14px" }}>
                          <div style={{ display:"flex", gap:5 }}>
                            <button style={{ padding:"3px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:5, fontSize:11, color:C.muted, cursor:"pointer" }}>Bekijken</button>
                            {q.status==="Concept"&&<button style={{ padding:"3px 10px", background:C.green, border:"none", borderRadius:5, fontSize:11, color:"#fff", fontWeight:600, cursor:"pointer" }}>Versturen</button>}
                            {q.status==="Verstuurd"&&<button style={{ padding:"3px 10px", background:C.blue, border:"none", borderRadius:5, fontSize:11, color:"#fff", fontWeight:600, cursor:"pointer" }}>Follow-up</button>}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── KLANTEN ── */}
      {sub==="klanten" && (
        <div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {CLIENTS.map(cl=>{
              const mv=MODES[cl.mode];
              const convRate=Math.round((cl.won/cl.quotes)*100);
              return (
                <div key={cl.name} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22, cursor:"pointer", transition:"border-color .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=mv.color}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
                >
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, color:C.text }}>{cl.name}</div>
                      <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>{cl.contact} • {cl.country}</div>
                      <div style={{ fontSize:11, color:mv.color, marginTop:2 }}>{mv.icon} {mv.label}</div>
                    </div>
                    <div style={{ padding:"3px 10px", borderRadius:20, background:`${C.purple}18`, border:`1px solid ${C.purple}33`, fontSize:11, color:C.purple, fontWeight:600 }}>{cl.sector}</div>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14 }}>
                    {[["Omzet",fmt(cl.revenue)],["Offertes",cl.quotes],["Gewonnen",cl.won]].map(([l,v])=>(
                      <div key={l} style={{ background:C.surface, borderRadius:7, padding:"8px 10px", textAlign:"center" }}>
                        <div style={{ fontSize:13, fontWeight:700, color:C.text }}>{v}</div>
                        <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:.8, marginTop:2 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:11, color:C.muted }}>Conversieratio</span>
                      <span style={{ fontSize:11, fontWeight:700, color:convRate>=70?C.green:convRate>=50?C.yellow:C.red }}>{convRate}%</span>
                    </div>
                    <Bar val={convRate} color={convRate>=70?C.green:convRate>=50?C.yellow:C.red} h={5} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TARGETS ── */}
      {sub==="targets" && (
        <div>
          <div style={{ display:"flex", gap:14, marginBottom:20 }}>
            <KPI label="Team target"    value={fmt(SALES_TARGETS.reduce((a,t)=>a+t.target,0))}    icon="🎯" color={C.green} sub="kwartaaldoel" />
            <KPI label="Team achieved"  value={fmt(SALES_TARGETS.reduce((a,t)=>a+t.achieved,0))}  icon="✅" color={C.green} trend={11} />
            <KPI label="Team gap"       value={fmt(SALES_TARGETS.reduce((a,t)=>a+(t.target-t.achieved),0))} icon="📉" color={C.yellow} sub="nog te halen" />
            <KPI label="Team conversie" value={Math.round(SALES_TARGETS.reduce((a,t)=>a+t.won,0)/SALES_TARGETS.reduce((a,t)=>a+t.quotes,0)*100)+"%" } icon="📈" color={C.accent} />
          </div>

          {/* Per rep */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, marginBottom:20 }}>
            {SALES_TARGETS.map(rep=>{
              const pct = Math.round((rep.achieved/rep.target)*100);
              const col = pct>=90?C.green:pct>=65?C.yellow:C.red;
              return (
                <div key={rep.rep} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:24 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
                    <div style={{ width:40, height:40, borderRadius:"50%", background:`linear-gradient(135deg,${C.green},${C.blue})`,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"#fff" }}>
                      {rep.rep.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15 }}>{rep.rep}</div>
                      <div style={{ fontSize:11, color:C.muted }}>Sales Representative</div>
                    </div>
                  </div>

                  <div style={{ marginBottom:16 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                      <span style={{ fontSize:12, color:C.muted }}>Target voortgang</span>
                      <span style={{ fontSize:14, fontWeight:800, color:col }}>{pct}%</span>
                    </div>
                    <div style={{ height:12, background:C.border, borderRadius:6, overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, background:col, borderRadius:6, transition:"width .5s" }} />
                    </div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                      <span style={{ fontSize:11, color:C.muted }}>{fmt(rep.achieved)}</span>
                      <span style={{ fontSize:11, color:C.muted }}>{fmt(rep.target)}</span>
                    </div>
                  </div>

                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    {[["Offertes",rep.quotes],["Gewonnen",rep.won],["Conv.",Math.round(rep.won/rep.quotes*100)+"%"]].map(([l,v])=>(
                      <div key={l} style={{ background:C.surface, borderRadius:7, padding:"8px 6px", textAlign:"center" }}>
                        <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{v}</div>
                        <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:.8, marginTop:2 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Maandoverzicht */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Maandelijkse omzet vs. target</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Okt 2023 — Mrt 2024</div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:140 }}>
              {[{m:"Okt",t:80000,a:72000},{m:"Nov",t:80000,a:88000},{m:"Dec",t:90000,a:95000},{m:"Jan",t:80000,a:68000},{m:"Feb",t:85000,a:82000},{m:"Mrt",t:90000,a:55000}].map((d,i)=>{
                const maxV=100000;
                return (
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                    <div style={{ width:"100%", display:"flex", gap:3, alignItems:"flex-end", height:110 }}>
                      <div title={`Target: ${fmt(d.t)}`} style={{ flex:1, background:`${C.border}88`, borderRadius:"3px 3px 0 0", height:`${(d.t/maxV)*100}%` }} />
                      <div title={`Behaald: ${fmt(d.a)}`} style={{ flex:1, background:d.a>=d.t?C.green:C.accent, borderRadius:"3px 3px 0 0", height:`${(d.a/maxV)*100}%` }} />
                    </div>
                    <div style={{ fontSize:10, color:C.muted }}>{d.m}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ display:"flex", gap:16, marginTop:10, justifyContent:"flex-end" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:10, height:10, background:`${C.border}88`, borderRadius:2 }} /><span style={{ fontSize:11, color:C.muted }}>Target</span></div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:10, height:10, background:C.green, borderRadius:2 }} /><span style={{ fontSize:11, color:C.muted }}>Behaald</span></div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:10, height:10, background:C.accent, borderRadius:2 }} /><span style={{ fontSize:11, color:C.muted }}>Onder target</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ── ACTIVITEIT ── */}
      {sub==="activiteit" && (
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div>
              <div style={{ fontWeight:700, fontSize:16 }}>Activiteiten & Taken</div>
              <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{SALES_ACTIVITIES.filter(a=>!a.done).length} openstaande taken</div>
            </div>
            <button style={{ padding:"8px 18px", background:C.green, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>+ Activiteit toevoegen</button>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {SALES_ACTIVITIES.map(a=>(
              <div key={a.id} style={{ background:C.card, border:`1px solid ${a.done?C.border:C.green+"44"}`, borderRadius:12, padding:18,
                display:"flex", gap:14, alignItems:"flex-start", opacity:a.done?.7:1 }}>
                <div style={{ width:40, height:40, borderRadius:10, background:a.done?C.surface:`${C.green}18`,
                  border:`1px solid ${a.done?C.border:C.green+"44"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
                  {activityIcon(a.type)}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14 }}>{a.client}</div>
                      <div style={{ fontSize:13, color:C.muted, marginTop:3 }}>{a.note}</div>
                      <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>
                        <span style={{ textTransform:"capitalize" }}>{a.type}</span> • {a.user} • {a.date}
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                      <span style={{ padding:"3px 10px", borderRadius:20, fontSize:11, fontWeight:600,
                        background:a.done?`${C.green}18`:`${C.yellow}18`, color:a.done?C.green:C.yellow }}>
                        {a.done?"✓ Gedaan":"Open"}
                      </span>
                      {!a.done&&<button style={{ padding:"5px 14px", background:C.green, border:"none", borderRadius:7, fontSize:11, color:"#fff", fontWeight:600, cursor:"pointer" }}>Afronden</button>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Quote Modal */}
      {showQuoteModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.78)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(6px)" }}
          onClick={()=>setShowQuoteModal(false)}>
          <div style={{ background:C.card, border:`1px solid ${C.green}55`, borderRadius:18, padding:32, width:520, maxWidth:"92vw" }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
              <div style={{ fontWeight:700, fontSize:18 }}>Nieuwe Offerte</div>
              <button onClick={()=>setShowQuoteModal(false)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:22 }}>✕</button>
            </div>
            {[["Klant","client","Bv. Heineken N.V."],["Contactpersoon","contact","Bv. P. van der Berg"],["Route","route","Bv. Rotterdam → Shanghai"],["Offertewaarde (€)","amount","Bv. 12400"]].map(([lbl,k,ph])=>(
              <div key={k} style={{ marginBottom:14 }}>
                <FieldLabel>{lbl}</FieldLabel>
                <TextInput value="" onChange={()=>{}} placeholder={ph} />
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <FieldLabel>Vervoerswijze</FieldLabel>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {Object.entries(MODES).map(([k,v])=>(
                  <button key={k} style={{ padding:"6px 13px", borderRadius:7, background:C.surface, border:`1px solid ${C.border}`, color:C.muted, fontSize:12, cursor:"pointer" }}>{v.icon} {v.label}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom:22 }}>
              <FieldLabel>Kans op order (%)</FieldLabel>
              <TextInput value="" onChange={()=>{}} placeholder="Bv. 70" />
            </div>
            <button onClick={()=>setShowQuoteModal(false)} style={{ width:"100%", padding:"12px 0", background:C.green, border:"none", borderRadius:10, color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer" }}>
              💼 Offerte Aanmaken
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── UITGAANDE FACTUREN ───────────────────────────────────────────────────────
const UitgaandeFacturen = () => {
  const [filter, setFilter] = useState("Alle");
  const [search, setSearch] = useState("");
  const [newInvoice, setNewInvoice] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState("");

  const data = OUTGOING_INVOICES.filter(i=>
    (filter==="Alle"||i.status===filter) &&
    (i.id+i.client+i.dossier).toLowerCase().includes(search.toLowerCase())
  );

  const totaalUitstaand = OUTGOING_INVOICES.filter(i=>i.status!=="Betaald").reduce((a,b)=>a+b.amount,0);
  const totaalBetaald   = OUTGOING_INVOICES.filter(i=>i.status==="Betaald").reduce((a,b)=>a+b.amount,0);
  const totaalMarge     = OUTGOING_INVOICES.reduce((a,b)=>a+b.margin,0);
  const achterstallig   = OUTGOING_INVOICES.filter(i=>i.status==="Achterstallig");

  // Match delivered shipments that have no invoice yet (simulate)
  const deliveredWithoutInvoice = ALL_SHIPMENTS.filter(s=>
    s.status==="Delivered" && !OUTGOING_INVOICES.find(i=>i.dossier===s.id)
  );

  return (
    <div>
      {/* KPIs */}
      <div style={{ display:"flex", gap:14, marginBottom:20 }}>
        <KPI label="Uitstaand" value={fmt(totaalUitstaand)} icon="📤" color={C.blue} sub={OUTGOING_INVOICES.filter(i=>i.status!=="Betaald").length+" facturen"} />
        <KPI label="Ontvangen (mnd)" value={fmt(totaalBetaald)} icon="💶" color={C.green} trend={9} />
        <KPI label="Totale marge" value={fmt(totaalMarge)} icon="📊" color={C.accent} trend={12} />
        <KPI label="Achterstallig" value={achterstallig.length} icon="🚨" color={C.red} sub={achterstallig.length>0?fmt(achterstallig.reduce((a,b)=>a+b.amount,0)):"Geen"} />
      </div>

      {/* Gereed voor facturering */}
      {deliveredWithoutInvoice.length > 0 && (
        <div style={{ background:`${C.accent}0A`, border:`1px solid ${C.accent}44`, borderRadius:12, padding:18, marginBottom:20 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <span style={{ fontSize:20 }}>🔔</span>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:C.accent }}>{deliveredWithoutInvoice.length} zendingen gereed voor facturering</div>
                <div style={{ fontSize:12, color:C.muted }}>Geleverde zendingen zonder uitgaande factuur</div>
              </div>
            </div>
            <button style={{ padding:"8px 18px", background:C.accent, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>
              Alles factureren
            </button>
          </div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {deliveredWithoutInvoice.map(s=>{
              const mv=MODES[s.mode];
              return (
                <div key={s.id} style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 14px",
                  display:"flex", alignItems:"center", gap:8, cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                  onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
                >
                  <span>{mv.icon}</span>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:C.accent }}>{s.id}</div>
                    <div style={{ fontSize:11, color:C.muted }}>{s.origin} → {s.dest}</div>
                  </div>
                  <button style={{ marginLeft:6, padding:"2px 8px", background:C.accent, border:"none", borderRadius:5, fontSize:10, color:"#fff", fontWeight:700, cursor:"pointer" }}>
                    + Factuur
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter + search */}
      <div style={{ display:"flex", gap:10, marginBottom:14, alignItems:"center" }}>
        <input placeholder="🔍  Zoek op factuurnr, klant, dossier..."
          value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, padding:"9px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, outline:"none" }} />
        <div style={{ display:"flex", gap:6 }}>
          {["Alle","Concept","Verstuurd","Betaald","Achterstallig"].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{ padding:"7px 13px", borderRadius:7, fontSize:11, cursor:"pointer", fontWeight:600,
                background:filter===f?C.accent:C.card, border:`1px solid ${filter===f?C.accent:C.border}`,
                color:filter===f?"#fff":C.muted }}>{f}</button>
          ))}
        </div>
        <button style={{ padding:"9px 18px", background:C.accent, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>
          + Nieuwe Factuur
        </button>
      </div>

      {/* Table */}
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:C.surface }}>
            {["Factuurnr.","Klant","Dossier","Modus","Factuurbedrag","Inkoopkosten","Marge","Factuurdatum","Vervaldatum","Status",""].map(h=>(
              <th key={h} style={{ textAlign:"left", padding:"12px 14px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {data.map(inv=>{
              const mv=MODES[inv.mode];
              const marginPct = Math.round((inv.margin/inv.amount)*100);
              return (
                <tr key={inv.id}
                  style={{ borderBottom:`1px solid ${C.border}22`, cursor:"pointer", transition:"background .1s",
                    background: inv.status==="Achterstallig" ? `${C.red}06` : "transparent" }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.surface}
                  onMouseLeave={e=>e.currentTarget.style.background=inv.status==="Achterstallig"?`${C.red}06`:"transparent"}
                >
                  <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700, color:C.accent }}>{inv.id}</td>
                  <td style={{ padding:"12px 14px", fontSize:13, fontWeight:600 }}>{inv.client}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <span style={{ fontSize:12, fontWeight:600, color:C.accent, background:`${C.accent}18`, padding:"2px 8px", borderRadius:20 }}>{inv.dossier}</span>
                  </td>
                  <td style={{ padding:"12px 14px" }}>
                    <span style={{ fontSize:11, padding:"2px 8px", borderRadius:20, background:`${mv.color}18`, color:mv.color, fontWeight:600 }}>{mv.icon} {mv.label}</span>
                  </td>
                  <td style={{ padding:"12px 14px", fontSize:13, fontWeight:800, color:C.text }}>{fmt(inv.amount)}</td>
                  <td style={{ padding:"12px 14px", fontSize:12, color:C.muted }}>{fmt(inv.costs)}</td>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ fontSize:13, fontWeight:700, color:marginPct>30?C.green:marginPct>15?C.yellow:C.red }}>{fmt(inv.margin)}</span>
                      <span style={{ fontSize:10, color:C.muted }}>({marginPct}%)</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 14px", fontSize:12, color:C.muted }}>{inv.issued}</td>
                  <td style={{ padding:"12px 14px", fontSize:12, color:inv.status==="Achterstallig"?C.red:C.muted, fontWeight:inv.status==="Achterstallig"?700:400 }}>{inv.due}</td>
                  <td style={{ padding:"12px 14px" }}><Badge label={inv.status} color={uitStatusColor(inv.status)} bg={uitStatusBg(inv.status)} /></td>
                  <td style={{ padding:"12px 14px" }}>
                    <div style={{ display:"flex", gap:5 }}>
                      <button style={{ padding:"3px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:5, fontSize:11, color:C.muted, cursor:"pointer" }}>PDF</button>
                      {inv.status==="Concept"&&<button style={{ padding:"3px 10px", background:C.accent, border:"none", borderRadius:5, fontSize:11, color:"#fff", fontWeight:600, cursor:"pointer" }}>Versturen</button>}
                      {inv.status==="Achterstallig"&&<button style={{ padding:"3px 10px", background:C.red, border:"none", borderRadius:5, fontSize:11, color:"#fff", fontWeight:600, cursor:"pointer" }}>Herinnering</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Margin summary */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginTop:16 }}>
        {[
          { label:"Gemiddelde marge", value: Math.round(OUTGOING_INVOICES.reduce((a,b)=>a+(b.margin/b.amount)*100,0)/OUTGOING_INVOICES.length)+"%", color:C.green },
          { label:"Hoogste marge", value: fmt(Math.max(...OUTGOING_INVOICES.map(i=>i.margin))), color:C.accent },
          { label:"Te ontvangen (30 dgn)", value: fmt(OUTGOING_INVOICES.filter(i=>i.status!=="Betaald").reduce((a,b)=>a+b.amount,0)), color:C.blue },
        ].map(item=>(
          <div key={item.label} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:12, color:C.muted }}>{item.label}</span>
            <span style={{ fontSize:16, fontWeight:800, color:item.color }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── FINANCIËN (wrapper with sub-tabs) ───────────────────────────────────────
const FinancienTab = () => {
  const [sub, setSub] = useState("inkomen");
  const subTabs = [
    { id:"inkomen",  label:"Inkomende Facturen", icon:"📥", color:C.cyan,   badge: INCOMING_INVOICES.filter(i=>i.status==="Nieuw").length },
    { id:"uitgaand", label:"Uitgaande Facturen",  icon:"📤", color:C.accent, badge: OUTGOING_INVOICES.filter(i=>i.status==="Achterstallig").length },
  ];
  return (
    <div>
      <div style={{ display:"flex", gap:10, marginBottom:24 }}>
        {subTabs.map(t=>(
          <button key={t.id} onClick={()=>setSub(t.id)}
            style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 20px", borderRadius:10, cursor:"pointer",
              fontWeight:700, fontSize:13,
              background: sub===t.id ? t.color : C.card,
              border:`1px solid ${sub===t.id ? t.color : C.border}`,
              color: sub===t.id ? (t.color===C.cyan?"#000":"#fff") : C.muted,
              boxShadow: sub===t.id ? `0 4px 14px ${t.color}30` : "none" }}>
            {t.icon} {t.label}
            {t.badge>0&&<span style={{ background: sub===t.id?"rgba(0,0,0,.25)":"rgba(255,255,255,.1)", padding:"1px 7px", borderRadius:10, fontSize:10, fontWeight:700 }}>{t.badge}</span>}
          </button>
        ))}
      </div>
      {sub==="inkomen"  && <InkomendeFacturen />}
      {sub==="uitgaand" && <UitgaandeFacturen />}
    </div>
  );
};

// ─── MASTERS ─────────────────────────────────────────────────────────────────
const PARTIES = [
  { id:"P-001", type:"Shipper",   name:"ASML Holding NV",         country:"NL", city:"Veldhoven",  contact:"M. Jansen",   email:"m.jansen@asml.com",       tel:"+31 40 268 2000", mode:"air",  active:true },
  { id:"P-002", type:"Shipper",   name:"Heineken N.V.",            country:"NL", city:"Amsterdam",  contact:"P. van Berg",  email:"p.berg@heineken.com",      tel:"+31 20 523 9239", mode:"sea",  active:true },
  { id:"P-003", type:"Shipper",   name:"Shell Netherlands",        country:"NL", city:"Rotterdam",  contact:"K. Smits",    email:"k.smits@shell.com",        tel:"+31 70 377 9111", mode:"breakbulk", active:true },
  { id:"P-004", type:"Consignee", name:"Shanghai Micro Electronics",country:"CN", city:"Shanghai",   contact:"Li Wei",      email:"li.wei@smee.cn",           tel:"+86 21 6765 4321",mode:"sea",  active:true },
  { id:"P-005", type:"Consignee", name:"Dubai Port Authority",      country:"AE", city:"Dubai",      contact:"Ahmed Al Farsi",email:"a.farsi@dpa.ae",          tel:"+971 4 345 6789", mode:"sea",  active:true },
  { id:"P-006", type:"Agent",     name:"Sinotrans Shanghai",        country:"CN", city:"Shanghai",   contact:"Chen Jing",   email:"c.jing@sinotrans.com",     tel:"+86 21 6325 4000",mode:"sea",  active:true },
  { id:"P-007", type:"Agent",     name:"Schenker Korea",            country:"KR", city:"Seoul",      contact:"Kim Park",    email:"k.park@dbschenker.com",    tel:"+82 2 3707 0014", mode:"air",  active:true },
  { id:"P-008", type:"Shipper",   name:"Philips Medical Systems",   country:"NL", city:"Best",       contact:"R. de Vries", email:"r.devries@philips.com",    tel:"+31 40 278 8000", mode:"air",  active:true },
  { id:"P-009", type:"Consignee", name:"Walgreens Boots Alliance",  country:"US", city:"Chicago",    contact:"J. Martin",   email:"j.martin@wba.com",         tel:"+1 847 315 2500", mode:"air",  active:false },
  { id:"P-010", type:"Agent",     name:"Nippon Express USA",        country:"US", city:"Houston",    contact:"T. Yamada",   email:"t.yamada@nipponexpress.com",tel:"+1 713 802 4000", mode:"road", active:true },
  { id:"P-011", type:"Notify",    name:"Kuehne+Nagel Rotterdam",    country:"NL", city:"Rotterdam",  contact:"F. Bakker",   email:"f.bakker@kn.com",          tel:"+31 10 498 1234", mode:"sea",  active:true },
  { id:"P-012", type:"Shipper",   name:"Volvo Group Gent",          country:"BE", city:"Gent",       contact:"L. Claes",    email:"l.claes@volvo.com",        tel:"+32 9 391 2000",  mode:"roro", active:true },
];

const LOCATIONS = [
  { id:"L-001", code:"RTM", name:"Rotterdam",         country:"NL", type:"Zeehaven",    unloc:"NLRTM", address:"Maasvlakte I & II", terminal:"ECT Delta" },
  { id:"L-002", code:"ANT", name:"Antwerpen",          country:"BE", type:"Zeehaven",    unloc:"BEANT", address:"Linkeroever", terminal:"PSA HNN" },
  { id:"L-003", code:"AMS", name:"Amsterdam Schiphol", country:"NL", type:"Luchthaven",  unloc:"NLAMS", address:"Evert van de Beekstraat 202", terminal:"KLM Cargo" },
  { id:"L-004", code:"BRU", name:"Brussel Zaventem",   country:"BE", type:"Luchthaven",  unloc:"BEBRU", address:"Brussels Airport", terminal:"Brussels Airlines Cargo" },
  { id:"L-005", code:"SHA", name:"Shanghai",           country:"CN", type:"Zeehaven",    unloc:"CNSHA", address:"Pudong", terminal:"SIPG" },
  { id:"L-006", code:"HKG", name:"Hong Kong",          country:"HK", type:"Zeehaven/Luchthaven", unloc:"HKHKG", address:"Kwai Tsing", terminal:"CT3" },
  { id:"L-007", code:"DXB", name:"Dubai",              country:"AE", type:"Zeehaven/Luchthaven", unloc:"AEDXB", address:"Jebel Ali / Al Maktoum", terminal:"DP World" },
  { id:"L-008", code:"GNT", name:"Gent",               country:"BE", type:"Zeehaven",    unloc:"BEGNE", address:"Gentse haven", terminal:"North Sea Port" },
  { id:"L-009", code:"ZEE", name:"Zeebrugge",          country:"BE", type:"Zeehaven",    unloc:"BEZEE", address:"Isabellalaan 1", terminal:"ICO RoRo" },
  { id:"L-010", code:"HAM", name:"Hamburg",            country:"DE", type:"Zeehaven",    unloc:"DEHAM", address:"Unterelbe", terminal:"HHLA" },
];

const MastersTab = () => {
  const [sub,    setSub]    = useState("parties");
  const [search, setSearch] = useState("");
  const [typeF,  setTypeF]  = useState("Alle");
  const [showForm, setShowForm] = useState(false);

  const subTabs = [
    { id:"parties",   label:"Partijen",   icon:"🏢", count: PARTIES.length },
    { id:"locations", label:"Locaties",   icon:"📍", count: LOCATIONS.length },
    { id:"carriers",  label:"Carriers",   icon:"🚢", count: 22 },
  ];

  const filteredParties = PARTIES.filter(p=>
    (typeF==="Alle" || p.type===typeF) &&
    (p.name+p.city+p.contact+p.email).toLowerCase().includes(search.toLowerCase())
  );

  const partyTypeColor = t => ({ Shipper:C.accent, Consignee:C.blue, Agent:C.purple, Notify:C.teal }[t]||C.muted);

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:24, borderBottom:`1px solid ${C.border}`, paddingBottom:0 }}>
        {subTabs.map(t=>(
          <button key={t.id} onClick={()=>{setSub(t.id);setSearch("");setTypeF("Alle");}}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 16px", cursor:"pointer", background:"none", border:"none", fontSize:13, fontWeight:600,
              color: sub===t.id ? C.accent : C.muted,
              borderBottom: sub===t.id ? `2px solid ${C.accent}` : "2px solid transparent", marginBottom:-1 }}>
            {t.icon} {t.label}
            <span style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, fontSize:10, padding:"1px 6px", color:C.muted }}>{t.count}</span>
          </button>
        ))}
        <div style={{ flex:1 }} />
        <button onClick={()=>setShowForm(true)}
          style={{ padding:"8px 18px", background:C.accent, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer", marginBottom:8, alignSelf:"center" }}>
          + Nieuwe {sub==="parties"?"Partij":sub==="locations"?"Locatie":"Carrier"}
        </button>
      </div>

      {/* ── PARTIJEN ── */}
      {sub==="parties" && (
        <div>
          <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
            <input placeholder="🔍  Zoek op naam, stad, contact, e-mail..."
              value={search} onChange={e=>setSearch(e.target.value)}
              style={{ flex:1, padding:"9px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, outline:"none" }} />
            <div style={{ display:"flex", gap:6 }}>
              {["Alle","Shipper","Consignee","Agent","Notify"].map(t=>(
                <button key={t} onClick={()=>setTypeF(t)}
                  style={{ padding:"7px 12px", borderRadius:7, fontSize:11, cursor:"pointer", fontWeight:600,
                    background:typeF===t?partyTypeColor(t):C.card, border:`1px solid ${typeF===t?partyTypeColor(t):C.border}`,
                    color:typeF===t?"#fff":C.muted }}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:C.surface }}>
                {["ID","Type","Naam","Land / Stad","Contactpersoon","E-mail","Telefoon","Prim. modus","Status",""].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"12px 14px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {filteredParties.map(p=>{
                  const mv2 = MODES[p.mode]||{color:C.muted,icon:"—"};
                  return (
                    <tr key={p.id} style={{ borderBottom:`1px solid ${C.border}22`, cursor:"pointer" }}
                      onMouseEnter={e=>e.currentTarget.style.background=C.surface}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      <td style={{ padding:"12px 14px", fontSize:12, color:C.muted }}>{p.id}</td>
                      <td style={{ padding:"12px 14px" }}><Badge label={p.type} color={partyTypeColor(p.type)} /></td>
                      <td style={{ padding:"12px 14px", fontSize:13, fontWeight:700, color:C.text }}>{p.name}</td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:C.muted }}>{p.country} • {p.city}</td>
                      <td style={{ padding:"12px 14px", fontSize:12 }}>{p.contact}</td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:C.cyan }}>{p.email}</td>
                      <td style={{ padding:"12px 14px", fontSize:12, color:C.muted }}>{p.tel}</td>
                      <td style={{ padding:"12px 14px" }}>
                        <span style={{ fontSize:11, padding:"2px 7px", borderRadius:20, background:`${mv2.color}18`, color:mv2.color, fontWeight:600 }}>{mv2.icon}</span>
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <span style={{ fontSize:11, fontWeight:600, color:p.active?C.green:C.red }}>
                          {p.active?"● Actief":"○ Inactief"}
                        </span>
                      </td>
                      <td style={{ padding:"12px 14px" }}>
                        <div style={{ display:"flex", gap:5 }}>
                          <button style={{ padding:"3px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:5, fontSize:11, color:C.muted, cursor:"pointer" }}>✏ Bewerken</button>
                          <button style={{ padding:"3px 10px", background:"none", border:`1px solid ${C.border}`, borderRadius:5, fontSize:11, color:C.muted, cursor:"pointer" }}>📋 Dossiers</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop:10, fontSize:12, color:C.muted }}>{filteredParties.length} partijen</div>
        </div>
      )}

      {/* ── LOCATIES ── */}
      {sub==="locations" && (
        <div>
          <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center" }}>
            <input placeholder="🔍  Zoek op code, naam, land..."
              value={search} onChange={e=>setSearch(e.target.value)}
              style={{ flex:1, padding:"9px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, outline:"none" }} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
            {LOCATIONS.filter(l=>(l.code+l.name+l.country).toLowerCase().includes(search.toLowerCase())).map(l=>(
              <div key={l.id} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:20, cursor:"pointer", transition:"border-color .2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor=C.accent}
                onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}
              >
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div style={{ fontSize:24, fontWeight:900, color:C.accent, fontFamily:"'Courier New',monospace", letterSpacing:2 }}>{l.code}</div>
                  <Badge label={l.type} color={C.blue} />
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:3 }}>{l.name}</div>
                <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>{l.country} • {l.address}</div>
                <div style={{ fontSize:11, color:C.muted, borderTop:`1px solid ${C.border}`, paddingTop:8 }}>
                  <span style={{ color:C.accent, fontWeight:600 }}>UNLOC: </span>{l.unloc} •
                  <span style={{ marginLeft:4 }}>Terminal: {l.terminal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CARRIERS (link to existing CarriersTab data) ── */}
      {sub==="carriers" && (
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:40, textAlign:"center" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>🚢</div>
          <div style={{ fontWeight:700, fontSize:16, color:C.text, marginBottom:8 }}>Carrier Stamdata</div>
          <div style={{ fontSize:13, color:C.muted, maxWidth:400, margin:"0 auto 20px" }}>Beheer alle carrier contracten, contactpersonen en tariefafspraken. Zie ook het Carriers tabblad voor operationele overzichten.</div>
          <button style={{ padding:"10px 24px", background:C.accent, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer" }}>
            + Nieuwe Carrier toevoegen
          </button>
        </div>
      )}
    </div>
  );
};

// ─── SALES: ADD LEADS ─────────────────────────────────────────────────────────
const LEADS_DATA = [
  { id:"LD-001", company:"Akzo Nobel NV",       contact:"W. Koopman",  email:"w.koopman@akzonobel.com", source:"E-mail",    status:"Nieuw",          mode:"sea",  route:"RTM → Singapore", value:18000, assigned:"J. Vermeer", created:"28 Feb" },
  { id:"LD-002", company:"DAF Trucks Eindhoven", contact:"B. van Loon", email:"b.loon@daf.com",          source:"Beurs",     status:"Gekwalificeerd", mode:"roro", route:"ZEE → Baltimore",  value:32000, assigned:"M. de Boer", created:"01 Mrt" },
  { id:"LD-003", company:"BASF Antwerpen",       contact:"P. Wagner",   email:"p.wagner@basf.com",       source:"Website",   status:"Nieuw",          mode:"sea",  route:"ANT → Houston",    value:24000, assigned:"L. Peters",  created:"02 Mrt" },
  { id:"LD-004", company:"ING Bank NV",          contact:"C. de Groot", email:"c.degroot@ing.nl",        source:"LinkedIn",  status:"Verlopen",       mode:"air",  route:"AMS → New York",   value:9500,  assigned:"M. de Boer", created:"15 Feb" },
  { id:"LD-005", company:"Vanderlande Ind.",     contact:"T. Hendriks", email:"t.hendriks@vanderlande.com",source:"Referentie",status:"Gekwalificeerd",mode:"air",  route:"AMS → Atlanta",    value:14000, assigned:"J. Vermeer", created:"03 Mrt" },
  { id:"LD-006", company:"FrieslandCampina",     contact:"S. Hoekstra", email:"s.hoekstra@frieslandcampina.com",source:"Cold Call",status:"Gecontacteerd",mode:"sea",route:"RTM → Lagos",    value:7200,  assigned:"L. Peters",  created:"04 Mrt" },
];

const INQUIRIES_DATA = [
  { id:"INQ-001", from:"logistics@akzonobel.com",  subject:"FCL rate request RTM-SIN",         received:"05 Mrt 09:14", mode:"sea",  status:"Open",         assigned:"J. Vermeer", priority:"Hoog" },
  { id:"INQ-002", from:"supply@daf.com",           subject:"RoRo quote Zeebrugge - Baltimore", received:"05 Mrt 08:32", mode:"roro", status:"Geciteerd",    assigned:"M. de Boer", priority:"Normaal" },
  { id:"INQ-003", from:"m.jansen@asml.com",        subject:"Air Express AMS-Taipei Q2",        received:"04 Mrt 16:55", mode:"air",  status:"Open",         assigned:"L. Peters",  priority:"Hoog" },
  { id:"INQ-004", from:"purchasing@basf.com",      subject:"LCL ANT naar Houston",             received:"04 Mrt 14:22", mode:"sea",  status:"Open",         assigned:"J. Vermeer", priority:"Normaal" },
  { id:"INQ-005", from:"import@siemens.com",       subject:"Heavy lift - turbine Rotterdam",   received:"03 Mrt 11:00", mode:"breakbulk",status:"Geciteerd", assigned:"M. de Boer", priority:"Hoog" },
  { id:"INQ-006", from:"logistics@unilever.com",   subject:"FCL 40HC RTM-Shanghai regulier",   received:"03 Mrt 09:45", mode:"sea",  status:"Afgewezen",    assigned:"L. Peters",  priority:"Laag" },
];

// ─── REPORTS TAB ─────────────────────────────────────────────────────────────
const MONTHLY_DATA = [
  { month:"Okt", shipments:98,  revenue:142000, costs:94000 },
  { month:"Nov", shipments:112, revenue:168000, costs:108000 },
  { month:"Dec", shipments:124, revenue:195000, costs:122000 },
  { month:"Jan", shipments:88,  revenue:118000, costs:82000 },
  { month:"Feb", shipments:106, revenue:152000, costs:99000 },
  { month:"Mrt", shipments:67,  revenue:94000,  costs:61000 },
];

const ReportsTab = () => {
  const [sub, setSub] = useState("operational");
  const subTabs = [
    { id:"operational", label:"Operationeel", icon:"⚙️" },
    { id:"accounting",  label:"Accounting",   icon:"💶" },
  ];

  const maxRev = Math.max(...MONTHLY_DATA.map(m=>m.revenue));

  return (
    <div>
      <div style={{ display:"flex", gap:8, marginBottom:24, borderBottom:`1px solid ${C.border}` }}>
        {subTabs.map(t=>(
          <button key={t.id} onClick={()=>setSub(t.id)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"10px 16px", cursor:"pointer", background:"none", border:"none", fontSize:13, fontWeight:600,
              color: sub===t.id ? C.accent : C.muted,
              borderBottom: sub===t.id ? `2px solid ${C.accent}` : "2px solid transparent", marginBottom:-1 }}>
            {t.icon} {t.label}
          </button>
        ))}
        <div style={{ flex:1 }} />
        <div style={{ display:"flex", gap:8, marginBottom:8, alignSelf:"center" }}>
          <select style={{ padding:"7px 12px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:12 }}>
            {["Q1 2024 (Huidig)","Q4 2023","Q3 2023","Heel jaar 2023"].map(o=><option key={o}>{o}</option>)}
          </select>
          <button style={{ padding:"7px 16px", background:C.accent, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>⬇ Exporteren</button>
        </div>
      </div>

      {sub==="operational" && (
        <div>
          {/* KPIs */}
          <div style={{ display:"flex", gap:14, marginBottom:20 }}>
            <KPI label="Totaal zendingen"    value="495"     icon="📦" color={C.accent} trend={11} />
            <KPI label="On-time levering"    value="93.2%"   icon="⏱" color={C.green}  trend={2}  />
            <KPI label="Gem. dossier duur"   value="6.4 dgn" icon="📅" color={C.cyan}   sub="van booking tot levering" />
            <KPI label="Actieve dossiers"    value="47"      icon="📂" color={C.blue}   sub="lopend kwartaal" />
            <KPI label="Vertraagd"           value="12"      icon="⚠️" color={C.red}    sub="4 kritisch" />
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
            {/* Mode performance */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>On-time prestatie per modus</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Q1 2024</div>
              {[{mode:"air",pct:96},{mode:"road",pct:91},{mode:"sea",pct:93},{mode:"roro",pct:95},{mode:"breakbulk",pct:88}].map(({mode,pct})=>{
                const mv2=MODES[mode];
                return (
                  <div key={mode} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:13 }}>{mv2.icon} {mv2.label}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:pct>=95?C.green:pct>=90?C.yellow:C.red }}>{pct}%</span>
                    </div>
                    <Bar val={pct} color={pct>=95?C.green:pct>=90?C.yellow:C.red} h={6} />
                  </div>
                );
              })}
            </div>

            {/* Shipments per month chart */}
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Zendingen per maand</div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Okt 2023 – Mrt 2024</div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:120 }}>
                {MONTHLY_DATA.map((d,i)=>(
                  <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{ fontSize:10, color:C.text, fontWeight:700 }}>{d.shipments}</div>
                    <div style={{ width:"100%", background:i===5?C.accent:C.blue, borderRadius:"3px 3px 0 0", height:`${(d.shipments/130)*100}%`, minHeight:4 }} />
                    <div style={{ fontSize:10, color:C.muted }}>{d.month}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SLA table */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>SLA Rapport – Top routes</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Prestatie vs. afgesproken transit time</div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:C.surface }}>
                {["Route","Modus","Zendingen","Gem. transit","SLA transit","On-time","SLA Status"].map(h=>(
                  <th key={h} style={{ textAlign:"left", padding:"11px 14px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {[
                  {route:"RTM → Shanghai",   mode:"sea",      cnt:24, avg:"20 dgn", sla:"22 dgn", pct:96},
                  {route:"AMS → Dubai",      mode:"air",      cnt:18, avg:"1 dag",  sla:"2 dgn",  pct:100},
                  {route:"ANT → New York",   mode:"sea",      cnt:14, avg:"15 dgn", sla:"16 dgn", pct:93},
                  {route:"RTM → Houston",    mode:"breakbulk",cnt:9,  avg:"28 dgn", sla:"30 dgn", pct:89},
                  {route:"ZEE → Baltimore",  mode:"roro",     cnt:8,  avg:"12 dgn", sla:"14 dgn", pct:100},
                  {route:"RTM → Antwerpen",  mode:"road",     cnt:24, avg:"4 uur",  sla:"6 uur",  pct:96},
                ].map((r,i)=>{
                  const mv2=MODES[r.mode];
                  return (
                    <tr key={i} style={{ borderBottom:`1px solid ${C.border}22` }}>
                      <td style={{ padding:"11px 14px", fontSize:13, fontWeight:600 }}>{r.route}</td>
                      <td style={{ padding:"11px 14px" }}><span style={{ fontSize:11, padding:"2px 7px", borderRadius:20, background:`${mv2.color}18`, color:mv2.color, fontWeight:600 }}>{mv2.icon} {mv2.label}</span></td>
                      <td style={{ padding:"11px 14px", fontSize:13 }}>{r.cnt}</td>
                      <td style={{ padding:"11px 14px", fontSize:13 }}>{r.avg}</td>
                      <td style={{ padding:"11px 14px", fontSize:12, color:C.muted }}>{r.sla}</td>
                      <td style={{ padding:"11px 14px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <div style={{ width:60 }}><Bar val={r.pct} color={r.pct>=95?C.green:r.pct>=90?C.yellow:C.red} h={4} /></div>
                          <span style={{ fontSize:12, fontWeight:700, color:r.pct>=95?C.green:r.pct>=90?C.yellow:C.red }}>{r.pct}%</span>
                        </div>
                      </td>
                      <td style={{ padding:"11px 14px" }}><Badge label={r.pct>=95?"✓ OK":r.pct>=90?"△ Waarschuwing":"✕ SLA Breach"} color={r.pct>=95?C.green:r.pct>=90?C.yellow:C.red} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sub==="accounting" && (
        <div>
          <div style={{ display:"flex", gap:14, marginBottom:20 }}>
            <KPI label="Omzet Q1"         value="€ 509K"  icon="💶" color={C.green} trend={9} />
            <KPI label="Inkoop Q1"        value="€ 341K"  icon="📉" color={C.red}   trend={7} />
            <KPI label="Bruto marge"      value="32.9%"   icon="📊" color={C.accent} trend={3} />
            <KPI label="Uitstaand"        value="€ 128K"  icon="⏳" color={C.yellow} sub="31 facturen" />
            <KPI label="Achterstallig"    value="€ 42K"   icon="🚨" color={C.red}   sub="6 facturen" />
          </div>

          {/* Revenue vs cost chart */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22, marginBottom:16 }}>
            <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>Omzet vs. Inkoopkosten</div>
            <div style={{ fontSize:12, color:C.muted, marginBottom:18 }}>Maandelijkse vergelijking + marge</div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:10, height:150 }}>
              {MONTHLY_DATA.map((d,i)=>(
                <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div style={{ width:"100%", display:"flex", gap:2, alignItems:"flex-end", height:120 }}>
                    <div title={`Omzet: ${fmt(d.revenue)}`} style={{ flex:1, background:C.green, borderRadius:"3px 3px 0 0", height:`${(d.revenue/maxRev)*100}%` }} />
                    <div title={`Kosten: ${fmt(d.costs)}`}  style={{ flex:1, background:C.red,   borderRadius:"3px 3px 0 0", height:`${(d.costs/maxRev)*100}%` }} />
                  </div>
                  <div style={{ fontSize:11, color:C.green, fontWeight:700 }}>{Math.round(((d.revenue-d.costs)/d.revenue)*100)}%</div>
                  <div style={{ fontSize:10, color:C.muted }}>{d.month}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", gap:16, marginTop:8, justifyContent:"flex-end" }}>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:10, height:10, background:C.green, borderRadius:2 }} /><span style={{ fontSize:11, color:C.muted }}>Omzet</span></div>
              <div style={{ display:"flex", alignItems:"center", gap:5 }}><div style={{ width:10, height:10, background:C.red, borderRadius:2 }} /><span style={{ fontSize:11, color:C.muted }}>Inkoop</span></div>
            </div>
          </div>

          {/* Top customers */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Top 5 klanten omzet</div>
              {CLIENTS.sort((a,b)=>b.revenue-a.revenue).slice(0,5).map((cl,i)=>(
                <div key={cl.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:`1px solid ${C.border}22` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:24, height:24, borderRadius:"50%", background:C.surface, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:C.accent }}>{i+1}</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600 }}>{cl.name}</div>
                      <div style={{ fontSize:11, color:C.muted }}>{cl.sector}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:14, fontWeight:800, color:C.green }}>{fmt(cl.revenue)}</div>
                    <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>Marge ~32%</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
              <div style={{ fontWeight:700, fontSize:15, marginBottom:16 }}>Marge per vervoerswijze</div>
              {[{mode:"breakbulk",margin:38},{mode:"air",margin:34},{mode:"roro",margin:31},{mode:"sea",margin:29},{mode:"road",margin:22}].map(({mode,margin})=>{
                const mv2=MODES[mode];
                return (
                  <div key={mode} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                      <span style={{ fontSize:13 }}>{mv2.icon} {mv2.label}</span>
                      <span style={{ fontSize:13, fontWeight:700, color:margin>30?C.green:margin>25?C.yellow:C.red }}>{margin}%</span>
                    </div>
                    <Bar val={margin} max={50} color={margin>30?C.green:margin>25?C.yellow:C.red} h={6} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SALES: EXTENDED WITH LEADS & INQUIRIES ───────────────────────────────────
// (Patch into SalesTab — prepend Leads and Inquiries as new sub-tabs)
const LeadsPanel = () => {
  const [filter, setFilter] = useState("Alle");
  const [search, setSearch] = useState("");
  const statuses = ["Alle","Nieuw","Gecontacteerd","Gekwalificeerd","Verlopen"];
  const leadStatusColor = s => ({ Nieuw:C.cyan, Gecontacteerd:C.yellow, Gekwalificeerd:C.green, Verlopen:C.red }[s]||C.muted);

  const data = LEADS_DATA.filter(l=>
    (filter==="Alle"||l.status===filter) &&
    (l.company+l.contact+l.email).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display:"flex", gap:14, marginBottom:20 }}>
        <KPI label="Totaal leads"       value={LEADS_DATA.length}                                icon="📥" color={C.cyan}  />
        <KPI label="Nieuw"              value={LEADS_DATA.filter(l=>l.status==="Nieuw").length}  icon="🆕" color={C.cyan}  sub="actie vereist" />
        <KPI label="Gekwalificeerd"     value={LEADS_DATA.filter(l=>l.status==="Gekwalificeerd").length} icon="✅" color={C.green} />
        <KPI label="Pipeline waarde"    value={fmt(LEADS_DATA.reduce((a,l)=>a+l.value,0))}      icon="💰" color={C.accent} sub="potentieel" />
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:14 }}>
        <input placeholder="🔍  Zoek op bedrijf, contact, e-mail..."
          value={search} onChange={e=>setSearch(e.target.value)}
          style={{ flex:1, padding:"9px 16px", background:C.card, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:13, outline:"none" }} />
        {statuses.map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{ padding:"7px 12px", borderRadius:7, fontSize:11, cursor:"pointer", fontWeight:600,
              background:filter===f?C.green:C.card, border:`1px solid ${filter===f?C.green:C.border}`,
              color:filter===f?"#fff":C.muted }}>{f}</button>
        ))}
        <button style={{ padding:"9px 18px", background:C.green, border:"none", borderRadius:8, color:"#fff", fontWeight:700, fontSize:12, cursor:"pointer" }}>+ Lead toevoegen</button>
      </div>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, overflow:"hidden" }}>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead><tr style={{ background:C.surface }}>
            {["ID","Bedrijf","Contactpersoon","E-mail","Bron","Modus","Route","Pot. waarde","Toegewezen","Status","Acties"].map(h=>(
              <th key={h} style={{ textAlign:"left", padding:"11px 14px", fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:1, borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap" }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {data.map(l=>{
              const mv2=MODES[l.mode];
              return (
                <tr key={l.id} style={{ borderBottom:`1px solid ${C.border}22`, cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.surface}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"11px 14px", fontSize:12, color:C.muted }}>{l.id}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700 }}>{l.company}</td>
                  <td style={{ padding:"11px 14px", fontSize:12 }}>{l.contact}</td>
                  <td style={{ padding:"11px 14px", fontSize:12, color:C.cyan }}>{l.email}</td>
                  <td style={{ padding:"11px 14px" }}><Badge label={l.source} color={C.muted} /></td>
                  <td style={{ padding:"11px 14px" }}><span style={{ fontSize:11, padding:"2px 7px", borderRadius:20, background:`${mv2.color}18`, color:mv2.color, fontWeight:600 }}>{mv2.icon}</span></td>
                  <td style={{ padding:"11px 14px", fontSize:12, color:C.muted }}>{l.route}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:C.green }}>{fmt(l.value)}</td>
                  <td style={{ padding:"11px 14px", fontSize:12, color:C.muted }}>{l.assigned}</td>
                  <td style={{ padding:"11px 14px" }}><Badge label={l.status} color={leadStatusColor(l.status)} /></td>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex", gap:5 }}>
                      <button style={{ padding:"3px 9px", background:C.green, border:"none", borderRadius:5, fontSize:11, color:"#fff", fontWeight:600, cursor:"pointer" }}>→ Offerte</button>
                      <button style={{ padding:"3px 9px", background:"none", border:`1px solid ${C.border}`, borderRadius:5, fontSize:11, color:C.muted, cursor:"pointer" }}>Bellen</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const InquiriesPanel = () => {
  const [filter, setFilter] = useState("Alle");
  const inqStatusColor = s => ({ Open:C.yellow, Geciteerd:C.green, Afgewezen:C.red }[s]||C.muted);
  const priorityColor  = s => ({ Hoog:C.red, Normaal:C.yellow, Laag:C.muted }[s]||C.muted);

  const data = INQUIRIES_DATA.filter(i=>filter==="Alle"||i.status===filter);
  return (
    <div>
      <div style={{ display:"flex", gap:14, marginBottom:20 }}>
        <KPI label="Open aanvragen"  value={INQUIRIES_DATA.filter(i=>i.status==="Open").length}     icon="📩" color={C.yellow} sub="actie vereist" />
        <KPI label="Geciteerd"       value={INQUIRIES_DATA.filter(i=>i.status==="Geciteerd").length} icon="✅" color={C.green} />
        <KPI label="Hoge prioriteit" value={INQUIRIES_DATA.filter(i=>i.priority==="Hoog").length}   icon="🔴" color={C.red}   sub="binnen 2u reageren" />
      </div>

      {/* Inqora AI banner */}
      <div style={{ background:`${C.purple}0A`, border:`1px solid ${C.purple}44`, borderRadius:12, padding:"14px 20px", marginBottom:20, display:"flex", alignItems:"center", gap:14 }}>
        <span style={{ fontSize:24 }}>🤖</span>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:700, fontSize:14, color:C.purple }}>Inqora AI — E-mail detectie actief</div>
          <div style={{ fontSize:12, color:C.muted }}>Bewaakt inkomende e-mails en zet offerte-aanvragen automatisch om in inquiries. Laatste scan: 5 min geleden.</div>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <div style={{ width:8, height:8, borderRadius:"50%", background:C.green, boxShadow:`0 0 6px ${C.green}` }} />
          <span style={{ fontSize:12, color:C.green, fontWeight:700 }}>Actief</span>
        </div>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        {["Alle","Open","Geciteerd","Afgewezen"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{ padding:"7px 12px", borderRadius:7, fontSize:11, cursor:"pointer", fontWeight:600,
              background:filter===f?C.purple:C.card, border:`1px solid ${filter===f?C.purple:C.border}`,
              color:filter===f?"#fff":C.muted }}>{f}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {data.map(inq=>{
          const mv2=MODES[inq.mode];
          return (
            <div key={inq.id} style={{ background:C.card, border:`1px solid ${inq.status==="Open"?C.yellow+"44":C.border}`, borderRadius:12, padding:"14px 18px", display:"flex", gap:14, alignItems:"center" }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${mv2.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>{mv2.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                  <span style={{ fontWeight:700, fontSize:14 }}>{inq.subject}</span>
                  <Badge label={inq.priority} color={priorityColor(inq.priority)} />
                </div>
                <div style={{ fontSize:12, color:C.muted }}>{inq.from} • Ontvangen: {inq.received} • Toegewezen: {inq.assigned}</div>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <Badge label={inq.status} color={inqStatusColor(inq.status)} />
                {inq.status==="Open" && (
                  <button style={{ padding:"6px 16px", background:C.green, border:"none", borderRadius:7, fontSize:12, color:"#fff", fontWeight:700, cursor:"pointer" }}>→ Offerte maken</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── SETTINGS ────────────────────────────────────────────────────────────────
const SettingsTab = () => (
  <div style={{ maxWidth:600 }}>
    {[
      {title:"Bedrijfsgegevens",rows:[["Bedrijfsnaam","BNL Shipping B.V."],["KvK","12345678"],["BTW","NL123456789B01"],["Website","www.bnlshipping.com"],["Hoofdkantoor","Waalhaven Oostzijde 12, Rotterdam"]]},
      {title:"Actieve Vervoerswijzen",rows:Object.entries(MODES).map(([,v])=>[v.label,"✅ Actief"])},
      {title:"Meldingen",rows:[["Vertraging notificatie","✅ Aan"],["Dagrapport e-mail","✅ Aan"],["SLA waarschuwing","✅ Aan"],["ETA update push","✅ Aan"]]},
    ].map(section=>(
      <div key={section.title} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:24, marginBottom:14 }}>
        <div style={{ fontWeight:700, fontSize:15, marginBottom:18 }}>{section.title}</div>
        {section.rows.map(([l,v])=>(
          <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"11px 0", borderBottom:`1px solid ${C.border}22` }}>
            <span style={{ fontSize:14, color:C.muted }}>{l}</span>
            <span style={{ fontSize:14, fontWeight:600 }}>{v}</span>
          </div>
        ))}
      </div>
    ))}
  </div>
);

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,   setTab]   = useState("dashboard");
  const [modal, setModal] = useState(false);
  const [time,  setTime]  = useState(new Date());

  useEffect(()=>{ const t=setInterval(()=>setTime(new Date()),1000); return ()=>clearInterval(t); },[]);

  const nav = [
    {id:"dashboard",  label:"Dashboard",       icon:"⬡"},
    {id:"shipments",  label:"Zendingen",        icon:"⬢", badge:ALL_SHIPMENTS.length},
    {id:"modes",      label:"Vervoerswijzen",   icon:"✦"},
    {id:"tarieven",   label:"Tarieven",         icon:"💲"},
    {id:"carriers",   label:"Carriers",         icon:"◈"},
    {id:"masters",    label:"Stamdata",         icon:"🗄"},
    {id:"sales",      label:"Sales",            icon:"💼", badge: LEADS_DATA.filter(l=>l.status==="Nieuw").length + INQUIRIES_DATA.filter(i=>i.status==="Open").length},
    {id:"financien",  label:"Financiën",        icon:"◆", badge: INCOMING_INVOICES.filter(i=>i.status==="Nieuw").length + OUTGOING_INVOICES.filter(i=>i.status==="Achterstallig").length},
    {id:"documenten", label:"Documenten",       icon:"🗂"},
    {id:"reports",    label:"Rapportages",      icon:"📊"},
    {id:"analytics",  label:"Analytics",        icon:"◉"},
    {id:"settings",   label:"Instellingen",     icon:"◎"},
  ];

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:"'Sora','Segoe UI',sans-serif", color:C.text, overflow:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-track{background:${C.surface}} ::-webkit-scrollbar-thumb{background:${C.border};border-radius:2px}
        input::placeholder{color:${C.muted}} select option{background:${C.card}}
      `}</style>

      {/* Sidebar */}
      <div style={{ width:226, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", padding:"22px 14px", flexShrink:0 }}>
        <div style={{ marginBottom:28, paddingLeft:8 }}><Logo /></div>

        {/* Mode pills */}
        <div style={{ marginBottom:20, paddingLeft:8 }}>
          <div style={{ fontSize:9, color:C.muted, textTransform:"uppercase", letterSpacing:1.5, marginBottom:10 }}>Vervoerswijzen</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
            {Object.entries(MODES).map(([k,v])=>(
              <div key={k} title={v.label} onClick={()=>{setTab("modes");}}
                style={{ padding:"3px 9px", borderRadius:20, background:`${v.color}18`, border:`1px solid ${v.color}44`, fontSize:11, color:v.color, cursor:"pointer", userSelect:"none" }}>
                {v.icon} {v.label.split(" ")[0]}
              </div>
            ))}
          </div>
        </div>

        <nav style={{ flex:1 }}>
          {nav.map(item=>(
            <button key={item.id} onClick={()=>setTab(item.id)}
              style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"10px 12px", borderRadius:8, marginBottom:3, cursor:"pointer",
                background:tab===item.id?C.accentGlow:"transparent",
                border:tab===item.id?`1px solid ${C.accent}33`:"1px solid transparent",
                color:tab===item.id?C.accent:C.muted, fontWeight:tab===item.id?600:400, fontSize:13, transition:"all .12s" }}
              onMouseEnter={e=>{ if(tab!==item.id){e.currentTarget.style.color=C.text;e.currentTarget.style.background=C.card;} }}
              onMouseLeave={e=>{ if(tab!==item.id){e.currentTarget.style.color=C.muted;e.currentTarget.style.background="transparent";} }}
            >
              <span style={{ fontSize:14 }}>{item.icon}</span>
              {item.label}
              {item.badge&&<span style={{ marginLeft:"auto", background:C.accent, color:"#fff", fontSize:10, fontWeight:700, padding:"2px 6px", borderRadius:10 }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px" }}>
            <div style={{ width:30, height:30, borderRadius:"50%", background:`linear-gradient(135deg,${C.accent},#8B3AFF)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700 }}>JV</div>
            <div>
              <div style={{ fontSize:12, fontWeight:600, color:C.text }}>Jan Vermeer</div>
              <div style={{ fontSize:10, color:C.muted }}>Transport Manager</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <div style={{ height:58, background:C.surface, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 26px", flexShrink:0 }}>
          <div>
            <span style={{ fontSize:17, fontWeight:700 }}>{nav.find(n=>n.id===tab)?.label}</span>
            <span style={{ fontSize:11, color:C.muted, marginLeft:12 }}>
              {time.toLocaleDateString("nl-NL",{weekday:"long",day:"numeric",month:"long"})} • {time.toLocaleTimeString("nl-NL",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
            </span>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:5, background:`${C.green}1A`, border:`1px solid ${C.green}44`, borderRadius:20, padding:"4px 12px" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:C.green, boxShadow:`0 0 6px ${C.green}` }} />
              <span style={{ fontSize:11, color:C.green, fontWeight:600 }}>Alle systemen actief</span>
            </div>
            <button onClick={()=>setModal(true)} style={{ background:C.accent, border:"none", color:"#fff", padding:"8px 18px", borderRadius:8, fontWeight:700, fontSize:12, cursor:"pointer", boxShadow:`0 4px 14px ${C.accentGlow}` }}>
              + Nieuwe Zending
            </button>
          </div>
        </div>

        <div style={{ flex:1, overflow:"auto", padding:26 }}>
          {tab==="dashboard"  && <DashboardTab onNew={()=>setModal(true)} />}
          {tab==="shipments"  && <ShipmentsTab onNew={()=>setModal(true)} />}
          {tab==="modes"      && <FreightModesTab />}
          {tab==="tarieven"   && <TarievenTab />}
          {tab==="carriers"   && <CarriersTab />}
          {tab==="masters"    && <MastersTab />}
          {tab==="sales"      && <SalesTab />}
          {tab==="financien"  && <FinancienTab />}
          {tab==="documenten" && <DocumentenTab />}
          {tab==="reports"    && <ReportsTab />}
          {tab==="analytics"  && <AnalyticsTab />}
          {tab==="settings"   && <SettingsTab />}
        </div>
      </div>

      {modal && <Modal onClose={()=>setModal(false)} />}
    </div>
  );
}
