from django.urls import path
from . import views


urlpatterns = [
     path('get_stocks/', views.GetAllStocksView.as_view(), name ='get-stocks'),
     path('get_selected_stock/',views.GetDataForSingleStock.as_view(),name='specific-data'),     
]