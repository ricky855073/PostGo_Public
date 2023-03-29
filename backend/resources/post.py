from flask import request, redirect, url_for
from flask_restful import Resource, reqparse
from datetime import datetime, timezone, timedelta
from db_connection import ssh_connect, get_db, general_query, general_insert_update
from login_check import logincheck
import requests
import os
from nsfw_detector import predict
from bs4 import BeautifulSoup as BSHTML

conn = get_db(ssh_connect(), False)
model = predict.load_model('./resources/nsfw_mobilenet2.224x224.h5')
def account_latest_post(area, account):
    query_string = f"""
        SELECT r.*, pu.nickname, pu.image 
        FROM
        (
            SELECT *
            FROM public.post
            WHERE area = {area} and account = '{account}'
            ORDER BY create_time DESC
            LIMIT 1
        ) r
        LEFT JOIN public.user pu
        ON r.account = pu.account 
    """
    result = general_query(query_string, conn)

    return CreatedPostSchema(result[-1])


def bulletin_latest_post(area, limit=5):
    area_post_list = list()
    query_string = f"""
        SELECT r.*, pu.nickname, pu.image 
        FROM
        (
            SELECT *
            FROM public.post
            WHERE area = {area}
            ORDER BY create_time DESC
            LIMIT {limit}
        ) r
        LEFT JOIN public.user pu
        ON r.account = pu.account 
    """
    result = general_query(query_string, conn)
    area_post = [CreatedPostSchema(item) for item in result]

    for post_obj in area_post:
        area_post_list.append({
            "post_id": post_obj.post_id,
            "create_time": post_obj.create_time,
            "content": post_obj.content,
            "like": post_obj.like,
            "account": post_obj.account,
            "userinfo": {
                "nickname": post_obj.nickname,
                "image": post_obj.image
            }
        })

    return area_post_list


class PostSchema:
    def __init__ (self, row):
        self.account = f'{row["account"]}'
        self.content = f'{row["content"]}'
        self.area = int(row["area"])

    def create_post(self):
        insert_string = f"""
            INSERT INTO public.post
            (account, content, area, create_time)
            VALUES('{self.account}', '{self.content}', {self.area}, now())
        """
        result = general_insert_update(insert_string, conn)

        return True if result else False


class CreatedPostSchema(PostSchema):
    def __init__(self, row):
        super().__init__(row)
        self.post_id = int(row["post_id"])
        self.like = int(row["like"])
        self.create_time = row["create_time"].astimezone(timezone(offset = timedelta(hours = 8))).strftime('%Y-%m-%d %H:%M:%S')
        self.nickname = f'{row["nickname"]}'
        self.image = row["image"]


class Post(Resource):
    def get(self):

        result, status_code = logincheck(request)
        if int(status_code) == 403:
            return {
                "message": "no token",
                "info":{}
            },230
        elif int(status_code) == 440:
            return {
                "message": "Session Expired",
                "info":{}
            }, 240
        elif int(status_code) == 500:
            return {
                "message": "Internal Server Error",
                "info":{}
            }, 250

        obj_list = list()
        area = {
            'area': int(request.get_json().get('area')),
            'limit': int(request.get_json().get('limit'))
        }
        query_string = f"""
            SELECT pp.*, pu.nickname, pu.image
            FROM public.post pp
            left join public.user pu
            on pp.account = pu.account
            WHERE area = {area['area']}
            ORDER BY create_time DESC
            LIMIT {area['limit']}
        """
        result = general_query(query_string, conn)

        for item in result:
            post_obj = CreatedPostSchema(item)
            obj_list.append({
                "create_time":post_obj.create_time,
                "content":post_obj.content,
                "like":post_obj.like,
                "account":post_obj.account,
                "userinfo": {
                    "nickname":post_obj.nickname,
                    "image":post_obj.image
                }
            })

        return obj_list

    def post(self):
        result, status_code = logincheck(request)
        if int(status_code) == 403:
            return {
                "message": "no token",
                "info":{}
            }, 243
        elif int(status_code) == 440:
            return {
                "message": "Session Expired",
                "info":{}
            }, 244
        elif int(status_code) == 500:
            return {
                "message": "Internal Server Error",
                "info":{}
            }, 250

        post_info = {
            'account': request.get_json().get('account'),
            'content': request.get_json().get('contentData'),
            'area': request.get_json().get('area')
        }
        soup = BSHTML(post_info['content'])
        images = soup.findAll('img')
        for index,image in enumerate(images):
            print(image['src'])
            img = requests.get(image['src'])
            with open("images"  + str(index) + ".jpg", "wb") as file:  
                file.write(img.content)
                result = predict.classify(model, "images"  + str(index) + ".jpg")
                print(result)
                if(result["images"  + str(index) + ".jpg"]['drawings']+result["images"  + str(index) + ".jpg"]['neutral']<0.70):
                    return {
                "message": "NSFW content",
                "info":{}
            }, 244
                
        post_obj = PostSchema(post_info)
        result = post_obj.create_post()

        if result:
            created_post = account_latest_post(account=post_obj.account, area=post_obj.area)
            return {
                'message': 'Create Post Success!',
                "content": created_post.content,
                "create_time": created_post.create_time,
                "account": created_post.account,
                "like": created_post.like,
                "userinfo": {
                    "nickname": created_post.nickname,
                    "image": created_post.image
                },
                    'status': 200,
            }, 200
        else:
            return {
               'message': 'Create Post Failed!',
               'info': 'Internal Service Error'
           }, 250


class BulletinPost(Resource):
    def post(self):
        result, status_code = logincheck(request)
        if int(status_code) == 403:
            return {
                "message": "no token",
                "info":{}
            }, 243
        elif int(status_code) == 440:
            return {
                "message": "Session Expired",
                "info":{}
            }, 240
        elif int(status_code) == 500:
            return {
                "message": "Internal Server Error",
                "info":{}
            }, 251

        area = {
            'area': int(request.get_json().get('area')),
            'limit': int(request.get_json().get('limit'))
        }

        area_post = bulletin_latest_post(area['area'], area['limit'])
        print(area_post)

        return {
            'message': 'Bulletin Update Successful',
            'info': {
                "pinned_post_arr": area_post
            },
                    'status': 200,
        }, 200
        # else:
        #     return {
        #         'message': 'Internal Service Error (Bad Gateway)',
        #         'info': {}
        #     }, 503

    def get(self):
        pass
    def put(self):
        pass
    def delete(self):
        pass