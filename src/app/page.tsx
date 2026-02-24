"use client";

import { useEffect, useState } from "react";
import { FaGithub, FaSearch } from "react-icons/fa";
import Head from "next/head";
import { FaGasPump, FaLocationDot, FaRoad } from "react-icons/fa6";
import Link from "next/link";

interface District {
  id: number;
  state: string;
  stateCode: string;
  districtCode: string;
  district: string;
  provider: "torrent" | "agp" | "megha";
  station_id: number | string;
}

interface Result {
  cngCost: string;
  totalCost: string;
  fuelRequired: string;
  tollCharges: string;
}
interface GroupedDistricts {
  [key: string]: District[];
}

export default function Home() {
  const [fuelCost, setFuelCost] = useState<number>(92);
  const [lastUpdatedDate, setLastUpdatedDate] = useState<string>("");
  const [groupedDistricts, setGroupedDistricts] = useState<GroupedDistricts>(
    {},
  );
  const [distance, setDistance] = useState<number>(100);
  const [efficiency, setEfficiency] = useState<number>(20);
  const [tollCharges, setTotalCharges] = useState<number>(0);
  const [results, setResults] = useState<Result>();
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null,
  );
  const [usedFallbackCost, setUsedFallbackCost] = useState<boolean>(false);

  const resolveFuelCost = (value: unknown) => {
    if (value === null || value === undefined || value === "") {
      return { value: 93, isFallback: true };
    }

    const parsedValue =
      typeof value === "number" ? value : parseFloat(String(value));
    if (!Number.isFinite(parsedValue)) {
      return { value: 93, isFallback: true };
    }

    return { value: parsedValue, isFallback: false };
  };

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch("/api/districts");
        const data: District[] = await response.json();

        // Group districts by state
        const grouped: GroupedDistricts = data.reduce((acc, district) => {
          if (!acc[district.state]) {
            acc[district.state] = [];
          }
          acc[district.state].push(district);
          return acc;
        }, {} as GroupedDistricts);

        Object.keys(grouped).forEach((state) => {
          grouped[state].sort((a, b) => a.district.localeCompare(b.district));
        });

        setGroupedDistricts(grouped);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, []);

  const handleDistrictChange = async (districtId: number | null) => {
    if (districtId) {
      setLoading(true);
      setSelectedDistrictId(districtId);
      const selectedDistrict = Object.values(groupedDistricts)
        .flatMap((stateDistricts) =>
          stateDistricts.map((district): District | null => {
            return district.id === districtId ? district : null;
          }),
        )
        .find((district) => district !== null);

      if (selectedDistrict) {
        try {
          const response = await fetch(
            `/api/cng-cost?provider=${encodeURIComponent(
              JSON.stringify(selectedDistrict),
            )}`,
          );

          if (selectedDistrict.provider === "agp") {
            const { rate } = await response.json();
            const resolvedRate = resolveFuelCost(rate);
            setFuelCost(resolvedRate.value);
            setUsedFallbackCost(resolvedRate.isFallback);

            setLastUpdatedDate("");
          } else if (selectedDistrict.provider === "torrent") {
            const { rate, lastUpdatedTxt } = await response.json();
            const resolvedRate = resolveFuelCost(rate);
            setFuelCost(resolvedRate.value);
            setUsedFallbackCost(resolvedRate.isFallback);

            // Update the last Updated field
            setLastUpdatedDate(lastUpdatedTxt);
          } else if (selectedDistrict.provider === "megha") {
            const { rate, lastUpdatedTxt } = await response.json();
            const resolvedRate = resolveFuelCost(rate);
            setFuelCost(resolvedRate.value);
            setUsedFallbackCost(resolvedRate.isFallback);

            // Update the last Updated field
            setLastUpdatedDate(lastUpdatedTxt);
          }
        } catch (error) {
          console.error("Error fetching CNG cost:", error);
        } finally {
          setLoading(false);
        }
      }
    } else {
      setSelectedDistrictId(null);
      setFuelCost(0);
      setLastUpdatedDate("");
      setUsedFallbackCost(false);
    }
  };

  const handleDistrictSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const districtId = event.target.value ? Number(event.target.value) : null;
    handleDistrictChange(districtId);
  };

  const calculateFuelCost = () => {
    // const calculatedResults: string[] = [];
    const fuelCostPerLiter = fuelCost;

    if (efficiency > 0) {
      const fuelRequired = distance / efficiency;
      const cngTotalCost = fuelRequired * fuelCostPerLiter;
      const totalCost = cngTotalCost + tollCharges;

      // calculatedResults.push(
      //   ` Rs. ${totalCost.toFixed(2)} is needed for ${fuelRequired.toFixed(
      //     2
      //   )} KG of CNG.`
      // );

      setResults({
        cngCost: cngTotalCost.toFixed(2),
        totalCost: totalCost.toFixed(2),
        fuelRequired: fuelRequired.toFixed(2),
        tollCharges: tollCharges.toString(),
      });
    }

    // const efficiencies = [40, 30, 20, 10, 5, 3, 2];
    // efficiencies.forEach((eff) => {
    //   const fuelNeeded = distance * eff;
    //   const cost = fuelNeeded * fuelCostPerLiter;
    //   calculatedResults.push(
    //     `If ${eff} KG per 100 km, it will use ${fuelNeeded.toFixed(
    //       2
    //     )} KG of CNG with cost of Rs. ${cost.toFixed(2)}`
    //   );
    // });

    // setResults({
    //   totalCost: totalCost.toFixed(2),
    //   fuelRequired: fuelRequired.toFixed(2),
    // });
  };

  const changeFuelCost = (event: React.ChangeEvent<HTMLInputElement>) => {
    // event
    const fuelCost = resolveFuelCost(event.target.value);
    setFuelCost(fuelCost.value);
    setUsedFallbackCost(false);
  };

  return (
    <>
      <Head>
        <title>Automatic CNG Calc</title>
        <meta
          name="description"
          content="Calculate CNG costs based on your selected district."
        />
        <meta name="keywords" content="CNG, Calculator, Fuel Cost" />
        <meta name="author" content="Anbuselvan Annamalai" />
        <meta property="og:title" content="CNG Calculator" />
        <meta
          property="og:description"
          content="Calculate CNG costs based on your selected district."
        />
        {/* <meta property="og:image" content="/path/to/image.jpg" />{" "} */}
        {/* Replace with your image path */}
        <meta property="og:url" content="https://smart-cng.vercel.app/" />
      </Head>
      <div className="min-h-screen bg-linear-to-br from-blue-500 via-indigo-500 to-purple-500 px-3 py-5 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
        <main className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-bold mb-5 text-transparent bg-clip-text bg-linear-to-r from-white to-green-300 text-center">
            Smart CNG Calculator
          </h2>
          <form className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8 mb-5 border border-white/40">
            <div className="mb-5 flex-1">
              <div className="flex items-center justify-between">
                <label
                  className="block text-gray-700 text-sm font-semibold mb-2"
                  htmlFor="distance"
                >
                  Distance (in km)
                </label>

                <div className="">
                  <label
                    className="inline-flex items-center cursor-pointer"
                    htmlFor="toggle"
                  >
                    <div className="relative">
                      <input
                        id="toggle"
                        type="checkbox"
                        className="sr-only"
                        onChange={(e) => {
                          setFuelCost(0);
                          setSelectedDistrictId(null);
                          setLastUpdatedDate("");
                          setUsedFallbackCost(false);
                          setToggle(e.target.checked);
                        }}
                      />
                      <div
                        className={`block w-10 h-5 rounded-full ${
                          toggle ? "bg-green-500" : "bg-gray-300"
                        }`}
                      ></div>
                      <div
                        className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition ${
                          toggle ? "translate-x-5" : ""
                        }`}
                      ></div>
                    </div>
                    <div className="ml-3 text-gray-600 font-semibold text-sm">
                      Within District
                    </div>
                  </label>
                </div>
              </div>
              <input
                type="number"
                id="distance"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-gray-800 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Enter distance"
              />
            </div>
            <div className="mb-5">
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="efficiency"
              >
                Efficiency (km/kg)
              </label>
              <input
                type="number"
                id="efficiency"
                value={efficiency}
                onChange={(e) => setEfficiency(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-gray-800 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="Enter efficiency"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {toggle ? (
                <div className="mb-2 sm:mb-0">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="district"
                  >
                    Select District
                  </label>
                  <select
                    id="district"
                    value={selectedDistrictId ?? ""}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-gray-800 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    onChange={handleDistrictSelectChange}
                  >
                    <option value="">Select a district</option>
                    {Object.keys(groupedDistricts).map((state) => (
                      <optgroup key={state} label={state}>
                        {groupedDistricts[state].map((district) => (
                          <option
                            key={`${state}-${district.id}`}
                            value={district.id}
                          >
                            {district.district} - (
                            {district.provider.toLowerCase()})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {loading && (
                    <div className="text-blue-600 mt-2 text-sm font-medium">
                      Loading district fuel cost...
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-2 sm:mb-0">
                  <label
                    className="block text-gray-700 text-sm font-semibold mb-2"
                    htmlFor="fuelCost"
                  >
                    Fuel Cost (per kg)
                  </label>
                  <input
                    type="number"
                    id="fuelCost"
                    min={0}
                    value={fuelCost}
                    onChange={(e) => setFuelCost(Number(e.target.value))}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-gray-800 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder="Enter fuel cost"
                  />
                </div>
              )}

              <div className="mb-2 sm:mb-0">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="tollCharges"
                >
                  <span className="font-semibold">Toll Charges</span>
                  <span className="text-gray-300 ml-2">(Optional)</span>
                </label>
                <input
                  type="number"
                  id="tollCharges"
                  value={tollCharges}
                  min={0}
                  onChange={(e) => setTotalCharges(Number(e.target.value))}
                  className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-gray-800 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  placeholder="Enter Toll Charge charges"
                />
              </div>
            </div>

            {fuelCost && toggle ? (
              <div className="mt-4 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-xl bg-blue-50 px-3 py-3 border border-blue-100">
                <span className="text-gray-800 text-base font-semibold">
                  Rs. {fuelCost.toFixed(2)}{" "}
                  <span className="text-gray-600 font-medium text-xs">
                    / kg
                  </span>
                  {usedFallbackCost && (
                    <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 text-xs rounded ml-2 font-normal mt-1 sm:mt-0">
                      (Realtime fuel cost not available, show average fuel
                      cost.)
                    </span>
                  )}
                </span>
                {lastUpdatedDate && (
                  <span className="bg-purple-100 text-purple-800 px-2.5 py-1.5 text-xs rounded-lg border border-purple-200">
                    <span className="font-medium">Last Updated:</span>{" "}
                    {lastUpdatedDate}
                  </span>
                )}
              </div>
            ) : (
              <div className="mt-4 mb-5 rounded-xl bg-blue-50 px-3 py-3 border border-blue-100">
                <input
                  type="range"
                  id="fuelCost"
                  min="50"
                  max="150"
                  value={fuelCost}
                  className="w-full accent-blue-600"
                  onChange={changeFuelCost}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Fuel Cost: Rs. {fuelCost.toFixed(2)} / kg
                </div>
              </div>
            )}
            <div className="flex items-center justify-between mt-1">
              <button
                type="button"
                onClick={calculateFuelCost}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                Calculate
              </button>
            </div>
          </form>
          {results && (
            <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl mb-5 border border-white/40 overflow-hidden">
              <h3 className="text-lg sm:text-xl font-semibold text-green-600 flex flex-col sm:flex-row items-start sm:items-center gap-2 px-4 sm:px-6 pt-5 sm:pt-6">
                <div className="flex items-center text-green-700">
                  <FaGasPump className="w-6 mr-2" />
                  <span className="mr-2"> Rs. {results.totalCost}</span>
                </div>
                <span className="text-gray-600! text-sm sm:text-base">
                  is needed for {results.fuelRequired} KG of CNG
                  {results.tollCharges && results.tollCharges !== "0" && (
                    <span>, with toll charges</span>
                  )}
                  .
                </span>
                {/* {results.join(",")} */}
              </h3>
              <div className="text-gray-600 text-sm font-medium bg-blue-50/80 px-4 sm:px-6 py-4 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-blue-100">
                <div>
                  (CNG: ₹{results.cngCost}
                  {results.tollCharges &&
                    results.tollCharges !== "0" &&
                    results.tollCharges !== "" &&
                    `, Toll charges: ₹${results.tollCharges}`}
                  )
                </div>
                <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    className="border border-blue-200 bg-white hover:bg-blue-100 rounded-lg px-2.5 py-1.5"
                  >
                    <FaLocationDot className="w-3 mr-1 inline-flex" /> Maps
                  </a>
                  <a
                    href="https://tollguru.com/toll-calculator-india"
                    target="_blank"
                    className="border border-blue-200 bg-white hover:bg-blue-100 rounded-lg px-2.5 py-1.5"
                  >
                    <FaRoad className="w-3 mr-1 inline-flex" /> Tolls
                  </a>
                </div>
              </div>

              {/* {results.map((result, index) => (
                <p key={index} className="text-gray-700">
                  {result}
                </p>
              ))} */}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-sm pb-2">
            <a
              href="https://github.com/anburocky3/cng-calculator/fork" // Replace with your GitHub URL
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-white hover:text-gray-200 justify-center bg-white/10 px-3 py-1.5 rounded-full border border-white/20"
            >
              <FaGithub className="w-4 h-4 mr-2" /> {/* GitHub icon */}
              Open Source project
            </a>{" "}
            <span className="text-gray-300">|</span>
            <Link
              href="/when-to-gas"
              className="flex items-center text-white hover:text-gray-200 justify-center bg-white/10 px-3 py-1.5 rounded-full border border-white/20"
            >
              <FaGasPump className="w-4 h-4 mr-2" />
              When to Gas
            </Link>
            <span className="text-gray-300">|</span>
            <Link
              href="/rto-search"
              className="flex items-center text-white hover:text-gray-200 justify-center bg-white/10 px-3 py-1.5 rounded-full border border-white/20"
            >
              <FaSearch className="w-4 h-4 mr-2" />
              RTO Search
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
