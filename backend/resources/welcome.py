from flask_restful import Resource

class Welcome (Resource):
    def get(self):
        return {
            'resultStatus': 'SUCCESS',
            'message': "Welcome to postGo!"
        }, 200
