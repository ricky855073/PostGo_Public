import jwt
import time
from datetime import datetime, timedelta
from flask import request
from flask_restful import reqparse


def make_token(username):
    key = "ACEA0BF9CA274F3030270625332FA59F74AF715FB832F97216C3557384EABB73"
    now = time.time()
    expiretime = 10 * 60
    payload = {
        "username": username,
        "exp": now + expiretime
    }
    token = jwt.encode(payload, key, algorithm='HS256')

    return {
        "message": "Authorize Success",
        "token": token
    }


def logincheck(request):
    # It need to give an username argument to compare the token with it.
    token = request.headers.get('Authorization')
    if not bool(token):
        return {
            "message": "no token"
        }, 403
    else:
        try:
            key = "ACEA0BF9CA274F3030270625332FA59F74AF715FB832F97216C3557384EABB73"
            res = jwt.decode(token, key, algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return {
                "message": "Session Expired"
            }, 440
        except Exception as e:
            return {
                "message": "Internal Server Error"
            }, 500

        username = res['username']

        return {
            "message": "Verification Successful"
        }, 200