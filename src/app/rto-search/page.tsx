"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

interface RtoEntry {
  code: string;
  office: string;
}

type StateKey = "TN" | "KA" | "KL" | "TS" | "AP";
type SelectedStateKey = StateKey | "ALL";

const stateLabels: Record<StateKey, string> = {
  TN: "Tamil Nadu",
  KA: "Karnataka",
  KL: "Kerala",
  TS: "Telangana",
  AP: "Andhra Pradesh",
};

const stateKeys: StateKey[] = ["TN", "KA", "KL", "TS", "AP"];

const tamilNaduEntries: RtoEntry[] = [
  { code: "TN-01", office: "Chennai Central (Ayanavaram)" },
  { code: "TN-02", office: "Chennai North West (Anna Nagar)" },
  { code: "TN-03", office: "Chennai North East (Tondiarpet)" },
  { code: "TN-04", office: "Chennai East (Royapuram)" },
  { code: "TN-05", office: "Chennai North (Kolathur)" },
  { code: "TN-06", office: "Chennai South East (Mandalveli)" },
  { code: "TN-07", office: "Chennai South (Adyar)" },
  { code: "TN-09", office: "Chennai West (K.K. Nagar)" },
  { code: "TN-10", office: "Chennai South West (Virugambakkam)" },
  { code: "TN-11", office: "Tambaram" },
  { code: "TN-12", office: "Poonamallee" },
  { code: "TN-13", office: "Ambattur" },
  { code: "TN-14", office: "Sholinganallur" },
  { code: "TN-15 / TN-15M", office: "Ulundurpet" },
  { code: "TN-16", office: "Tindivanam" },
  { code: "TN-18", office: "Redhills" },
  { code: "TN-19", office: "Chengalpattu" },
  { code: "TN-20", office: "Thiruvallur" },
  { code: "TN-21", office: "Kanchipuram" },
  { code: "TN-22", office: "Meenambakkam" },
  { code: "TN-23 / TN-23T", office: "Vellore" },
  { code: "TN-24", office: "Krishnagiri" },
  { code: "TN-25 / TN-25Y / TN-25Z", office: "Tiruvannamalai" },
  { code: "TN-28 / TN-28Z", office: "Namakkal" },
  { code: "TN-29", office: "Dharmapuri" },
  { code: "TN-30", office: "Salem West" },
  { code: "TN-31", office: "Cuddalore" },
  { code: "TN-32", office: "Villupuram" },
  { code: "TN-33", office: "Erode East" },
  { code: "TN-34", office: "Tiruchengode" },
  { code: "TN-36", office: "Gobi" },
  { code: "TN-37", office: "Coimbatore South" },
  { code: "TN-38", office: "Coimbatore North" },
  { code: "TN-40", office: "Mettupalayam" },
  { code: "TN-41", office: "Pollachi" },
  { code: "TN-42", office: "Tirupur South" },
  { code: "TN-43", office: "Ooty" },
  { code: "TN-45", office: "Trichy West" },
  { code: "TN-46", office: "Perambalur" },
  { code: "TN-47", office: "Karur" },
  { code: "TN-48", office: "Srirangam (Trichy)" },
  { code: "TN-49", office: "Thanjavur" },
  { code: "TN-50", office: "Tiruvarur" },
  { code: "TN-51", office: "Nagapattinam" },
  { code: "TN-55", office: "Pudukkottai" },
  { code: "TN-57", office: "Dindigul" },
  { code: "TN-58", office: "Madurai South" },
  { code: "TN-59", office: "Madurai North" },
  { code: "TN-61", office: "Ariyalur" },
  { code: "TN-63", office: "Sivagangai" },
  { code: "TN-64", office: "Madurai Central" },
  { code: "TN-65", office: "Ramanathapuram" },
  { code: "TN-67 / TN-84", office: "Virudhunagar" },
  { code: "TN-68", office: "Kumbakonam" },
  { code: "TN-69", office: "Tuticorin" },
  { code: "TN-70", office: "Hosur" },
  { code: "TN-72", office: "Tirunelveli" },
  { code: "TN-73", office: "Ranipet" },
  { code: "TN-74", office: "Nagercoil" },
  { code: "TN-75", office: "Marthandam" },
  { code: "TN-76", office: "Tenkasi" },
  { code: "TN-77", office: "Attur" },
  { code: "TN-78", office: "Dharapuram" },
  { code: "TN-79", office: "Sankarankovil" },
  { code: "TN-97", office: "Arani" },
  {
    code: "TN-15M / TN-23T / TN-25Y-Z / TN-48Z / etc.",
    office: "Unit & Enforcement Offices",
  },
];

