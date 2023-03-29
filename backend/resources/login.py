from flask import request, redirect, url_for
from flask_restful import Resource
from flask_bcrypt import Bcrypt
from db_connection import ssh_connect, get_db, general_query, general_insert_update
from login_check import make_token

conn = get_db(ssh_connect(), False)
bcrypt = Bcrypt()

# Maybe need to convert it to private method or protect method?
class UserInfo:
    def __init__(self, row):
        self.account = f'{row["account"]}'
        self.password = f'{row["password"]}'
        self.nickname = f'{row["nickname"]}'
        self.image =  int(row["image"])
        self.badge = f'{row["badge"]}'
        self.title = f'{row["title"]}'
        self.achievement = f'{row["achievement"]}'
        self.total_like =  int(row["total_like"])
        self.templike = int(row["templike"])

    def check_exist(username)  :
        query_string = f"""
            SELECT * 
            FROM public.user 
            WHERE account = '{username}' 
        """
        query_result = general_query(query_string, conn)
        if len(query_result) == 1:
            status = True
            result = query_result[0]
            user_obj = UserInfo(result)
        else:
            status = False
            user_obj = {}

        return status, user_obj

    def login_record(account, status=True, reason=None):
        if status:
            reason = 'NULL'
            update_string = f"""
                UPDATE public.user
                SET last_login = now()
                WHERE account = '{account}'
            """
            general_insert_update(update_string, conn)
        else:
            reason = reason

        insert_string = f"""
            INSERT INTO public.login_record
            (account, status, reason, time)
            VALUES('{account}', {status}, '{reason}', now())
        """
        insert_string.replace("'NULL'", "NULL")
        general_insert_update(insert_string, conn)


class SignUpUser:  # for SignUp page
    def __init__(self, row):
        self.account = f'{row["account"]}'
        self.password = bcrypt.generate_password_hash(row["password"]).decode('utf-8')
        self.email = f'{row["email"]}'
        self.nickname = f'{row["nickname"]}'
        self.image = 1
        self.register_area = 1

    # hashed_password = bcrypt.generate_password_hash(password=user["password"]).decode('utf-8')
    def create_user(self):
        insert_string = f"""
            INSERT INTO public.user
            (
                account, password, email, nickname, image, register_area, create_time
            )
            VALUES(
                '{self.account}', 
                '{self.password}', 
                '{self.email}', 
                '{self.nickname}', 
                {self.image},
                {self.register_area},
                now()
            )
        """
        result = general_insert_update(insert_string, conn)

        if result:
            print("Create Successful.")
            return True
        else:
            print("Create Failed.")
            return False

class Users(Resource):
    def get(name):
        print("Getting user_list")
        result = general_query(f"SELECT * FROM public.user WHERE account = '{name}'", conn)
        return result


class SignUp(Resource):
    def get(self):
        pass
    
    def post (self):
        user = {
            'account': request.get_json().get('userAccount'),
            'password': request.get_json().get('userPassword'),
            'email': request.get_json().get('email'),
            'nickname': request.get_json().get('nickname')
        }
        user_obj = SignUpUser(user)
        status, _ = UserInfo.check_exist(user_obj.account)
        print(status)
        if status:
            return {
                'message': 'Duplicate Account',
                'info': {}
            }, 201
        else:
            result = user_obj.create_user()
            if result:
                return {
                    'message': 'Create Successful',
                    'info': {},
                    'status': 200,
                }, 200
            else:
                return {
                    'message': 'Create Failed',
                    'info': {}
                }, 202
    def delete (self):
        pass
    def put (self):
        pass


class Login(Resource):
    def get(self, name):
        pass

    def post(self):
        user = {
            'account': request.get_json().get('userAccount'),
            'password': request.get_json().get('userPassword')
        }
        status, user_info = UserInfo.check_exist(user['account'])
        if status:  # If get user account correctly
            check_password = bcrypt.check_password_hash(user_info.password.encode('utf-8'), user["password"])
            if check_password:  # If user give the correct credential
                UserInfo.login_record(user_info.account)
                result = make_token(user_info.account)
                msg = result["message"]
                token = result["token"]

                return {
                    'message': msg,
                    'token': token,
                    'info': {
                        "account": user_info.account,
                        "nickname": user_info.nickname,
                        "image": user_info.image
                    },
                    'status': 200,
                }, 200
            else:
                UserInfo.login_record(user_info.account, status=False, reason='Wrong Password')
                return {
                    'message': 'Wrong Password',
                    'info': {}
                }, 203
        else:
            return {
                'message': 'Account Not Found',
                'info': {}
            }, 204

    def put(self, name):
        pass

    def delete(self, name):
        pass


class User(Resource):
    def get(self):
        pass
    def post(self):
        user = {
            'account': request.get_json().get('account'),
            'oldPassword': request.get_json().get('oldPassword'),
            'newPassword': request.get_json().get('newPassword'),
        }
        query_string = f"""
            SELECT * 
            FROM public.user
            WHERE account = '{user['account']}'
        """
        user_info = UserInfo(general_query(query_string, conn)[0])
        check_password = bcrypt.check_password_hash(user_info.password.encode('utf-8'), user["oldPassword"])
        if check_password:
            user_info.password = bcrypt.generate_password_hash(user["newPassword"]).decode('utf-8')
            update_string = f"""
                UPDATE public.user
                SET update_time = now(), password = '{user_info.password}'
                WHERE account = '{user_info.account}'
            """
            result = general_insert_update(update_string, conn)

            if result:
                return {
                    "message": "Change Password Successful. Please use new password login next time.",
                    "info": {},
                    'status': 200,
                }, 200
            else:
                return {
                    "message": "Internal Server Error",
                    "info": {}
                }, 205
        else:
            return {
                "message": "Old Password is not correct",
                "info": {}
            }, 206




    def patch(self):
        user = {
            'account': request.get_json().get('account'),
            'nickname': request.get_json().get('modNickname'),
            'image': request.get_json().get('index'),
        }

        query_string = f"""
            SELECT * 
            FROM public.user
            WHERE account = '{user['account']}'
        """
        user_obj = UserInfo(general_query(query_string, conn)[0])
        if len(user['nickname']) == 0:
            user['nickname'] = user_obj.nickname

        if len(str(user['image'])) == 0:
            user['image'] = int(user_obj.image)

        # For Modify Nickname and Image even though not changed.
        update_string = f"""
            UPDATE public.user
            SET nickname = '{user['nickname']}', image = {user['image']}, update_time=now()
            WHERE account = '{user['account']}'
        """
        result = general_insert_update(update_string, conn)
        if result:
            return {
                "message": "Change Successful",
                'status': 200,
            }, 200
        else:
            return {
                "message": "Internal Server Error"
            }, 207

    def delete(self):
        pass