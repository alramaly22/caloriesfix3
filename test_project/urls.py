from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from accounts import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('main/', views.main, name='main'),
    path('breakfast/', views.breakfast, name='breakfast'),
    path('salads/', views.salads, name='salads'),
    path('menu/', views.menu, name='menu'),
    path('checkout/', views.checkout, name='checkout'),
    path('order_success/', views.order_success, name='order_success'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
