import React from "react";
import classes from "./style.module.css";
import Loader from "../Loader";

const StockTable = ({ isLoading, review_history }) => {
  console.log(review_history, "iwbewibciwbcibew289831938932");

  return (
    <>
      <div className={classes.container}>
        <>
          <div className={`${classes.row} ${classes.header}`}>
            <div>
              <p>Stock Name</p>
            </div>
            <div>
              <p>1y Target Est</p>
            </div>
            <div>
              <p>52 Week Range</p>
            </div>
            <div>
              <p>Ask</p>
            </div>
            <div>
              <p>Avg. Volume</p>
            </div>
            <div>
              <p>Beta (5Y Monthly)</p>
            </div>
            <div>
              <p>Bid</p>
            </div>
            <div>
              <p>Day's Range</p>
            </div>
            <div>
              <p>EPS (TTM)</p>
            </div>
            <div>
              <p>Earnings Date</p>
            </div>
            <div>
              <p>Ex-Dividend Date</p>
            </div>
            <div>
              <p>Forward Dividend &amp; Yield</p>
            </div>
            <div>
              <p>Market Cap</p>
            </div>
            <div>
              <p>Open</p>
            </div>
            <div>
              <p>PE Ratio (TTM)</p>
            </div>
            <div>
              <p>Previous Close</p>
            </div>
            <div>
              <p>Quote Price</p>
            </div>
            <div>
              <p>Volume</p>
            </div>
          </div>
          <div className={classes.dataContainer}>
            {review_history &&
              Object.entries(review_history).map(([stockName, data]) => {
                if (!data) {
                  return <></>;
                } else {
                  const {
                    "1y Target Est": targetEst = "NAN",
                    "52 Week Range": weekRange = "NAN",
                    Ask = "NAN",
                    "Avg. Volume": avgVolume = "NAN",
                    "Beta (5Y Monthly)": beta = "NAN",
                    Bid = "NAN",
                    "Day's Range": dayRange = "NAN",
                    "EPS (TTM)": eps = "NAN",
                    "Earnings Date": earningsDate = "NAN",
                    "Ex-Dividend Date": exDividendDate = "NAN",
                    "Forward Dividend & Yield": forwardDividend = "NAN",
                    "Market Cap": marketCap = "NAN",
                    Open = "NAN",
                    "PE Ratio (TTM)": peRatio = "NAN",
                    "Previous Close": prevClose = "NAN",
                    "Quote Price": quotePrice = "NAN",
                    Volume = "NAN",
                  } = data;
                  return (
                    <div className={classes.row}>
                      <p style={{color:"darkred",fontWeight:'bold'}}>{stockName}</p>
                      <p>{targetEst || "--"}</p>
                      <p style={{color:"royalblue"}}>{weekRange || "--"}</p>
                      <p>{Ask || "--"}</p>
                      <p>{avgVolume || "--"}</p>
                      <p>{beta || "--"}</p>
                      <p>{Bid || "--"}</p>
                      <p style={{color:"goldenrod"}} >{dayRange || "--"}</p>
                      <p>{eps || "--"}</p>
                      <p>{earningsDate || "--"}</p>
                      <p>{exDividendDate || "--"}</p>
                      <p>{forwardDividend || "--"}</p>
                      <p>{marketCap || "--"}</p>
                      <p style={{color:"green"}} >{Open || "--"}</p>
                      <p>{peRatio || "--"}</p>
                      <p>{prevClose || "--"}</p>
                      <p style={{color:"brown"}} >{quotePrice || "--"}</p>
                      <p style={{color:"red"}} >{Volume || "--"}</p>
                    </div>
                  );
                }
              })}
          </div>
        </>
      </div>
    </>
  );
};

export default StockTable;
