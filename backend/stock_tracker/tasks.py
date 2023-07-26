from celery import shared_task
from threading import Thread
from yahoo_fin.stock_info import *
from channels.layers import get_channel_layer
import asyncio
import pandas as pd
import requests
import json
import queue
from .logger import Logger


logger = Logger("Celery Tasks : ")



def get_quote_table_data(ticker, dict_result=True):

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



@shared_task(bind = True)
def update_stock(self, stockpicker):
    data = {}
    available_stocks = tickers_nifty50()
    for i in stockpicker:
        if i in available_stocks:
            pass
        else:
            stockpicker.remove(i)
    
    n_threads = len(stockpicker)
    thread_list = []
    que = queue.Queue()
    for i in range(n_threads):
        thread = Thread(target = lambda q, arg1: q.put({stockpicker[i]: json.loads(json.dumps(get_quote_table_data(arg1)))}), args = (que, stockpicker[i]))
        thread_list.append(thread)
        thread_list[i].start()

    for thread in thread_list:
        thread.join()

    while not que.empty():
        result = que.get()
        data.update(result)

    # send data to group
    channel_layer = get_channel_layer()
    loop = asyncio.new_event_loop()

    asyncio.set_event_loop(loop)

    loop.run_until_complete(channel_layer.group_send("stock_track", {
        'type': 'send_stock_update',
        'message': data,
    }))

    print("datatatauauya",data)
    
    return json.dumps(data)