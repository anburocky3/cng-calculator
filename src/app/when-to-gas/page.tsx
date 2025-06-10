"use client";
import Head from "next/head";
import { useState } from "react";
import Image from "next/image";

interface Bunk {
  id: number;
  name: string;
  provider: string;
  distance: number;
  service: string;
  state: string;
  stateCode: string;
  districtCode: string;
  district: string;
  station_id: number;
  address: {
    lat: number;
    lng: number;
  };
}

const bunk: Bunk[] = [
  {
    id: 1,
    name: "Paruthipattu",
    provider: "torrent",
    distance: 5,
    service: "HP",
    state: "Tamil Nadu",
    stateCode: "TN",
    districtCode: "TRL",
    district: "Tiruvallur",
    station_id: 673,
    address: {
      lat: 13.062387904620302,
      lng: 80.10880154806667,
    },
  },
  {
    id: 2,
    name: "Senneer Kuppam",
    provider: "torrent",
    service: "BPCL",
    distance: 8,
    state: "Tamil Nadu",
    stateCode: "TN",
    districtCode: "TRL",
    district: "Tiruvallur",
    station_id: 673,
    address: {
      lat: 13.06199232743705,
      lng: 80.11313709163028,
    },
  },
  {
    id: 3,
    name: "Urapakkam",
    provider: "agp",
    service: "IOCL",
    distance: 35,
    state: "Tamil Nadu",
    stateCode: "TN",
    districtCode: "KAN",
    district: "Kancheepuram",
    station_id: 673,
    address: {
      lat: 12.8503046,
      lng: 80.0595732,
    },
  },
  {
    id: 4,
    name: "Maraimalai Nagar",
    provider: "agp",
    service: "BPCL",
    distance: 43,
    state: "Tamil Nadu",
    stateCode: "TN",
    districtCode: "KAN",
    district: "Kancheepuram",
    station_id: 673,
    address: {
      lat: 12.8028578,
      lng: 80.0257043,
    },
  },
  {
    id: 5,
    name: "Chengalpattu",
    provider: "agp",
    service: "BPCL",
    distance: 57,
    state: "Tamil Nadu",
    stateCode: "TN",
    districtCode: "CHG",
    district: "Chengalpattu",
    station_id: 673,
    address: {
      lat: 12.6941982,
      lng: 79.9600517,
    },
  },
  {
    id: 6,
    name: "Meduranthagam",
    provider: "agp",
    service: "IOCL",
    distance: 71,
    state: "Tamil Nadu",
    stateCode: "TN",
    districtCode: "CHG",
    district: "Chengalpattu",
    station_id: 673,
    address: {
      lat: 12.5959069,
      lng: 79.9167915,
    },
  },
  {
    id: 7,
    name: "Melmaruvathur",
    provider: "agp",
    service: "BPCL",
    distance: 95,
    state: "Tamil Nadu",
    stateCode: "TN",
    districtCode: "CHG",
    district: "Chengalpattu",
    station_id: 673,
    address: {
      lat: 12.433473,
      lng: 79.830838,
    },
  },
  {
    id: 8,
    name: "Tindivanam",
    provider: "megha",
    service: "BPCL",
    distance: 124,
    state: "Tamil Nadu",
    stateCode: "TN",
    districtCode: "CHG",
    district: "Chengalpattu",
    station_id: 673,
    address: {
      lat: 12.2262325,
      lng: 79.6463631,
    },
  },
  {
    id: 9,
    name: "Panruti",
    provider: "agp",
    service: "IOCL",
    distance: 180,
    state: "Tamil Nadu",
    stateCode: "TN",
    districtCode: "CUD",
    district: "Cuddalore",
    station_id: 673,
    address: {
      lat: 11.7731301,
      lng: 79.5511944,
    },
  },
  {
    id: 10,
    name: "Neyveli T.P.",
    provider: "adani",
    service: "BPCL",
    distance: 214,
    state: "Tamil Nadu",
    stateCode: "TN",
    districtCode: "CUD",
    district: "Cuddalore",
    station_id: 673,
    address: {
      lat: 11.6486968,
      lng: 79.4973576,
    },
  },
  {
    id: 11,
    name: "Vadalur",
    provider: "adani",
    service: "HP",
    distance: 215,
    state: "Tamil Nadu",
    stateCode: "TN",
    districtCode: "CUD",
    district: "Cuddalore",
    station_id: 673,
    address: {
      lat: 11.5317311,
      lng: 79.4575048,
    },
  },
];

