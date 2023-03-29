from flask_restful import Resource, reqparse
from db_connection import ssh_connect, get_db, general_query, general_insert_update
from login_check import logincheck
from flask import request

conn = get_db(ssh_connect(), False)

parser = reqparse.RequestParser()
parser.add_argument('Authorization')


class BulletinSchema:
    def __init__(self, row):
        self.area = int(row["area"])
        self.name = f'{row["name"]}'
        self.lng = float(row["area_longitude"])
        self.lat = float(row["area_latitude"])
        self.radius = float(row["area_radius"])
        self.icon = int(row["icon"])
        self.pinned_post_arr = f'{row["pinned_post_arr"]}'
        self.post_arr = f'{row["post_arr"]}'


class Bulletin (Resource):
    def get(self):

        result, status_code = logincheck(request)
        if int(status_code) == 403:
            return {
                "message": "no token",
                "info":{}
            }, 230
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

        lng_lat_list = list()
        query_string = """
            SELECT * FROM public.bulletin
        """
        result = general_query(query_string, conn)

        for item in result:
            bulletin_obj = BulletinSchema(item)
            lng_lat_list.append({
                "bulletin_loc":{
                "lat": bulletin_obj.lat,
                "lng": bulletin_obj.lng},
                "name": bulletin_obj.name,
                "area": bulletin_obj.area,
                "radius": bulletin_obj.radius
            })

        return lng_lat_list

    def post(self):
        pass

    def put(self):
        pass

    def delete(self):
        pass