const karnatakaEntries: RtoEntry[] = [
  { code: "KA-01", office: "RTO Bengaluru (Central)" },
  { code: "KA-02", office: "RTO Bengaluru (West)" },
  { code: "KA-03", office: "RTO Bengaluru (East)" },
  { code: "KA-04", office: "RTO Bengaluru (North)" },
  { code: "KA-05", office: "RTO Bengaluru (South)" },
  { code: "KA-06", office: "RTO Tumakuru" },
  { code: "KA-07", office: "RTO Kolar" },
  { code: "KA-08", office: "RTO Kolar Gold Fields (KGF)" },
  { code: "KA-09", office: "RTO Mysuru (West)" },
  { code: "KA-10", office: "RTO Chamarajanagar" },
  { code: "KA-11", office: "RTO Mandya" },
  { code: "KA-12", office: "RTO Madikeri (Kodagu)" },
  { code: "KA-13", office: "RTO Hassan" },
  { code: "KA-14", office: "RTO Shivamogga" },
  { code: "KA-15", office: "RTO Sagar" },
  { code: "KA-16", office: "RTO Chitradurga" },
  { code: "KA-17", office: "RTO Davanagere" },
  { code: "KA-18", office: "RTO Chikkamagaluru" },
  { code: "KA-19", office: "RTO Mangaluru" },
  { code: "KA-20", office: "RTO Udupi" },
  { code: "KA-21", office: "RTO Puttur" },
  { code: "KA-22", office: "RTO Belagavi" },
  { code: "KA-23", office: "RTO Chikkodi" },
  { code: "KA-24", office: "RTO Bailhongal" },
  { code: "KA-25", office: "RTO Dharwad" },
  { code: "KA-26", office: "RTO Gadag" },
  { code: "KA-27", office: "RTO Haveri" },
  { code: "KA-28", office: "RTO Vijayapura" },
  { code: "KA-29", office: "RTO Bagalkot" },
  { code: "KA-30", office: "RTO Karwar" },
  { code: "KA-31", office: "RTO Sirsi" },
  { code: "KA-32", office: "RTO Kalaburagi" },
  { code: "KA-33", office: "RTO Yadgir" },
  { code: "KA-34", office: "RTO Ballari" },
  { code: "KA-35", office: "RTO Hospet" },
  { code: "KA-36", office: "RTO Raichur" },
  { code: "KA-37", office: "RTO Koppal" },
  { code: "KA-38", office: "RTO Bidar" },
  { code: "KA-39", office: "RTO Bhalki" },
  { code: "KA-40", office: "RTO Chikkaballapur" },
  { code: "KA-41", office: "RTO Jnanabharathi" },
  { code: "KA-42", office: "RTO Ramanagara" },
  { code: "KA-43", office: "RTO Devanahalli" },
  { code: "KA-44", office: "RTO Tiptur" },
  { code: "KA-45", office: "RTO Hunsur" },
  { code: "KA-46", office: "RTO Sakleshpur" },
  { code: "KA-47", office: "RTO Honnavar" },
  { code: "KA-48", office: "RTO Jamkhandi" },
  { code: "KA-49", office: "RTO Gokak" },
  { code: "KA-50", office: "RTO Yelahanka" },
  { code: "KA-51", office: "RTO Electronic City" },
  { code: "KA-52", office: "RTO Nelamangala" },
  { code: "KA-53", office: "RTO Krishnarajapuram" },
  { code: "KA-54", office: "RTO Nagamangala" },
  { code: "KA-55", office: "RTO Mysuru (East)" },
  { code: "KA-56", office: "RTO Basavakalyan" },
  { code: "KA-57", office: "RTO Shanthinagar" },
  { code: "KA-58", office: "RTO Chandapura" },
  { code: "KA-59", office: "RTO Anekal" },
  { code: "KA-60", office: "RTO Doddaballapura" },
  { code: "KA-61", office: "RTO Bengaluru (Yeshwanthpur)" },
  { code: "KA-62", office: "RTO Bengaluru (Rajajinagar)" },
  { code: "KA-63", office: "RTO Dharwad (East)" },
  { code: "KA-64", office: "RTO Madhugiri" },
  { code: "KA-65", office: "RTO Dandeli" },
  { code: "KA-66", office: "RTO Tarikere" },
  { code: "KA-67", office: "RTO Chintamani" },
  { code: "KA-68", office: "RTO Ranebennur" },
  { code: "KA-69", office: "RTO Ramdurg" },
  { code: "KA-70", office: "RTO Bantwal" },
  { code: "KA-71", office: "RTO Athani" },
];

