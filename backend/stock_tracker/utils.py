import requests
from .logger import Logger

logger = Logger("Alpha Vantage API calls : ")

base_url = 'https://www.alphavantage.co/query' 
apikey = "OD5WAHBCP0ZL460O"

def get_live_stock_data(symbol,again = False):
       
    params = {
        'function': 'TIME_SERIES_DAILY', 
        'symbol': symbol,
        'apikey': apikey
    }
    try:
        response = requests.get(url=base_url,params=params)
        data = response.json()
        print(data,"289318923329832")
        if data.get("Meta Data"):
            return data
        else:
            if not again:
                data = get_best_match_data(symbol)
                return data
            else:
                logger.error("Unable to fetch live stock data")
                return None

    except requests.RequestException as e:
        data = get_best_match_data(symbol)
        return data
    
    except Exception as e:
        logger.error(f"Exception occured during finding the live data for this symbol : {str(symbol)}")
        raise e
    

def get_best_match_data(symbol):
    params = {
        'function' : 'SYMBOL_SEARCH',
        'keywords' : symbol.split('.')[0],
        'apikey' : apikey
    }
    try:
        response = requests.get(url=base_url,params=params)
        data = response.json()
        print("dabciabiqbcc",data)
        if data["bestMatches"] :
            symbol = data.get("bestMatches")[0]["1. symbol"]
            return symbol
        
        else:
            raise requests.RequestException(f"No symbol is found for the particular ticker")
        
    except Exception as e:
        logger.error(f"Exception occured during finding the best match for this symbol : {str(symbol)}")
        raise e
