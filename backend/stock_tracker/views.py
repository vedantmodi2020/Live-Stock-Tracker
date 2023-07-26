from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .utils import get_live_stock_data, get_best_match_data
from rest_framework import status
from yahoo_fin.stock_info import *
import pandas as pd
import time
import json
import requests
import io
import queue
from threading import Thread

from .logger import Logger

logger = Logger("Authentication: Home Page and Authentication")

stock_types = {
    "Nifty 50": tickers_nifty50,
    "Dow Jones Industrial Average": tickers_dow,
    "Nasdaq 100": tickers_nasdaq,
    "FTSE 100": tickers_ftse100,
    "FTSE 250": tickers_ftse250,
    "Nifty Bank": tickers_niftybank,
}


class GetAllStocksView(APIView):

    permission_classes = (IsAuthenticated,)

    def post(self, request):
        logger.info(
            f"Calling the yahoo finance api to fetch the Nifty 50 STOCKS")
        stock_type = request.data.get("stock_type")
        result = stock_types[stock_type]()
        logger.info(f"SuccessFully fetched the DATA for the stocks")

        return Response(result)


class GetDataForSingleStock(APIView):

    permission_classes = (IsAuthenticated,)

    def get_quote_table_data(self, ticker, dict_result=True):

        try:
            logger.info(
                f"Calling the yahoo api to fetch the data for this stock: {ticker}")
            site = "https://finance.yahoo.com/quote/" + ticker + "?p=" + ticker
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'}
            tables = pd.read_html(requests.get(site, headers=headers).text)
            data = pd.concat(tables, ignore_index=True)
            data.columns = ["attribute", "value"]
            quote_price = pd.DataFrame(
                ["Quote Price", get_live_price(ticker)]).transpose()
            quote_price.columns = data.columns.copy()
            data = pd.concat([data, quote_price], ignore_index=True)
            data = data.sort_values("attribute")
            data = data.drop_duplicates().reset_index(drop=True)
            data["value"] = data.value.map(force_float)
            data = data.to_json(orient="records")
            data = json.loads(data)
            logger.info(f"Successfully convert the data to the json object")
            if dict_result:
                result = {entry["attribute"]: entry["value"] for entry in data}
                return result

            logger.info(
                f"Successfully fetched the data for this stock: {ticker}")

            return data

        except requests.exceptions.HTTPError as http_err:
            logger.error(f"HTTP error occurred: {http_err}")
        except requests.exceptions.RequestException as req_err:
            logger.error(f"Error occurred during the request: {req_err}")
        except Exception as err:
            logger.error(f"An error occurred: {err}")

    def post(self, request):
        try:
            stock_name = request.data.get("stock_name")
            print(
                f"Calling the Yahoo API to get the data for this stock: {stock_name}")
            result = {}
            num_of_threads = len(stock_name)
            thread_list = []
            que = queue.Queue()
            for i in range(num_of_threads):
                thread = Thread(target = lambda q, arg1: q.put({stock_name[i]: self.get_quote_table_data(arg1)}), args = (que, stock_name[i]))
                thread_list.append(thread)
                thread_list[i].start()

            for thread in thread_list:
                thread.join()

            
            while not que.empty():
                data = que.get()
                result.update(data)
            
            # for stocks in stock_name:
            #     response = self.get_quote_table_data(stocks)
            #     result[stocks] = response
            # try:

            # except Exception as e:
            #     # stock_name = get_best_match_data(stock_name)
            #     # response = yf.download(
            #     #     stock_name, period="1d", group_by='date', interval="60m")
            #     # response = get_quote_table(stock_name)
            #     # result = json.loads(response.to_json(orient="records"))
            logger.info(
                f"Successfully fetched the data for this stock: {stock_name}")

            return Response(result)

        except Exception as e:
            logger.error(
                f"Error occured when calling the yf api for the {str(request.data.get('stock_name'))} : {str(e)}")
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
