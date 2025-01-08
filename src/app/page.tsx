"use client";

import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import Head from "next/head";
import { FaGasPump, FaLocationDot, FaRoad } from "react-icons/fa6";

interface District {
  id: number;
  state: string;
  stateCode: string;
  districtCode: string;
  district: string;
  provider: "torrent" | "agp";
  station_id: number;
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
    {}
  );
  const [distance, setDistance] = useState<number>(100);
  const [efficiency, setEfficiency] = useState<number>(20);
  const [tollCharges, setTotalCharges] = useState<number>(0);
  const [results, setResults] = useState<Result>();
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

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

        setGroupedDistricts(grouped);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, []);

  const handleDistrictChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedProvider = event.target.value;

    if (selectedProvider) {
      setLoading(true);
      const selectedDistrict = Object.values(groupedDistricts)
        .flatMap((stateDistricts) =>
          stateDistricts.map((district): District | null => {
            return district.id === Number(selectedProvider) ? district : null;
          })
        )
        .find((district) => district !== null);

      if (selectedDistrict) {
        try {
          const response = await fetch(
            `/api/cng-cost?provider=${encodeURIComponent(
              JSON.stringify(selectedDistrict)
            )}`
          );

          if (selectedDistrict.provider === "agp") {
            const { rate } = await response.json();
            setFuelCost(parseInt(rate));

            setLastUpdatedDate("");
          } else if (selectedDistrict.provider === "torrent") {
            const { rate, lastUpdatedTxt } = await response.json();
            setFuelCost(parseInt(rate));

            // Update the last Updated field
            setLastUpdatedDate(lastUpdatedTxt);
          } else if (selectedDistrict.provider === "megha") {
            const { rate, lastUpdatedTxt } = await response.json();
            setFuelCost(parseInt(rate));

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
      setFuelCost(0);
    }
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
    const fuelCost = parseInt(event.target.value);
    setFuelCost(fuelCost);
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
        <meta property="og:url" content="https://cng-calc.vercel.app" />
      </Head>
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-3 sm:p-20 pb-20">
        <main className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400 text-center p-3 sm:p-0">
            Smart CNG Calculator
          </h2>
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4 flex-1">
              <div className="flex items-center justify-between">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
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
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter distance"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="efficiency"
              >
                Efficiency (km/kg)
              </label>
              <input
                type="number"
                id="efficiency"
                value={efficiency}
                onChange={(e) => setEfficiency(Number(e.target.value))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter efficiency"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-5">
              {toggle ? (
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="district"
                  >
                    Select District
                  </label>
                  <select
                    id="district"
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight 
                focus:outline-none focus:shadow-outline"
                    onChange={handleDistrictChange}
                  >
                    <option value="">Select a district</option>
                    {Object.keys(groupedDistricts).map((state) => (
                      <optgroup key={state} label={state}>
                        {groupedDistricts[state].map((district) => (
                          <option key={district.district} value={district.id}>
                            {district.district}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  {loading && (
                    <div className="text-blue-500 mt-2">Loading...</div>
                  )}
                </div>
              ) : (
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter fuel cost"
                  />
                </div>
              )}

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                  htmlFor="tollCharges"
                >
                  <span className=" font-bold ">Toll Charges</span>
                  <span className="text-gray-300 ml-2">(Optional)</span>
                </label>
                <input
                  type="number"
                  id="tollCharges"
                  value={tollCharges}
                  min={0}
                  onChange={(e) => setTotalCharges(Number(e.target.value))}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter Toll Charge charges"
                />
              </div>
            </div>

            {fuelCost && toggle ? (
              <div className="mb-4 flex items-center justify-between">
                <span className="text-gray-700 text-sm font-bold">
                  Rs. {fuelCost.toFixed(2)}
                </span>
                {lastUpdatedDate && (
                  <span className="bg-purple-400 px-2 py-1 text-xs rounded">
                    Last Updated: {lastUpdatedDate}
                  </span>
                )}
              </div>
            ) : (
              <div className="mb-4">
                <input
                  type="range"
                  id="fuelCost"
                  min="50"
                  max="150"
                  value={fuelCost}
                  className="w-full"
                  onChange={changeFuelCost}
                />
              </div>
            )}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={calculateFuelCost}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Calculate
              </button>
            </div>
          </form>

          {results && (
            <div className="bg-white shadow-md rounded  mb-4">
              <h3 className="sm:text-xl font-semibold text-green-500 flex flex-col sm:flex-row items-start sm:items-center px-8 pt-8">
                <div className="flex items-center">
                  <FaGasPump className="w-6 mr-2" />
                  <span className="mr-2"> Rs. {results.totalCost}</span>
                </div>
                <span className="!text-gray-500">
                  is needed for {results.fuelRequired} KG of CNG
                  {results.tollCharges && results.tollCharges !== "0" && (
                    <span>, with toll charges</span>
                  )}
                  .
                </span>
                {/* {results.join(",")} */}
              </h3>
              <div className="text-gray-500 text-sm font-semibold bg-blue-50 py-2 rounded px-8 mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
                <div className=" ">
                  (CNG: ₹{results.cngCost}
                  {results.tollCharges &&
                    results.tollCharges !== "0" &&
                    results.tollCharges !== "" &&
                    `, Toll charges: ₹${results.tollCharges}`}
                  )
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    className="border hover:bg-blue-100 rounded px-2 py-1"
                  >
                    <FaLocationDot className="w-3 mr-1 inline-flex" /> Maps
                  </a>
                  <a
                    href="https://tollguru.com/toll-calculator-india"
                    target="_blank"
                    className="border hover:bg-blue-100 rounded px-2 py-1"
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
          <a
            href="https://github.com/anburocky3/cng-calculator/fork" // Replace with your GitHub URL
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-white hover:text-gray-200 justify-center text-sm"
          >
            <FaGithub className="w-4 h-4 mr-2" /> {/* GitHub icon */}
            Open Source project
          </a>
        </main>
      </div>
    </>
  );
}
