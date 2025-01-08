import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const providerData = searchParams.get("provider");

  if (!providerData) {
    return NextResponse.json(
      { error: "Provider ID is required" },
      { status: 400 }
    );
  }

  try {
    const districtData = JSON.parse(decodeURIComponent(providerData)); // Parse the district object

    const { provider, station_id } = districtData; // Extract provider and station_id

    console.log(provider, station_id);

    if (provider === "torrent") {
      const response = await fetchTorrentApi(station_id);

      const text = await response.text();

      return new Response(text, {
        status: response.status,
        headers: {
          "Content-Type": "text/html",
        },
      });
    }

    // TODO: Call other apis in future

    return new Response("No response to show", {
      status: 404,
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error fetching CNG cost:", error);
    return new Response("Error fetching data", { status: 500 });
  }
}

async function fetchTorrentApi(stationId: number | string) {
  return await fetch(
    `https://www.torrentgas.com/frontend/web/index.php/site/ajaxgetprice?_csrf=epYdgyWLzHXTikTluKiJXFZFu6-jATqF4WRnAnrINzc5pCW7ZvmkH7DBc4nqwqQWMBXe489UU-mXKFN7V6MAQA%3D%3D&station_id=${stationId}`,
    {
      headers: {
        accept: "text/html, */*; q=0.01",
        "accept-language": "en-IN,en;q=0.9,kn;q=0.8,en-GB;q=0.7,ta;q=0.6",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        cookie:
          "advanced-frontend=7z3Fnwfe9LIGWn0M5QzC5KpR2uEpJXiWGOEdj6cKGIiiSqA61XqGd1QKjinBoy83tCMPAPNALSHdKna8+J/AlWSI55GGyA==; _csrf-frontend=Jrv8ecxC9JZfP49VgoP3PqAq3tSNq98D34XBvt3b96GVfrQ+Q+6ueUf/0+OAYLG26XruWqKxlIzF1mdq6YJhPj5YqEgPakUEMuPQsL1669ZAOmfrdGFhNbeaU/s4zf160DbPYjZ9HtC8eYlclQr4DT82N6wFHwQ/8F8sAbdOF/cA2f7w1ndquDNO3k6tFSmVWso+Nt205yCpHnUXargzRvsBa9QaACkVKHcmrRdGhmOoue+DITXRDvzof8xh1iv4unEQmTyIqiiXBST4qgsxsWBRI/KwkeFV7A8paw==",
        Referer:
          "https://www.torrentgas.com/frontend/web/index.php/site/info/businessarea_cng_stations",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  );
}