const keralaEntries: RtoEntry[] = [
  { code: "KL-01", office: "RTO Trivandrum" },
  { code: "KL-02", office: "RTO Kollam" },
  { code: "KL-03", office: "RTO Pathanamthitta" },
  { code: "KL-04", office: "RTO Alappuzha" },
  { code: "KL-05", office: "RTO Kottayam" },
  { code: "KL-06", office: "RTO Idukki" },
  { code: "KL-07", office: "RTO Ernakulam" },
  { code: "KL-08", office: "RTO Thrissur" },
  { code: "KL-09", office: "RTO Palakkad" },
  { code: "KL-10", office: "RTO Malappuram" },
  { code: "KL-11", office: "RTO Kozhikkode" },
  { code: "KL-12", office: "RTO Wayanad" },
  { code: "KL-13", office: "RTO Kannur" },
  { code: "KL-14", office: "RTO Kasaragod" },
  { code: "KL-15", office: "RTO Nationalised Sector" },
  { code: "KL-16", office: "RTO Attingal" },
  { code: "KL-17", office: "RTO Muvattupuzha" },
  { code: "KL-18", office: "RTO Vadakara" },
  { code: "KL-19", office: "SRTO Parassala" },
  { code: "KL-20", office: "SRTO Neyyattinkara" },
  { code: "KL-21", office: "SRTO Nedumangadu" },
  { code: "KL-22", office: "SRTO Kazhakuttom" },
  { code: "KL-23", office: "SRTO Karunagappally" },
  { code: "KL-24", office: "SRTO Kottarakkara" },
  { code: "KL-25", office: "SRTO Punalur" },
  { code: "KL-26", office: "SRTO Adoor" },
  { code: "KL-27", office: "SRTO Thiruvalla" },
  { code: "KL-28", office: "SRTO Mallappally" },
  { code: "KL-29", office: "SRTO Kayamkulam" },
  { code: "KL-30", office: "SRTO Chengannur" },
  { code: "KL-31", office: "SRTO Mavelikkara" },
  { code: "KL-32", office: "SRTO Cherthala" },
  { code: "KL-33", office: "SRTO Changanassery" },
  { code: "KL-34", office: "SRTO Kanjirappally" },
  { code: "KL-35", office: "SRTO Pala" },
  { code: "KL-36", office: "SRTO Vaikom" },
  { code: "KL-37", office: "SRTO Vandiperiyar" },
  { code: "KL-38", office: "SRTO Thodupuzha" },
  { code: "KL-39", office: "SRTO Tripunithura" },
  { code: "KL-40", office: "SRTO Perumbavoor" },
  { code: "KL-41", office: "SRTO Aluva" },
  { code: "KL-42", office: "SRTO North Paroor" },
  { code: "KL-43", office: "SRTO Mattancherry" },
  { code: "KL-44", office: "SRTO Kothamangalam" },
  { code: "KL-45", office: "SRTO Irinjalakuda" },
  { code: "KL-46", office: "SRTO Guruvayoor" },
  { code: "KL-47", office: "SRTO Kodungallur" },
  { code: "KL-48", office: "SRTO Vadakkancherry" },
  { code: "KL-49", office: "SRTO Alathura" },
  { code: "KL-50", office: "SRTO Mannarkkad" },
  { code: "KL-51", office: "SRTO Ottappalam" },
  { code: "KL-52", office: "SRTO Pattambi" },
  { code: "KL-53", office: "SRTO Perinthalmanna" },
  { code: "KL-54", office: "SRTO Ponnani" },
  { code: "KL-55", office: "SRTO Tirur" },
  { code: "KL-56", office: "SRTO Koyilandy" },
  { code: "KL-57", office: "SRTO Koduvally" },
  { code: "KL-58", office: "SRTO Thalassery" },
  { code: "KL-59", office: "SRTO Thaliparamba" },
  { code: "KL-60", office: "SRTO Kanhangad" },
  { code: "KL-61", office: "SRTO Kunnathur" },
  { code: "KL-62", office: "SRTO Ranni" },
  { code: "KL-63", office: "SRTO Angamaly" },
  { code: "KL-64", office: "SRTO Chalakudy" },
  { code: "KL-65", office: "SRTO Tirurangadi" },
  { code: "KL-66", office: "SRTO Kuttanadu" },
  { code: "KL-67", office: "SRTO Uzhavoor" },
  { code: "KL-68", office: "SRTO Devikulam" },
  { code: "KL-69", office: "SRTO Udumbanchola" },
  { code: "KL-70", office: "SRTO Chittur" },
  { code: "KL-71", office: "SRTO Nilambur" },
  { code: "KL-72", office: "SRTO Mananthavady" },
  { code: "KL-73", office: "SRTO Sulthan Bathery" },
  { code: "KL-74", office: "SRTO Kattakkada" },
  { code: "KL-75", office: "SRTO Thriprayar" },
  { code: "KL-76", office: "SRTO Nanmanda" },
  { code: "KL-77", office: "SRTO Perambra" },
  { code: "KL-78", office: "SRTO Iritty" },
  { code: "KL-79", office: "SRTO Vellarikundu" },
  { code: "KL-80", office: "SRTO Pathanapuram" },
  { code: "KL-81", office: "SRTO Varkala" },
  { code: "KL-82", office: "SRTO Chadayamangalam" },
  { code: "KL-83", office: "SRTO Konni" },
  { code: "KL-84", office: "SRTO Kondotty" },
  { code: "KL-85", office: "SRTO Ramanattukara" },
  { code: "KL-86", office: "SRTO Payyannur" },
];

