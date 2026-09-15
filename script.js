/* ======================================================
   SHARED ELECTION RESULTS ENGINE
   Combines the logic previously duplicated across
   assembly.html, council.html, and lowerResults.html.

   Each page includes this file, then calls
   initResultsPage(config) with its own settings
   (party -> element mapping, refresh interval, etc).
   ====================================================== */

/* ======================================================
   GOOGLE SHEET SETTINGS
   (same sheet/tab used by all three pages)
   ====================================================== */

const SHEET_ID = "15VqCGaHDqLh69LNZBGpR1EYbgHPVmNY_NgytCP6wMKo";
const SHEET_NAME = "StreamCalled";


/* ======================================================
   BUILD GOOGLE SHEETS URL
   ====================================================== */

function buildSheetUrl(sheetName) {

  const tab = sheetName || SHEET_NAME;

  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq`
       + `?tqx=out:json&sheet=${encodeURIComponent(tab)}`;

}


/* ======================================================
   PARSE GOOGLE SHEETS RESPONSE
   ====================================================== */

function parseGoogleResponse(rawText) {

  const match = rawText.match(
    /google\.visualization\.Query\.setResponse\(([\s\S]*)\);?\s*$/
  );

  if (!match) {
    throw new Error(
      "Could not find expected data in the sheet response."
    );
  }

  return JSON.parse(match[1]);

}


/* ======================================================
   EXTRACT RESULTS
   Column A = party name, Column B = seats, Column C = percent.
   Returns { partyName: { seats, percent } }.
   ====================================================== */

function extractResults(sheetJson) {

  const results = {};

  sheetJson.table.rows.forEach(row => {

    const partyName =
      row.c[0] ? row.c[0].v : null;

    const seatCount =
      row.c[1] ? row.c[1].v : null;

    const percent =
      row.c[2] ? row.c[2].v : null;


    if (partyName) {

      results[partyName] = {
        seats: seatCount,
        percent: percent
      };

    }

  });

  return results;

}


/* ======================================================
   UPDATE PAGE
   Generic across all three pages. Behaviour is driven by
   the "config" object passed in from each page:

     config.partyToElements  { partyName: { seats: id, percent?: id } }
     config.valuesKey        optional party key treated as the
                              "TO WIN / % COUNTED" stats row
     config.missingDataFallback(partyName, seatsEl, percentEl)
                              optional callback run when a party
                              has no row in the sheet yet

   Pages that don't track percent (e.g. the lower third) simply
   omit "percent" from their element mapping.
   ====================================================== */

function updatePage(results, config) {

  for (const partyName in config.partyToElements) {

    const elements =
      config.partyToElements[partyName];

    const partyData =
      results[partyName];


    const seatsElement =
      elements.seats ? document.getElementById(elements.seats) : null;

    const percentElement =
      elements.percent ? document.getElementById(elements.percent) : null;


    /* -----------------------------------------------
       No data for this party yet
       ----------------------------------------------- */

    if (!partyData) {

      if (config.missingDataFallback) {
        config.missingDataFallback(partyName, seatsElement, percentElement);
      }

      continue;

    }


    /* -----------------------------------------------
       VALUES / STATS row (e.g. "TO WIN" / "% COUNTED")
       ----------------------------------------------- */

    if (config.valuesKey && partyName === config.valuesKey) {

      if (seatsElement) {
        seatsElement.textContent =
          (partyData.seats === null ||
           partyData.seats === undefined)
            ? "-- to win"
            : "TO WIN: " + partyData.seats;
      }

      if (percentElement) {
        percentElement.textContent =
          (partyData.percent === null ||
           partyData.percent === undefined)
            ? "--% counted"
            : partyData.percent + "% COUNTED";
      }

      continue;

    }


    /* -----------------------------------------------
       PARTY SEATS
       ----------------------------------------------- */

    if (seatsElement) {
      seatsElement.textContent =
        (partyData.seats === null ||
         partyData.seats === undefined)
          ? "--"
          : partyData.seats;
    }


    /* -----------------------------------------------
       PARTY PERCENT
       ----------------------------------------------- */

    if (percentElement) {
      percentElement.textContent =
        (partyData.percent === null ||
         partyData.percent === undefined)
          ? "--%"
          : partyData.percent + "%";
    }

  }

}


/* ======================================================
   REFRESH DATA
   ====================================================== */

async function refreshData(config) {

  try {

    const response =
      await fetch(buildSheetUrl());

    const rawText =
      await response.text();

    const sheetJson =
      parseGoogleResponse(rawText);

    const results =
      extractResults(sheetJson);

    updatePage(results, config);

  }

  catch (error) {

    console.error(
      "Failed to refresh sheet data:",
      error
    );

  }

}


/* ======================================================
   INIT
   Call once from each page with its own config:

     initResultsPage({
       refreshIntervalMs: 60 * 1000,
       valuesKey: "VALUES",
       partyToElements: { ... },
       missingDataFallback: function (partyName, seatsEl, percentEl) { ... }
     });
   ====================================================== */

function initResultsPage(config) {

  refreshData(config);

  setInterval(
    () => refreshData(config),
    config.refreshIntervalMs || 60 * 1000
  );

}