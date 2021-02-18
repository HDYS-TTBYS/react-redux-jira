"""jira_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include
from rest_framework import routers

from .views import TaskViewSet, CategoryViewSet, CreateUserView, ListUserView, LoginUserView, ProfileViewSet
router = routers.DefaultRouter()
router.register("category", CategoryViewSet)
router.register("tasks", TaskViewSet)
router.register("profile", ProfileViewSet)

urlpatterns = [
    path("create/", CreateUserView.as_view(), name="create"),
    path("users/", ListUserView.as_view(), name="users"),
    path("loginuser/", LoginUserView.as_view(), name="loginuser"),
    path("", include(router.urls)),
]
