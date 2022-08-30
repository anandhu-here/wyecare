import json
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import async_to_sync, sync_to_async
from channels.layers import get_channel_layer


class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "notification"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()
    
    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        await self.close()

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender_id = text_data_json['sender_id']
        target_id = text_data_json['target_id']
        data = text_data_json['data']
        event = {
            'type':'notify',
            'message':message,
            'sender_id':sender_id,
            'target_id':target_id,
            'data':data,
            'not_type':text_data_json['not_type']
        }
        await self.channel_layer.group_send(self.group_name, event)
    


    async def notify(self, event):
        message = event['message']
        sender_id = event['sender_id']
        target_id = event['target_id']
        data = event['data']
        not_type = event['not_type']
        await self.send(text_data=json.dumps({'message':message, 'sender_id':sender_id, "target_id":target_id, "data":data, "not_type":not_type}))
        