const telanganaEntries: RtoEntry[] = [
  { code: "TG-01", office: "Adilabad" },
  { code: "TG-02", office: "Karimnagar" },
  { code: "TG-03", office: "Warangal Urban" },
  { code: "TG-04", office: "Khammam" },
  { code: "TG-05", office: "Nalgonda" },
  { code: "TG-06", office: "Mahbubnagar" },
  { code: "TS-07", office: "Ranga Reddy" },
  { code: "TG-08", office: "Medchal-Malkajgiri" },
  { code: "TG-09", office: "Hyderabad Central" },
  { code: "TG-10", office: "Hyderabad North" },
  { code: "TG-11", office: "Hyderabad East" },
  { code: "TG-12", office: "Hyderabad South" },
  { code: "TG-13", office: "Hyderabad West" },
  { code: "TG-14", office: "Reserved for Hyderabad" },
  { code: "TG-15", office: "Sangareddy" },
  { code: "TG-16", office: "Nizamabad" },
  { code: "TG-17", office: "Kamareddy" },
  { code: "TG-18", office: "Nirmal" },
  { code: "TG-19", office: "Mancherial" },
  { code: "TG-20", office: "Kumaram Bheem Asifabad" },
  { code: "TG-21", office: "Jagtial" },
  { code: "TG-22", office: "Peddapalli" },
  { code: "TG-23", office: "Sircilla" },
  { code: "TG-24", office: "Warangal Rural" },
  { code: "TG-25", office: "Jayashankar Bhupalpally" },
  { code: "TG-26", office: "Mahbubabad" },
  { code: "TG-27", office: "Jangaon" },
  { code: "TG-28", office: "Bhadradri Kothagudem" },
  { code: "TG-29", office: "Suryapet" },
  { code: "TG-30", office: "Yadadri Bhuvanagiri" },
  { code: "TG-31", office: "Nagarkurnool" },
  { code: "TG-32", office: "Wanaparthy" },
  { code: "TG-33", office: "Jogulamba Gadwal" },
  { code: "TG-34", office: "Vikarabad" },
  { code: "TG-35", office: "Medak" },
  { code: "TG-36", office: "Siddipet" },
];