const getServiceLogo = (service: string) => {
  switch (service.toUpperCase()) {
    case "IOCL":
      return "/img/iocl.png";
    case "HP":
      return "/img/hp.png";
    case "BPCL":
      return "/img/bp.png";
    default:
      return "/img/hp.png"; // Default to HP logo
  }
};

export default function WhenToGas() {
  const [cngLevel, setCngLevel] = useState(4);
  const [selectedBunk, setSelectedBunk] = useState<Bunk | null>(null);
  const [nextBunk, setNextBunk] = useState<Bunk | null>(null);
  const [kmPerPoint, setKmPerPoint] = useState(20);
  const MAX_CNG_POINTS = 8;

  //   const getReachableBunks = (currentLevel = cngLevel) => {
  //     const maxDistance = currentLevel * kmPerPoint;
  //     const minDistance = Math.max(0, maxDistance - kmPerPoint);
  //     return bunk
  //       .filter((b) => b.distance <= maxDistance && b.distance >= minDistance)
  //       .sort((a, b) => b.distance - a.distance);
  //   };

  const findNextAvailableBunk = (currentBunk: Bunk) => {
    const fullTankRange = MAX_CNG_POINTS * kmPerPoint;
    const nextBunks = bunk
      .filter(
        (b) => b.distance > currentBunk.distance && b.distance <= fullTankRange
      )
      .sort((a, b) => a.distance - b.distance);

    return nextBunks[0] || null;
  };

  const handleBunkChoose = (bunk: Bunk) => {
    console.log("Choosing bunk:", bunk);
    const bunkWithStatus = { ...bunk, status: "to_be_fueled" as const };
    setSelectedBunk(bunkWithStatus);
    const nextOptimalBunk = findNextAvailableBunk(bunkWithStatus);
    console.log("Next optimal bunk:", nextOptimalBunk);
    setNextBunk(nextOptimalBunk);
  };

  const getBunkStatus = (bunk: Bunk) => {
    const maxDistance = cngLevel * kmPerPoint;
    const minDistance = Math.max(0, maxDistance - kmPerPoint);

    if (bunk.distance > maxDistance) return "Too Far";
    if (bunk.distance < minDistance) return "Too Close";
    return "Optimal Range";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Optimal Range":
        return "text-green-600";
      case "Too Far":
        return "text-yellow-600";
      case "Too Close":
        return "text-gray-400";
      default:
        return "text-gray-600";
    }
  };

  return (
    <>
      <Head>
        <title>When to Gas - Smart CNG</title>
        <meta name="description" content="When to Gas - Smart CNG" />
        <meta name="keywords" content="CNG, Calculator, Fuel Cost" />
        <meta name="author" content="Anbuselvan Annamalai" />
        <meta property="og:title" content="When to Gas - Smart CNG" />
        <meta property="og:description" content="When to Gas - Smart CNG" />
        {/* <meta property="og:image" content="/path/to/image.jpg" />{" "} */}
        {/* Replace with your image path */}
        <meta
          property="og:url"
          content="https://smart-cng.vercel.app/when-to-gas"
        />
      </Head>
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-500 p-2 sm:p-4 md:p-6 lg:p-8 xl:p-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-7xl mx-auto">
          {/* Distance coverage */}
          <div className="w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400 text-center p-2 sm:p-0">
              When to Gas?
            </h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="p-3 sm:p-4 bg-blue-50 border-b">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-2">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      CNG Level (Points)
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max={MAX_CNG_POINTS}
                        value={cngLevel}
                        onChange={(e) => setCngLevel(Number(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="absolute -top-6 right-0 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                        {cngLevel} points
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      KM per Point
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={kmPerPoint}
                        onChange={(e) => setKmPerPoint(Number(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="absolute -top-6 right-0 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                        {kmPerPoint} km
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-4">
                  Current Range: {cngLevel * kmPerPoint}km
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-blue-950">
                  <thead>
                    <tr className="bg-blue-100">
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-900 font-semibold text-sm sm:text-base">
                        Bunk
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-900 font-semibold text-sm sm:text-base">
                        Distance
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-900 font-semibold text-sm sm:text-base">
                        Status
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-blue-900 font-semibold text-sm sm:text-base">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bunk.map((b) => {
                      const status = getBunkStatus(b);
                      return (
                        <tr
                          key={b.id}
                          className="border-b last:border-none hover:bg-blue-50 transition"
                        >
                          <td className="px-2 sm:px-4 py-2">
                            <div className="flex items-center gap-2">
                              <Image
                                src={getServiceLogo(b.service)}
                                alt={`${b.service} logo`}
                                width={24}
                                height={24}
                                className="object-contain w-auto h-auto"
                              />
                              <span className="text-sm sm:text-base">
                                {b.id}. {b.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-2 text-sm sm:text-base">
                            {b.distance}km
                          </td>
                          <td
                            className={`px-2 sm:px-4 py-2 text-sm sm:text-base ${getStatusColor(
                              status
                            )}`}
                          >
                            {status}
                          </td>
                          <td className="px-2 sm:px-4 py-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleBunkChoose(b)}
                                className="px-2 sm:px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm sm:text-base"
                              >
                                Choose
                              </button>
                              <a
                                href={`https://www.google.com/maps?q=${b.address.lat},${b.address.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded transition"
                                title="View on Google Maps"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Bunk Status */}
          <div className="w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400 text-center p-2 sm:p-0">
              Bunk Status
            </h2>
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
              {selectedBunk ? (
                <div className="space-y-4">
                  <div className="p-3 sm:p-4 bg-blue-200 text-blue-900 rounded-lg">
                    <h3 className="text-base sm:text-lg font-semibold mb-2">
                      Selected Bunk:
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Image
                            src={getServiceLogo(selectedBunk.service)}
                            alt={`${selectedBunk.service} logo`}
                            width={32}
                            height={32}
                            className="object-contain w-auto h-auto"
                          />
                          <span className="font-semibold text-sm sm:text-base">
                            {selectedBunk.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            ({selectedBunk.distance}km)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {nextBunk && (
                    <div className="p-3 sm:p-4 bg-yellow-100 text-blue-900 rounded-lg">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">
                        Next Optimal Bunk:
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <Image
                              src={getServiceLogo(nextBunk.service)}
                              alt={`${nextBunk.service} logo`}
                              width={32}
                              height={32}
                              className="object-contain w-auto h-auto"
                            />
                            <span className="font-semibold text-sm sm:text-base">
                              {nextBunk.name}
                            </span>
                            <span className="text-sm text-gray-600">
                              ({nextBunk.distance}km)
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Distance from selected:{" "}
                            {nextBunk.distance - (selectedBunk?.distance || 0)}
                            km
                          </div>
                        </div>
                        <button
                          onClick={() => handleBunkChoose(nextBunk)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm sm:text-base"
                        >
                          Choose
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-600 text-center py-4">
                  Select a bunk to see next optimal options
                </div>
              )}

              {cngLevel * kmPerPoint < 20 && (
                <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-sm sm:text-base">
                  ⚠️ Warning: Your CNG level is very low. Please refuel soon!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
