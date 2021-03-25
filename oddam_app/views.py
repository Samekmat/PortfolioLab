from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.views import View

from .models import Donation, Institution, CustomUser, Category


class LandingPageView(View):
    def get(self, request):
        bag_counter = 0
        institution_counter = 0
        fundacje = Institution.objects.filter(type='fundacja')
        organizacje = Institution.objects.filter(type='organizacja pozarządowa')
        zbiorki = Institution.objects.filter(type='zbiórka lokalna')
        donations = Donation.objects.all()
        institution_id_list = []
        counter_list = []
        for donation in donations:
            bag_counter += donation.quantity
            if donation.institution_id:
                institution_id_list.append(donation.institution_id)
        for _ in institution_id_list:
            if _ not in counter_list:
                institution_counter += 1
                counter_list.append(_)

        return render(request, 'index.html', {
            'bag_counter': bag_counter,
            'institution_counter': institution_counter,
            'fundacje': fundacje,
            'organizacje': organizacje,
            'zbiorki': zbiorki,
                                              })


class AddDonationView(View):
    def get(self, request):
        return render(request, 'form.html')


class LoginView(View):
    def get(self, request):
        return render(request, 'login.html')

    def post(self, request):
        user = authenticate(email=request.POST.get('email'), password=request.POST.get('password'))
        if user:
            login(request, user)
            return redirect('/')
        return redirect('register')


class RegisterView(View):
    def get(self, request):
        return render(request, 'register.html')

    def post(self, request):
        CustomUser.objects.create_user(
            first_name=request.POST.get('name'),
            last_name=request.POST.get('surname'),
            email=request.POST.get('email'),
            password=request.POST.get('password'),
            password2=request.POST.get('password2'),
        )
        return redirect('login')


class FormView(View):
    def get(self, request):
        if request.user.is_authenticated:
            categories = Category.objects.all()
            return render(request, 'form.html', {'categories': categories})
        else:
            return redirect('login')


class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect('landing-page')