const andhraPradeshEntries: RtoEntry[] = [
  { code: "AP-01", office: "RTO Nirmal" },
  { code: "AP-02", office: "RTO Anantapur" },
  { code: "AP-03", office: "RTO Tirupati (Chittoor)" },
  { code: "AP-04", office: "RTO Kadapa (YSR Kadapa)" },
  { code: "AP-05", office: "RTO Rajahmundry" },
  { code: "AP-06", office: "RTO Kakinada" },
  { code: "AP-07", office: "RTO Narasaraopet" },
  { code: "AP-08", office: "RTO Guntur" },
  {
    code: "AP-09 / AP-10 / AP-11 / AP-12 / AP-13",
    office: "RTO Hyderabad (undivided)",
  },
  { code: "AP-10", office: "RTO Secunderabad" },
  { code: "AP-14 / AP-15", office: "RTO Karimnagar" },
  { code: "AP-20", office: "RTO Khammam" },
  { code: "AP-21", office: "RTO Kurnool" },
  { code: "AP-22", office: "RTO Mahbubnagar" },
  { code: "AP-23", office: "RTO Sangareddi" },
  { code: "AP-24", office: "RTO Nalgonda" },
  { code: "AP-25", office: "RTO Nizamabad" },
  { code: "AP-26", office: "RTO Nellore" },
  { code: "AP-27", office: "RTO Ongole (Prakasam district)" },
  { code: "AP-28 / AP-29", office: "RTO Ranga Reddy" },
  { code: "AP-30", office: "RTO Srikakulam" },
  { code: "AP-31 / AP-32 / AP-33 / AP-34", office: "RTO Visakhapatnam" },
  {
    code: "AP-16 / AP-17 / AP-18 / AP-19",
    office: "RTO Vijayawada (Krishna district)",
  },
  { code: "AP-35", office: "RTO Vizianagaram" },
  { code: "AP-36", office: "RTO Warangal" },
  { code: "AP-37", office: "RTO Bhimavaram (West Godavari)" },
  { code: "AP-38", office: "RTO Eluru" },
];

const rtoEntriesByState: Record<StateKey, RtoEntry[]> = {
  TN: tamilNaduEntries,
  KA: karnatakaEntries,
  KL: keralaEntries,
  TS: telanganaEntries,
  AP: andhraPradeshEntries,
};

const splitCityArea = (office: string) => {
  const match = office.match(/^(.*?)\s*\((.*?)\)\s*$/);
  if (match) {
    return { city: match[1].trim(), area: match[2].trim() };
  }

  return { city: office.trim(), area: "-" };
};

const normalizeForSearch = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

