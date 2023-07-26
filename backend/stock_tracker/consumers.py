import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async, async_to_sync
from django_celery_beat.models import PeriodicTask, IntervalSchedule
from stock_tracker.models import StockDetail
from django.contrib.auth.models import User
import asyncio
import string
import random
import copy




class StockConsumer(AsyncWebsocketConsumer):


    def create_random_string(self,length):
        letters_and_digits = string.ascii_letters + string.digits
        return ''.join(random.choice(letters_and_digits) for i in range(length))
    
    def create_dummy_user(self):
        random_username = self.create_random_string(8) 
        random_password = self.create_random_string(12) 

        # Use loop.run_in_executor to call the synchronous create_user() method asynchronously
        return asyncio.get_event_loop().run_in_executor(None, User.objects.create_user, random_username, random_password)


    @sync_to_async
    def addToCeleryBeat(self, stockpicker):
        task = PeriodicTask.objects.filter(name="every-10-seconds")
        if len(task) > 0:
            print("hello")  # testing that task.first() will work or not
            task = task.first()
            args = json.loads(task.args)
            args = args[0]
            for x in stockpicker:
                if x not in args:
                    args.append(x)
            task.args = json.dumps([args])
            task.save()
        else:
            schedule, created = IntervalSchedule.objects.get_or_create(
                every=10, period=IntervalSchedule.SECONDS)
            task = PeriodicTask.objects.create(
                interval=schedule, name='every-10-seconds', task="stock_tracker.tasks.update_stock", args=json.dumps([stockpicker]))
            

    @sync_to_async    
    def addToStockDetail(self, stockpicker):
        user = self.scope["user"]
        for i in stockpicker:
            stock, created = StockDetail.objects.get_or_create(stock = i)
            stock.user.add(user)

    async def connect(self):
        self.room_name = "track"
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()


    @sync_to_async
    def helper_func(self):
        user = self.scope["user"]
        stocks = StockDetail.objects.filter(user__id = user.id)
        task = PeriodicTask.objects.get(name = "every-10-seconds")
        args = json.loads(task.args)
        args = args[0]
        for i in stocks:
            i.user.remove(user)
            if i.user.count() == 0:
                args.remove(i.stock)
                i.delete()
        if args == None:
            args = []

        if len(args) == 0:
            task.delete()
        else:
            task.args = json.dumps([args])
            task.save()

    async def disconnect(self, close_code):

        await self.helper_func()

        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['stockpicker']

        temp_user = await self.create_dummy_user()

        self.scope["user"] = temp_user

        await self.addToCeleryBeat(text_data_json['stockpicker'])

        

        await self.addToStockDetail(text_data_json['stockpicker'])

        await self.channel_layer.group_add(
            "stock_track",
            self.channel_name
        )

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_stock_update',
                'message': message,
            }
        )

    @sync_to_async
    def selectUserStocks(self):
        user = self.scope["user"]
        user_stocks = user.stockdetail_set.values_list('stock', flat = True)
        return list(user_stocks)

    # Receive message from room group
    async def send_stock_update(self, event):
        message = event['message']
        message = copy.deepcopy(message)

        user_stocks = await self.selectUserStocks()

        # If the message is a dictionary
        if isinstance(message, dict):
            keys_to_remove = [key for key in message if key not in user_stocks]
            for key in keys_to_remove:
                del message[key]
            # Remove the 'user' key from the dictionary
            message.pop('user', None)

        # If the message is a list
        elif isinstance(message, list):
            message = [item for item in message if item in user_stocks]

        # Send message to WebSocket
        await self.send(text_data=json.dumps(message))
