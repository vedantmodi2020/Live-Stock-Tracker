from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

from .logger import Logger

logger = Logger("Authentication: Home Page and Authentication")


class HomeView(APIView):

    permission_classes = (IsAuthenticated, )

    def get(self, request):
        logger.info(f"User logged in the system")
        content = {
            'message': 'Welcome to the Stock Tracker with Yahoo integrated API for the Live data'}
        return Response(content)
    

class LogoutView(APIView):

    permission_classes = (IsAuthenticated,)

    def post(self,request):
        
        try:
            logger.info(f"Backlisting the refresh token for the user")
            refresh_token = request.data.get("refresh_token")
            token = RefreshToken()
            token.blacklist()

            logger.info(f"Successfully deleted the refresh token for the User")

            return Response(status=status.HTTP_205_RESET_CONTENT)
        
        except Exception as e:
            logger.info(f"Error occured during the backlisting of the refresh token")
            return Response(status=status.HTTP_400_BAD_REQUEST)
        