const extractCodeTokens = (code: string) =>
  code
    .split(/\//g)
    .map((part) => part.trim())
    .flatMap((part) => part.split(/\s+/g))
    .map((part) => part.replace(/[(),]/g, "").trim())
    .filter((part) => /^[A-Za-z]{2}-?[0-9A-Za-z]+$/.test(part));

export default function RtoSearchPage() {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState<SelectedStateKey>("TN");

  const supportedStatesText = useMemo(
    () =>
      stateKeys
        .filter((state) => rtoEntriesByState[state].length > 0)
        .map((state) => stateLabels[state])
        .join(", "),
    [],
  );

  const normalizedEntries = useMemo(() => {
    const statesToSearch: StateKey[] =
      selectedState === "ALL" ? stateKeys : [selectedState];

    return statesToSearch.flatMap((state) =>
      rtoEntriesByState[state].map((entry) => {
        const { city, area } = splitCityArea(entry.office);
        const codeTokens = extractCodeTokens(entry.code);
        const searchableRaw =
          `${entry.code} ${entry.office} ${city} ${area} ${stateLabels[state]}`.toLowerCase();
        const searchableCompact = normalizeForSearch(
          `${entry.code} ${entry.office} ${city} ${area} ${stateLabels[state]} ${codeTokens.join(" ")}`,
        );

        return {
          ...entry,
          city,
          area,
          state,
          stateLabel: stateLabels[state],
          searchableRaw,
          searchableCompact,
        };
      }),
    );
  }, [selectedState]);

  const filteredEntries = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    const compactKeyword = normalizeForSearch(search.trim());

    if (!keyword) {
      return normalizedEntries;
    }

    return normalizedEntries.filter((entry) => {
      const rawMatch = entry.searchableRaw.includes(keyword);
      const compactMatch = compactKeyword
        ? entry.searchableCompact.includes(compactKeyword)
        : false;
      return rawMatch || compactMatch;
    });
  }, [search, normalizedEntries]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 via-indigo-500 to-purple-500 px-3 py-5 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
      <main className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-linear-to-r from-white to-cyan-200">
              RTO Search
            </h1>
            <p className="text-blue-100 text-sm sm:text-base mt-1">
              Search by code (like TN12), city, area, or office details.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
          >
            Back to Home
          </Link>
        </div>

        <section className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/40 overflow-hidden">
          <div className="mx-4 sm:mx-5 mt-4 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-sm text-blue-800">
            <span className="font-semibold">
              Currently supports state data:
            </span>{" "}
            {supportedStatesText}
          </div>

          <div className="p-4 sm:p-5 border-b border-blue-100 bg-linear-to-r from-blue-50 to-indigo-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
              <div>
                <label
                  htmlFor="rto-state"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  State
                </label>
                <select
                  id="rto-state"
                  value={selectedState}
                  onChange={(event) =>
                    setSelectedState(event.target.value as SelectedStateKey)
                  }
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-gray-800 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="ALL">All States</option>
                  {stateKeys.map((state) => (
                    <option key={state} value={state}>
                      {stateLabels[state]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="rto-search"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Search by code, city, area, or office
                </label>
                <input
                  id="rto-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Try: TN12, TN-23, Chennai, Trichy, Ayanavaram..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-800 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white border border-blue-100 p-3">
                  <div className="text-xs text-gray-500">
                    {selectedState === "ALL"
                      ? "All States Total"
                      : "State Total"}
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {normalizedEntries.length}
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-blue-100 p-3">
                  <div className="text-xs text-gray-500">Results</div>
                  <div className="text-2xl font-bold text-indigo-700">
                    {filteredEntries.length}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              Active state:{" "}
              <span className="font-semibold">
                {selectedState === "ALL"
                  ? "All States"
                  : stateLabels[selectedState]}
              </span>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-100/80 text-blue-900">
                  <th className="px-4 py-3 text-left font-semibold">
                    RTO Code
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">City</th>
                  <th className="px-4 py-3 text-left font-semibold">Area</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    RTO Office
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <tr
                    key={`${entry.code}-${entry.office}-${index}`}
                    className="border-t border-blue-50 hover:bg-blue-50/70 transition"
                  >
                    <td className="px-4 py-3 align-top">
                      <span className="inline-flex items-center rounded-lg bg-indigo-100 text-indigo-800 px-2 py-1 font-semibold">
                        {entry.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top font-medium text-gray-900">
                      {entry.city}
                    </td>
                    <td className="px-4 py-3 align-top text-gray-700">
                      {entry.area}
                    </td>
                    <td className="px-4 py-3 align-top text-gray-700">
                      {entry.office}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden p-3 space-y-3 bg-blue-50/40">
            {filteredEntries.map((entry, index) => (
              <article
                key={`${entry.code}-${entry.office}-${index}`}
                className="rounded-xl bg-white border border-blue-100 p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center rounded-lg bg-indigo-100 text-indigo-800 px-2 py-1 text-xs font-semibold">
                    {entry.code}
                  </span>
                  <span className="text-xs text-gray-500">#{index + 1}</span>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="text-sm text-gray-500">City</div>
                  <div className="text-base font-semibold text-gray-900">
                    {entry.city}
                  </div>
                </div>

                <div className="mt-2 grid grid-cols-1 gap-2">
                  <div>
                    <div className="text-sm text-gray-500">Area</div>
                    <div className="text-sm text-gray-800">{entry.area}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Office</div>
                    <div className="text-sm text-gray-800">{entry.office}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <div className="p-8 text-center text-gray-600 bg-white">
              No matching RTO found. Try a different code or city.
            </div>
          )}

          {normalizedEntries.length === 0 && (
            <div className="px-6 pb-6 text-sm text-gray-600 bg-white">
              Data for{" "}
              {selectedState === "ALL"
                ? "the selected filters"
                : stateLabels[selectedState]}{" "}
              is not added yet. The filter is ready—add entries in{" "}
              <span className="font-semibold">rtoEntriesByState</span>.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
