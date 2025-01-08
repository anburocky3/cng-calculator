import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";
import * as cheerio from "cheerio";

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

    // console.log(provider, station_id);

    if (provider === "torrent") {
      const response = await fetchTorrentApi(station_id);

      return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      });
    } else if (provider === "agp") {
      const response = await fetchAGPApi(station_id);

      return new Response(JSON.stringify({ rate: response }), {
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
      });
    } else if (provider === "megha") {
      const response = await fetchMeghaGas(station_id);

      return new Response(JSON.stringify(response), {
        status: 200,
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
  const agent = new https.Agent({
    rejectUnauthorized: false, // Set to true in production for security
  });

  try {
    const response = await axios.get(
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
        httpsAgent: agent, // Use the custom agent
      }
    );

    // Parse the response data using Cheerio
    const $ = cheerio.load(response.data);

    // Select price elements
    const priceElements = $(".priceTxt");

    if (priceElements.length > 0) {
      const priceText = priceElements.first().text().trim(); // Get the first price text
      const lastUpdatedTxt =
        priceElements.length > 1 ? priceElements.eq(1).text().trim() : ""; // Get the second price text if available

      const rate = parseFloat(priceText.replace("Rs. ", "").replace(",", ""));

      // Return or use the rate and lastUpdatedTxt as needed
      return { rate, lastUpdatedTxt };
    }

    return { rate: null, lastUpdatedTxt: "" };
  } catch (error) {
    console.error("Error fetching Torrent API:", error);
    throw error; // Rethrow the error for further handling if needed
  }
}

async function fetchAGPApi(stationId: number | string) {
  // Create an HTTPS agent that ignores SSL certificate errors
  const agent = new https.Agent({
    rejectUnauthorized: false, // Set to true in production for security
  });

  try {
    const response = await axios.get(
      `https://www.agppratham.com/cng/stations-locator/tamil-nadu/${stationId}`,
      {
        headers: {
          accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
          "accept-language": "en-IN,en;q=0.9,kn;q=0.8,en-GB;q=0.7,ta;q=0.6",
          "sec-ch-ua":
            '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
          cookie:
            "_d8=afe3308afcc1f6709e128d9a617f8275; _d9=90a17762635af41f0db405b91fb6f324; XSRF-TOKEN=eyJpdiI6IjJGL25OWWJKUFlLTnJ5MUN5cjd0SWc9PSIsInZhbHVlIjoiNmdncGc0c1Q0K010aGE0VmdvMGJKTGNwV2xjTS9ScVgzbkFXRWlxbTJ3T21MaWFteHZlVkRoblBKQzhjbDZDVEpiUGJqeEl1SmZVU3YrU092SGw4YzRhZE80bElpR09kM0Vvck0zVmtiUkt3RjdMTzJCYzQrRGU4UGN3MkRpRFkiLCJtYWMiOiI3YjUzYjJjYTk1MTQ3MWRiODFkYjg1MmQwMTMyYTVkYzcwYjMyNjQyN2VlNzRkMDNkMWYzZDJlMDNmZjM3MWNiIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6IkRmTU5YeEtYRWhISzhwNVFjMG4vMXc9PSIsInZhbHVlIjoiL2ZCRnpGS2ttUmdiWGYydFBhSUFFV1hSa1Z3NFBSQm5pWUkwUkduZW5Dc1p2UjRjY1d3T3p3eGt1anBROHNhQ3NKMElaK3lMNjlvbWpXRk1rVGJYc20wSlQ1TkxYejJ6aEluTkNWd2R1YjRqRk1lT3l4QUJZNDNnVUM5dFlrTnUiLCJtYWMiOiIyMmQzYTEyNTQ3ZDQ5Mjk2MDE2Njc5YmNiZDU5ZjU4MGRmODFkODk0ODg3OTMwYmM2YjM2MmRlY2NkMjY0ZWM2IiwidGFnIjoiIn0%3D",
          Referer: `https://www.agppratham.com/cng/stations-locator/tamil-nadu/${stationId}`,
          "Referrer-Policy": "strict-origin-when-cross-origin",
        },
        httpsAgent: agent, // Use the custom agent
      }
    );

    // Parse the response data using DOMParser
    const $ = cheerio.load(response.data);

    // CNG List container
    const rateValue = $("#cng_list_con")
      .find("dd span") // Find the <span> inside <dd> elements
      .first()
      .text(); // Get the text content

    return rateValue;
  } catch (error) {
    console.error("Error fetching AGP API:", error);
    throw error; // Rethrow the error for further handling if needed
  }
}

async function fetchMeghaGas(stationId: number | string) {
  // Create an HTTPS agent that ignores SSL certificate errors
  const agent = new https.Agent({
    rejectUnauthorized: false, // Set to true in production for security
  });

  try {
    const response = await axios.get(`https://meghagas.com/check-cng-price`, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "en-IN,en;q=0.9,kn;q=0.8,en-GB;q=0.7,ta;q=0.6",
        "cache-control": "max-age=0",
        priority: "u=0, i",
        "sec-ch-ua":
          '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        cookie:
          "ci_session=6gej2v05sprivgpcf2hshi1i6hldnfdf; twk_idm_key=USSG2A7nO9WsxM22rNvlk; TawkConnectionTime=0; twk_uuid_62b40e5ab0d10b6f3e78e2b6=%7B%22uuid%22%3A%221.SwvwFB1JCp9HTjbvQNUZCTgoYh8ff9tPwJETeL3MdOFqjuZRWNwi8zO9MRpVKeFT8RzijNXx17Wy2YuYx3UGTsULLZp3ur3RyeeBM8BxqKR2mPxyrP1B8%22%2C%22version%22%3A3%2C%22domain%22%3A%22meghagas.com%22%2C%22ts%22%3A1736373763475%7D",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      httpsAgent: agent, // Use the custom agent
    });

    // Parse the response data using DOMParser
    const $ = cheerio.load(response.data);

    const targetTd = $("td:contains('" + stationId + "')");

    const parentTr = targetTd.closest("tr");

    if (parentTr.length > 0) {
      // Extract the values from the appropriate <td> elements
      const rate = parentTr
        .find("td")
        .eq(3)
        .text()
        .trim()
        .replace("₹", "")
        .trim(); // 82.00
      const lastUpdatedTxt = parentTr.find("td").eq(6).text().trim(); // 18.10.2023

      // Return or use the extracted values as needed
      return { rate, lastUpdatedTxt };
    }

    return { rateValue: null, updatedTxt: "" };
  } catch (error) {
    console.error("Error fetching AGP API:", error);
    throw error; // Rethrow the error for further handling if needed
  }
}
