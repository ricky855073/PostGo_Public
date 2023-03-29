from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from flask_restful import Api, reqparse
from resources.bulletin import Bulletin
from resources.login import Login, SignUp, User
from resources.welcome import Welcome
from resources.post import Post, BulletinPost
import paramiko
import requests
from db_connection import ssh_connect, graphql_server


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
api = Api(app)

api.add_resource(Welcome, "/api/")
api.add_resource(Login, "/api/login")
api.add_resource(SignUp, "/api/signUp")
api.add_resource(Bulletin, "/api/bulletin")
api.add_resource(User, "/api/user")
api.add_resource(BulletinPost, "/api/bulletinPost")
api.add_resource(Post, "/api/post")


if __name__ == "__main__":
    app.run(host="localhost", port=5000, debug=True)

